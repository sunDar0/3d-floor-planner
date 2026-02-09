import { snapToGrid, distance, projectPointOnLine, isPointInPolygon } from '../../src/utils/geometry.js';

describe('snapToGrid', () => {
  test('snaps value to nearest grid unit (GRID_SIZE=1)', () => {
    expect(snapToGrid(5.3)).toBe(5);
    expect(snapToGrid(5.7)).toBe(6);
    expect(snapToGrid(5.5)).toBe(6);
  });

  test('handles zero', () => {
    expect(snapToGrid(0)).toBe(0);
  });

  test('handles negative values', () => {
    expect(snapToGrid(-3.2)).toBe(-3);
    expect(snapToGrid(-3.7)).toBe(-4);
  });

  test('handles exact integers (no rounding needed)', () => {
    expect(snapToGrid(10)).toBe(10);
    expect(snapToGrid(-5)).toBe(-5);
  });
});

describe('distance', () => {
  test('calculates euclidean distance between two points', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  test('returns 0 for identical points', () => {
    expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });

  test('handles negative coordinates', () => {
    expect(distance({ x: -3, y: -4 }, { x: 0, y: 0 })).toBe(5);
  });

  test('is commutative', () => {
    const p1 = { x: 1, y: 2 };
    const p2 = { x: 4, y: 6 };
    expect(distance(p1, p2)).toBe(distance(p2, p1));
  });

  test('handles horizontal distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10);
  });

  test('handles vertical distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(10);
  });
});

describe('projectPointOnLine', () => {
  test('projects point onto line segment and returns position with t value', () => {
    const result = projectPointOnLine({ x: 5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(result.x).toBe(5);
    expect(result.y).toBe(0);
    expect(result.t).toBe(0.5);
  });

  test('clamps t to 0 when projection is before start', () => {
    const result = projectPointOnLine({ x: -5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.t).toBe(0);
  });

  test('clamps t to 1 when projection is past end', () => {
    const result = projectPointOnLine({ x: 15, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(result.x).toBe(10);
    expect(result.y).toBe(0);
    expect(result.t).toBe(1);
  });

  test('returns start point for zero-length line', () => {
    const result = projectPointOnLine({ x: 5, y: 5 }, { x: 3, y: 3 }, { x: 3, y: 3 });
    expect(result.x).toBe(3);
    expect(result.y).toBe(3);
  });

  test('projects correctly onto a diagonal line', () => {
    const result = projectPointOnLine({ x: 0, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 10 });
    expect(result.x).toBeCloseTo(5);
    expect(result.y).toBeCloseTo(5);
    expect(result.t).toBeCloseTo(0.5);
  });

  test('projects point exactly on start', () => {
    const result = projectPointOnLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(result.t).toBe(0);
  });

  test('projects point exactly on end', () => {
    const result = projectPointOnLine({ x: 10, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(result.t).toBe(1);
  });
});

describe('isPointInPolygon', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 }
  ];

  test('returns true for point inside polygon', () => {
    expect(isPointInPolygon(5, 5, square)).toBe(true);
  });

  test('returns false for point outside polygon', () => {
    expect(isPointInPolygon(15, 15, square)).toBe(false);
  });

  test('returns false for null points', () => {
    expect(isPointInPolygon(5, 5, null)).toBe(false);
  });

  test('returns false for undefined points', () => {
    expect(isPointInPolygon(5, 5, undefined)).toBe(false);
  });

  test('returns false for empty array', () => {
    expect(isPointInPolygon(5, 5, [])).toBe(false);
  });

  test('returns false for less than 3 points', () => {
    expect(isPointInPolygon(5, 5, [{ x: 0, y: 0 }, { x: 10, y: 0 }])).toBe(false);
  });

  test('returns false for point far outside polygon', () => {
    expect(isPointInPolygon(100, 100, square)).toBe(false);
  });

  test('handles triangle polygon', () => {
    const triangle = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 }
    ];
    expect(isPointInPolygon(5, 3, triangle)).toBe(true);
    expect(isPointInPolygon(0, 10, triangle)).toBe(false);
  });

  test('handles L-shaped polygon', () => {
    const lShape = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 10 },
      { x: 0, y: 10 }
    ];
    expect(isPointInPolygon(2, 2, lShape)).toBe(true);
    expect(isPointInPolygon(8, 8, lShape)).toBe(false);
  });
});
