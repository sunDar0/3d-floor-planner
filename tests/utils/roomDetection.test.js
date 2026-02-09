import { findClosedRegion } from '../../src/utils/roomDetection.js';

describe('findClosedRegion', () => {
  test('finds closed region when walls form a loop', () => {
    // Square: A(0,0)->B(100,0), B(100,0)->C(100,100), C(100,100)->D(0,100)
    // New wall: D(0,100)->A(0,0) should close the loop
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
      { start: { x: 100, y: 0 }, end: { x: 100, y: 100 } },
      { start: { x: 100, y: 100 }, end: { x: 0, y: 100 } }
    ];
    const newWall = { start: { x: 0, y: 0 }, end: { x: 0, y: 100 } };

    const result = findClosedRegion(existingWalls, newWall);
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test('returns null when no closed region exists', () => {
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
      { start: { x: 200, y: 200 }, end: { x: 300, y: 200 } }
    ];
    const newWall = { start: { x: 0, y: 0 }, end: { x: 0, y: 100 } };

    const result = findClosedRegion(existingWalls, newWall);
    expect(result).toBeNull();
  });

  test('returns null when single wall exists (no cycle possible)', () => {
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } }
    ];
    const newWall = { start: { x: 200, y: 200 }, end: { x: 300, y: 200 } };

    const result = findClosedRegion(existingWalls, newWall);
    expect(result).toBeNull();
  });

  test('returns null when new wall endpoints are not in existing graph', () => {
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } }
    ];
    const newWall = { start: { x: 500, y: 500 }, end: { x: 600, y: 600 } };

    const result = findClosedRegion(existingWalls, newWall);
    expect(result).toBeNull();
  });

  test('finds region in triangle configuration', () => {
    // A(0,0)->B(100,0), B(100,0)->C(50,100)
    // New wall: C(50,100)->A(0,0) closes triangle
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
      { start: { x: 100, y: 0 }, end: { x: 50, y: 100 } }
    ];
    const newWall = { start: { x: 0, y: 0 }, end: { x: 50, y: 100 } };

    const result = findClosedRegion(existingWalls, newWall);
    expect(result).not.toBeNull();
    expect(result.length).toBe(3);
  });

  test('returns null with empty existing walls', () => {
    const newWall = { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } };
    const result = findClosedRegion([], newWall);
    expect(result).toBeNull();
  });

  test('handles walls sharing endpoints correctly', () => {
    // T-shape: multiple walls sharing point B
    const existingWalls = [
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
      { start: { x: 100, y: 0 }, end: { x: 100, y: 100 } },
      { start: { x: 100, y: 100 }, end: { x: 0, y: 100 } },
      { start: { x: 100, y: 0 }, end: { x: 200, y: 0 } }
    ];
    // Close the left square
    const newWall = { start: { x: 0, y: 0 }, end: { x: 0, y: 100 } };
    const result = findClosedRegion(existingWalls, newWall);
    expect(result).not.toBeNull();
  });
});
