import { DateTime } from 'luxon';
import { find } from 'geo-tz';

/**
 * Get timezone from coordinates using accurate timezone database
 * @param lon Longitude of the location
 * @param lat Latitude of the location
 * @returns IANA timezone identifier (e.g., "Asia/Shanghai")
 */
export function getTimezoneFromCoordinates(lon: number, lat: number): string {
  try {
    // geo-tz returns an array of possible timezones, we take the first one
    const timezones = find(lat, lon);
    
    if (!timezones || timezones.length === 0) {
      console.warn(`No timezone found for coordinates: ${lat}, ${lon}. Falling back to UTC.`);
      return 'UTC';
    }
    
    return timezones[0];
  } catch (error) {
    console.error(`Error determining timezone for coordinates: ${lat}, ${lon}`, error);
    // Fallback to UTC in case of error
    return 'UTC';
  }
}

/**
 * Get the start times of each month for a specified timezone and time range
 */
export function getMonthStarts(timezone: string, fromMonth: string, toMonth: string): string[] {
  // Parse start and end months
  const fromParts = fromMonth.split('-');
  const toParts = toMonth.split('-');
  
  if (fromParts.length !== 2 || toParts.length !== 2) {
    throw new Error('Invalid month format. Expected YYYY-MM');
  }
  
  const fromYear = parseInt(fromParts[0], 10);
  const fromMonthNum = parseInt(fromParts[1], 10);
  const toYear = parseInt(toParts[0], 10);
  const toMonthNum = parseInt(toParts[1], 10);
  
  // Create start and end dates
  let currentDate = DateTime.fromObject(
    { year: fromYear, month: fromMonthNum, day: 1 },
    { zone: timezone }
  );
  
  const endDate = DateTime.fromObject(
    { year: toYear, month: toMonthNum, day: 1 },
    { zone: timezone }
  ).plus({ months: 1 });
  
  const monthStarts: string[] = [];
  
  // Generate start time for each month
  while (currentDate < endDate) {
    // Get the first day of the next month
    const nextMonth = currentDate.plus({ months: 1 });
    
    // Add the end time of the current month to the results
    const monthEnd = nextMonth.startOf('month').minus({ seconds: 1 });
    const isoString = monthEnd.toUTC().toISO();
    if (!isoString) throw new Error('Invalid date conversion');
    monthStarts.push(isoString);
    
    // Move to the next month
    currentDate = nextMonth;
  }
  
  return monthStarts;
} 