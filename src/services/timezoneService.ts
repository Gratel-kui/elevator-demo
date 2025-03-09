import { DateTime } from 'luxon';

/**
 * Get timezone from coordinates
 * Note: This is a simplified implementation. In a real application, 
 * you might need a more complex mapping from geographic location to timezone.
 */
export function getTimezoneFromCoordinates(lon: number, lat: number): string {
  // Simplified implementation: roughly estimate timezone based on longitude
  // In a real application, you should use a more accurate library for mapping geographic location to timezone
  const timezoneOffset = Math.round(lon / 15);
  return `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
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
    if (isoString) {
      monthStarts.push(isoString);
    } else {
      throw new Error('Failed to convert date to ISO string');
    }
    
    // Move to the next month
    currentDate = nextMonth;
  }
  
  return monthStarts;
} 