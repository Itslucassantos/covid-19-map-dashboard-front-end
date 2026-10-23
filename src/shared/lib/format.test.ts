import { formatNumber } from './format';

describe('formatNumber', () => {
  it('uses comma separators in en', () => {
    expect(formatNumber(1092230, 'en')).toBe('1,092,230');
  });

  it('uses dot separators in pt-BR', () => {
    expect(formatNumber(1092230, 'pt-BR')).toBe('1.092.230');
  });
});
