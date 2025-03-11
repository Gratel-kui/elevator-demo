"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema with validation rules
const formSchema = z.object({
  companyName: z.string().min(1, { message: "公司名称不能为空" }),
  phoneCountryCode: z
    .string()
    .min(1, { message: "国际区号不能为空" })
    .regex(/^\+\d+$/, { message: "必须是有效的国际区号，例如：+86" }),
  phoneNumber: z
    .string()
    .min(1, { message: "电话号码不能为空" })
    .regex(/^\d+$/, { message: "电话号码只能包含数字" }),
  companyAddress: z.string().min(1, { message: "公司地址不能为空" }),
  billingAddress: z.string().optional(),
  productType: z.enum(["passenger", "hydraulic", "humanoid"], {
    required_error: "请选择产品类型",
  }),
  // 是否使用预设值
  usePresets: z.boolean().optional(),
  // 载重字段
  weight: z.number().min(200).max(10000).optional(),
  predefinedWeight: z.enum(["630", "1000", "1250"]).optional(),
  // 速度字段
  speed: z.number().min(100).max(2000).optional(),
  predefinedSpeed: z.string().optional(),
  // 宽度字段
  width: z.number().min(1000).max(2500).optional(),
  predefinedWidth: z.string().optional(),
}).refine((data) => {
  // 如果产品类型是客梯，则必须选择载重
  if (data.productType === "passenger") {
    if (data.usePresets) {
      return !!data.predefinedWeight;
    } else {
      return !!data.weight;
    }
  }
  return true;
}, {
  message: "请选择或输入载重",
  path: ["predefinedWeight"]
}).refine((data) => {
  // 如果产品类型是客梯，则必须选择速度
  if (data.productType === "passenger") {
    if (data.usePresets) {
      return !!data.predefinedSpeed;
    } else {
      return !!data.speed;
    }
  }
  return true;
}, {
  message: "请选择或输入速度",
  path: ["predefinedSpeed"]
}).refine((data) => {
  // 如果产品类型是客梯，则必须选择宽度
  if (data.productType === "passenger") {
    if (data.usePresets) {
      return !!data.predefinedWidth;
    } else {
      return !!data.width;
    }
  }
  return true;
}, {
  message: "请选择或输入宽度",
  path: ["predefinedWidth"]
});

type FormValues = z.infer<typeof formSchema>;

// Product type mapping for display
const productTypeLabels: Record<string, string> = {
  passenger: "客梯",
  hydraulic: "自动扶梯",
  humanoid: "自动人行道"
};

