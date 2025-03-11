import { CompanyForm } from "@/components/CompanyForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8">公司信息表单</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <CompanyForm />
        </div>
      </div>
    </main>
  );
}
