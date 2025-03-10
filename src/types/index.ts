export interface MonthsQueryParams {
  lon: number;
  lat: number;
  from: string; // YYYY-MM
  to: string;   // YYYY-MM
}

export interface FormattedMonthsQueryParams extends MonthsQueryParams {
  dateFormat: string; // Required date format
}

export interface MonthsResponse {
  monthStarts: string[];
}

export interface FormattedMonthsResponse {
  monthStarts: string[];
  metadata: {
    timezone: string;
    format: string;
  };
} 