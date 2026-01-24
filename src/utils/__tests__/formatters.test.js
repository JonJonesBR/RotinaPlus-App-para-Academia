import { formatCPF, isValidCPFFormat } from '../formatters';

describe('formatters', () => {
  describe('formatCPF', () => {
    it('should format a valid CPF string correctly', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should handle input with existing formatting', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
    });
  });

  describe('isValidCPFFormat', () => {
    it('should return true for 11 digits', () => {
      expect(isValidCPFFormat('12345678901')).toBe(true);
    });

    it('should return false for incorrect length', () => {
      expect(isValidCPFFormat('123')).toBe(false);
    });
  });
});
