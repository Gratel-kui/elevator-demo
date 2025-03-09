import { getTimezoneFromCoordinates, getMonthStarts } from '../src/services/timezoneService';

describe('Timezone Service', () => {
  describe('getTimezoneFromCoordinates', () => {
    it('should return the correct timezone for Shanghai coordinates', () => {
      const timezone = getTimezoneFromCoordinates(121.4691, 31.2243);
      expect(timezone).toBe('UTC+8');
    });

    it('should return the correct timezone for New York coordinates', () => {
      const timezone = getTimezoneFromCoordinates(-74.0060, 40.7128);
      expect(timezone).toBe('UTC-5');
    });
  });

  describe('getMonthStarts', () => {
    it('should return correct month starts for a given timezone and date range', () => {
      const monthStarts = getMonthStarts('UTC+8', '2024-01', '2024-02');
      
      // We expect two entries: end of January and end of February
      expect(monthStarts.length).toBe(2);
      
      // Check that the dates are in ISO format
      monthStarts.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
      });
    });
  });
}); 