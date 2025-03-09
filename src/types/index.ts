export interface MonthsQueryParams {
  lon: number;
  lat: number;
  from: string; // YYYY-MM
  to: string;   // YYYY-MM
}

export interface MonthsResponse {
  monthStarts: string[];
} 