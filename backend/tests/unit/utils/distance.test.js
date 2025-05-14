const { calculateDistance } = require('../../../src/utils/distance');

describe('Distance Calculation', () => {
  test('should return 0 for same coordinates', () => {
    const lat = 37.7749;
    const lng = -122.4194;
    
    const distance = calculateDistance(lat, lng, lat, lng);
    
    expect(distance).toBeCloseTo(0, 5);
  });
  
  test('should calculate distance between two points', () => {
    // San Francisco
    const lat1 = 37.7749;
    const lng1 = -122.4194;
    
    // Los Angeles
    const lat2 = 34.0522;
    const lng2 = -118.2437;
    
    // Expected distance between SF and LA is ~560 km
    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    
    expect(distance).toBeGreaterThan(500);
    expect(distance).toBeLessThan(600);
  });
});