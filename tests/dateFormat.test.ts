import { mapDateFormat, getMonthStarts } from '../src/services/timezoneService';

describe('Date Format Functionality', () => {
  describe('mapDateFormat', () => {
    it('should map YYYY-MM-DD to Luxon format', () => {
      expect(mapDateFormat('YYYY-MM-DD')).toBe('yyyy-MM-dd');
    });

    it('should map DD-MM-YYYY to Luxon format', () => {
      expect(mapDateFormat('DD-MM-YYYY')).toBe('dd-MM-yyyy');
    });

    it('should map MM-DD-YYYY to Luxon format', () => {
      expect(mapDateFormat('MM-DD-YYYY')).toBe('MM-dd-yyyy');
    });

    it('should map strftime-style formats to Luxon format', () => {
      expect(mapDateFormat('%Y-%m-%d')).toBe('yyyy-MM-dd');
    });

    it('should return ISO for ISO format', () => {
      expect(mapDateFormat('ISO')).toBe('ISO');
    });

    it('should return the original format if not found in the map', () => {
      expect(mapDateFormat('custom-format')).toBe('custom-format');
    });
  });

  describe('getMonthStarts with different formats', () => {
    it('should return dates in ISO format by default', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01');
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    it('should return dates in YYYY-MM-DD format', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01', 'YYYY-MM-DD');
      expect(result[0]).toBe('2024-01-31');
    });

    it('should return dates in DD-MM-YYYY format', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01', 'DD-MM-YYYY');
      expect(result[0]).toBe('31-01-2024');
    });

    it('should return dates in MM-DD-YYYY format', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01', 'MM-DD-YYYY');
      expect(result[0]).toBe('01-31-2024');
    });

    it('should return dates in date and time format', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01', 'YYYY-MM-DD HH:mm:ss');
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should handle strftime-style formats', () => {
      const result = getMonthStarts('UTC', '2024-01', '2024-01', '%Y-%m-%d');
      expect(result[0]).toBe('2024-01-31');
    });
  });
}); 