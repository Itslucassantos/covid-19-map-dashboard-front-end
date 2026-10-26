import { markerRadius } from './marker-radius';

describe('markerRadius', () => {
  it('returns the minimum radius for zero or missing values', () => {
    expect(markerRadius(0, 100)).toBe(4);
    expect(markerRadius(10, 0)).toBe(4);
  });

  it('returns the maximum radius for the largest value', () => {
    expect(markerRadius(100, 100)).toBe(36);
  });

  it('grows with the value', () => {
    expect(markerRadius(50, 100)).toBeGreaterThan(markerRadius(10, 100));
  });
});
