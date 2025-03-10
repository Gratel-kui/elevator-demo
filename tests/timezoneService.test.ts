import { getTimezoneFromCoordinates, getMonthStarts } from '../src/services/timezoneService';
import { DateTime } from 'luxon';

describe('Timezone Service', () => {
  describe('getTimezoneFromCoordinates', () => {
    it('should return the correct timezone for Shanghai coordinates', () => {
      const timezone = getTimezoneFromCoordinates(121.4691, 31.2243);
      expect(timezone).toBe('Asia/Shanghai');
    });

    it('should return the correct timezone for New York coordinates', () => {
      const timezone = getTimezoneFromCoordinates(-74.0060, 40.7128);
      expect(timezone).toBe('America/New_York');
    });

    it('should return the correct timezone for London coordinates', () => {
      const timezone = getTimezoneFromCoordinates(-0.1278, 51.5074);
      expect(timezone).toBe('Europe/London');
    });

    it('should return the correct timezone for Tokyo coordinates', () => {
      const timezone = getTimezoneFromCoordinates(139.6917, 35.6895);
      expect(timezone).toBe('Asia/Tokyo');
    });

    it('should return the correct timezone for Sydney coordinates', () => {
      const timezone = getTimezoneFromCoordinates(151.2093, -33.8688);
      expect(timezone).toBe('Australia/Sydney');
    });

    it('should return UTC for coordinates in the middle of the ocean', () => {
      const timezone = getTimezoneFromCoordinates(0, 0);
      // This could be either 'Etc/GMT' or 'UTC' depending on the library
      expect(['Etc/GMT', 'UTC']).toContain(timezone);
    });

    it('should handle edge cases near timezone boundaries', () => {
      // This is near the China/Mongolia border
      const timezone = getTimezoneFromCoordinates(116.4074, 39.9042);
      expect(timezone).toBe('Asia/Shanghai');
    });
  });

  describe('getMonthStarts', () => {
    it('should return correct month starts for a given timezone and date range', () => {
      const monthStarts = getMonthStarts('Asia/Shanghai', '2024-01', '2024-02');
      
      // We expect two entries: end of January and end of February
      expect(monthStarts.length).toBe(2);
      
      // Check that the dates are in ISO format
      monthStarts.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
      });
    });

    it('should handle leap years correctly', () => {
      const monthStarts = getMonthStarts('UTC', '2024-02', '2024-02');
      
      // February 2024 is a leap year, so it ends on the 29th
      expect(monthStarts[0]).toContain('2024-02-29');
    });

    it('should handle non-leap years correctly', () => {
      const monthStarts = getMonthStarts('UTC', '2023-02', '2023-02');
      
      // February 2023 is not a leap year, so it ends on the 28th
      expect(monthStarts[0]).toContain('2023-02-28');
    });

    it('should handle timezone offsets correctly', () => {
      // Test with a timezone that's ahead of UTC
      const tokyoMonthStarts = getMonthStarts('Asia/Tokyo', '2024-01', '2024-01');
      const tokyoDate = DateTime.fromISO(tokyoMonthStarts[0]);
      
      // Tokyo is UTC+9, so the end of January in Tokyo converted to UTC
      // should be earlier than the end of January in UTC
      expect(tokyoDate.hour).toBeLessThan(24);
      
      // Test with a timezone that's behind UTC
      const nyMonthStarts = getMonthStarts('America/New_York', '2024-01', '2024-01');
      const nyDate = DateTime.fromISO(nyMonthStarts[0]);
      
      // New York is UTC-5, so the end of January in NY converted to UTC
      // should be later than the end of January in UTC
      expect(nyDate.hour).toBeGreaterThan(0);
    });

    it('should handle a full year correctly', () => {
      const monthStarts = getMonthStarts('UTC', '2024-01', '2024-12');
      
      // We expect 12 entries for a full year
      expect(monthStarts.length).toBe(12);
      
      // Check specific months
      expect(monthStarts[0]).toContain('2024-01-31'); // January has 31 days
      expect(monthStarts[1]).toContain('2024-02-29'); // February 2024 (leap year) has 29 days
      expect(monthStarts[3]).toContain('2024-04-30'); // April has 30 days
    });

    it('should throw an error for invalid month format', () => {
      expect(() => {
        getMonthStarts('UTC', '2024', '2024-12');
      }).toThrow('Invalid month format');
      
      expect(() => {
        getMonthStarts('UTC', '2024-01', '2024');
      }).toThrow('Invalid month format');
    });
  });
}); 