export function CompanyForm() {
  const [productType, setProductType] = useState<string | undefined>();
  const [usePresets, setUsePresets] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>();
  const [selectedSpeed, setSelectedSpeed] = useState<string | undefined>();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      phoneCountryCode: "",
      phoneNumber: "",
      companyAddress: "",
      billingAddress: "",
      usePresets: true,
    },
  });

  // Update form values when input types change
  useEffect(() => {
    form.setValue("usePresets", usePresets);
  }, [usePresets, form]);

  // Handle form submission
  function onSubmit(data: FormValues) {
    console.log(data);
    alert("表单提交成功！");
  }

  // 根据载重获取可用的速度选项
  const getSpeedOptions = (weight: string | undefined) => {
    if (!weight) return [];
    
    switch (weight) {
      case "630":
        return [{ value: "1100", label: "1100 mm/s" }];
      case "1000":
        return [{ value: "1200", label: "1200 mm/s" }];
      case "1250":
        return [
          { value: "1200", label: "1200 mm/s" },
          { value: "1600", label: "1600 mm/s" },
        ];
      default:
        return [];
    }
  };

  // 根据载重和速度获取可用的宽度选项
  const getWidthOptions = (weight: string | undefined, speed: string | undefined) => {
    if (!weight || !speed) return [];
    
    if (weight === "630") {
      return [{ value: "1400", label: "1400 mm" }];
    } else if (weight === "1000") {
      return [{ value: "2100", label: "2100 mm" }];
    } else if (weight === "1250") {
      if (speed === "1200") {
        return [{ value: "2100", label: "2100 mm" }];
      } else if (speed === "1600") {
        return [{ value: "1400", label: "1400 mm" }];
      }
    }
    return [];
  };

  // 处理载重变化
  const handleWeightChange = (value: string) => {
    setSelectedWeight(value);
    form.setValue("predefinedWeight", value as "630" | "1000" | "1250");
    
    // 重置速度和宽度
    form.setValue("predefinedSpeed", undefined);
    setSelectedSpeed(undefined);
    form.setValue("predefinedWidth", undefined);
  };

  // 处理速度变化
  const handleSpeedChange = (value: string) => {
    setSelectedSpeed(value);
    form.setValue("predefinedSpeed", value);
    
    // 重置宽度
    form.setValue("predefinedWidth", undefined);
  };

  // Handle product type change
  const handleProductTypeChange = (value: string) => {
    setProductType(value);
    form.setValue("productType", value as "passenger" | "hydraulic" | "humanoid");
    
    // Reset fields when product type changes
    form.setValue("predefinedWeight", undefined);
    form.setValue("weight", undefined);
    form.setValue("predefinedSpeed", undefined);
    form.setValue("speed", undefined);
    form.setValue("predefinedWidth", undefined);
    form.setValue("width", undefined);
    setSelectedWeight(undefined);
    setSelectedSpeed(undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公司名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入公司名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="phoneCountryCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>国际区号</FormLabel>
                <FormControl>
                  <Input placeholder="+86" {...field} />
                </FormControl>
                <FormDescription>
                  必须是有效的国际区号
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <FormLabel>电话号码</FormLabel>
                <FormControl>
                  <Input placeholder="请输入电话号码" {...field} />
                </FormControl>
                <FormDescription>只能包含数字</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公司地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入公司地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>账单地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入账单地址（如与公司地址相同则留空）" {...field} />
              </FormControl>
              <FormDescription>
                如果与公司地址相同则留空
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>产品类型</FormLabel>
              <Select
                onValueChange={(value) => handleProductTypeChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="请选择产品类型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="passenger">客梯</SelectItem>
                  <SelectItem value="hydraulic">自动扶梯</SelectItem>
                  <SelectItem value="humanoid">自动人行道</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {productType === "passenger" && (
          <div className="space-y-6 p-4 border border-gray-200 rounded-md">
            {/* 输入模式选择 */}
            <div className="flex items-center space-x-4 border-b pb-4">
              <h3 className="text-lg font-medium">输入模式</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="inputMode"
                    checked={usePresets}
                    onChange={() => setUsePresets(true)}
                  />
                  <span>使用预设值</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="inputMode"
                    checked={!usePresets}
                    onChange={() => setUsePresets(false)}
                  />
                  <span>自定义输入</span>
                </label>
              </div>
            </div>

            {/* 载重选择 */}
            <div className="space-y-2">
              <h3 className="font-medium">载重 (kg)</h3>
              {usePresets ? (
                <FormField
                  control={form.control}
                  name="predefinedWeight"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => handleWeightChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="请选择载重" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="630">630 kg</SelectItem>
                          <SelectItem value="1000">1000 kg</SelectItem>
                          <SelectItem value="1250">1250 kg</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="请输入载重 (200-10000 kg)"
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        载重范围：200 kg 至 10000 kg
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* 速度选择 */}
            <div className="space-y-2">
              <h3 className="font-medium">速度 (mm/s)</h3>
              {usePresets ? (
                <FormField
                  control={form.control}
                  name="predefinedSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => handleSpeedChange(value)}
                        value={field.value}
                        disabled={!selectedWeight}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={selectedWeight ? "请选择速度" : "请先选择载重"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getSpeedOptions(selectedWeight).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="speed"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="请输入速度 (100-2000 mm/s)"
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        速度范围：100 mm/s 至 2000 mm/s
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* 宽度选择 */}
            <div className="space-y-2">
              <h3 className="font-medium">宽度 (mm)</h3>
              {usePresets ? (
                <FormField
                  control={form.control}
                  name="predefinedWidth"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        disabled={!selectedWeight || !selectedSpeed}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={!selectedWeight ? "请先选择载重" : !selectedSpeed ? "请先选择速度" : "请选择宽度"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getWidthOptions(selectedWeight, selectedSpeed).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="请输入宽度 (1000-2500 mm)"
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        宽度范围：1000 mm 至 2500 mm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        )}

        <Button type="submit" variant="blue" size="full">
          提交
        </Button>
      </form>
    </Form>
  );
} 