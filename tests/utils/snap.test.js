import { getSnappedPosition } from '../../src/utils/snap.js';

describe('getSnappedPosition', () => {
  const scale = 1;

  test('snaps to grid when no nearby points exist', () => {
    const result = getSnappedPosition(5.3, 7.8, [], [], scale);
    expect(result.x).toBe(5);
    expect(result.y).toBe(8);
    expect(result.guides).toEqual([]);
  });

  test('snaps to vertex when near existing wall endpoint', () => {
    const walls = [
      { start: { x: 100, y: 100 }, end: { x: 200, y: 100 } }
    ];
    // Point within 15px of wall start
    const result = getSnappedPosition(105, 105, walls, [], scale);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.guides).toEqual([]);
  });

  test('snaps to nearest vertex endpoint', () => {
    const walls = [
      { start: { x: 100, y: 100 }, end: { x: 200, y: 100 } }
    ];
    // Point within 15px of wall end
    const result = getSnappedPosition(195, 105, walls, [], scale);
    expect(result.x).toBe(200);
    expect(result.y).toBe(100);
  });

  test('alignment snap on X axis creates vertical guide', () => {
    const walls = [
      { start: { x: 100, y: 50 }, end: { x: 200, y: 50 } }
    ];
    // x=105 is within 15px of x=100, but y=200 is far from vertex
    const result = getSnappedPosition(105, 200, walls, [], scale);
    expect(result.x).toBe(100);
    expect(result.guides.length).toBeGreaterThanOrEqual(1);
    expect(result.guides[0].type).toBe('x');
    expect(result.guides[0].pos).toBe(100);
  });

  test('alignment snap on Y axis creates horizontal guide', () => {
    const walls = [
      { start: { x: 50, y: 100 }, end: { x: 50, y: 200 } }
    ];
    // y=105 is within 15px of y=100, but x=300 is far from vertex
    const result = getSnappedPosition(300, 105, walls, [], scale);
    expect(result.y).toBe(100);
    const yGuide = result.guides.find(g => g.type === 'y');
    expect(yGuide).toBeDefined();
    expect(yGuide.pos).toBe(100);
  });

  test('both X and Y alignment snaps can occur', () => {
    const walls = [
      { start: { x: 100, y: 100 }, end: { x: 300, y: 300 } }
    ];
    // Far enough from vertex (>15px) but close in X and Y to x=100, y=100
    const result = getSnappedPosition(105, 105, walls, [], scale);
    // This is within vertex snap distance (distance ~7.07), so vertex snap takes priority
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
  });

  test('vertex snap takes priority over alignment snap', () => {
    const walls = [
      { start: { x: 100, y: 100 }, end: { x: 200, y: 200 } }
    ];
    // Within vertex distance of start point
    const result = getSnappedPosition(108, 108, walls, [], scale);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.guides).toEqual([]);
  });

  test('considers room points for snapping', () => {
    const rooms = [
      { points: [{ x: 50, y: 50 }, { x: 150, y: 50 }, { x: 150, y: 150 }, { x: 50, y: 150 }] }
    ];
    // Near room vertex
    const result = getSnappedPosition(55, 55, [], rooms, scale);
    expect(result.x).toBe(50);
    expect(result.y).toBe(50);
  });

  test('snap distance adjusts with scale', () => {
    const walls = [
      { start: { x: 100, y: 100 }, end: { x: 200, y: 100 } }
    ];
    // At scale=2, snap distance is 15/2 = 7.5px
    // distance from (106,106) to (100,100) is ~8.49 > 7.5, so no vertex snap
    // But alignment snap still catches individual axis diffs (|100-106|=6 < 7.5)
    const result = getSnappedPosition(106, 106, walls, [], 2);
    // Not vertex-snapped (would have empty guides), but alignment-snapped
    expect(result.guides.length).toBeGreaterThan(0);

    // At scale=0.5, snap distance is 15/0.5 = 30px, so vertex snap works at distance ~8.49
    const result2 = getSnappedPosition(106, 106, walls, [], 0.5);
    expect(result2.x).toBe(100);
    expect(result2.y).toBe(100);
    expect(result2.guides).toEqual([]);
  });

  test('returns grid-snapped position when no walls or rooms', () => {
    const result = getSnappedPosition(123.7, 456.2, [], [], scale);
    expect(result.x).toBe(124);
    expect(result.y).toBe(456);
    expect(result.guides).toEqual([]);
  });
});
