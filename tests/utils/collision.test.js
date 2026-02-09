import { checkCollision } from '../../src/utils/collision.js';
import { WALL_THICKNESS, DOOR_WIDTH, BALCONY_WIDTH } from '../../src/config/constants.js';

describe('checkCollision', () => {
  // checkCollision(x, z, walls, openings, offsetX, offsetZ) now takes offset params.
  // px = x - offsetX, pz = z - offsetZ
  // PLAYER_RADIUS = 30, THRESHOLD = WALL_THICKNESS/2 + 30 = 37.5
  //
  // For simplicity in tests, use offsetX=0, offsetZ=0 so px=x, pz=z.

  const OX = 0;
  const OZ = 0;

  const makeWall = (sx, sy, ex, ey) => ({
    start: { x: sx, y: sy },
    end: { x: ex, y: ey }
  });

  test('returns false when no walls exist', () => {
    expect(checkCollision(0, 0, [], [], OX, OZ)).toBe(false);
  });

  test('returns false when player is far from wall', () => {
    // Player at (0, 0). Wall at y=500, far away
    const walls = [makeWall(0, 500, 200, 500)];
    expect(checkCollision(0, 0, walls, [], OX, OZ)).toBe(false);
  });

  test('returns true when player is close to wall (collision)', () => {
    // Player at (100, 0). Horizontal wall at y=0, spanning x=0..200
    // projection of (100,0) onto wall => (100,0), distance=0 < 37.5 => collision
    const walls = [makeWall(0, 0, 200, 0)];
    expect(checkCollision(100, 0, walls, [], OX, OZ)).toBe(true);
  });

  test('returns false when passing through a door opening', () => {
    // Wall from (0,0) to (200,0), length=200. Player at (100,0).
    // Door at t=0.5 => position 100 along wall
    // DOOR_WIDTH=90 => range [55, 145], passable [65, 135]
    // projPos = 0.5 * 200 = 100 => within [65, 135]
    const walls = [makeWall(0, 0, 200, 0)];
    const openings = [{ wallIndex: 0, type: 'door', t: 0.5 }];
    expect(checkCollision(100, 0, walls, openings, OX, OZ)).toBe(false);
  });

  test('returns true when near window opening (cannot pass through)', () => {
    // Same wall and position but with window instead of door
    const walls = [makeWall(0, 0, 200, 0)];
    const openings = [{ wallIndex: 0, type: 'window', t: 0.5 }];
    expect(checkCollision(100, 0, walls, openings, OX, OZ)).toBe(true);
  });

  test('returns false when passing through a balcony opening', () => {
    // Wall from (0,0) to (400,0), length=400
    // Balcony at t=0.5 => position 200 along wall
    // BALCONY_WIDTH=240 => range [80, 320], passable [90, 310]
    // Player at (200,0) => projPos = 0.5 * 400 = 200 => within [90, 310]
    const walls = [makeWall(0, 0, 400, 0)];
    const openings = [{ wallIndex: 0, type: 'balcony', t: 0.5 }];
    expect(checkCollision(200, 0, walls, openings, OX, OZ)).toBe(false);
  });

  test('returns true when near wall with no openings', () => {
    const walls = [makeWall(0, 50, 200, 50)];
    // Player at (100, 50) => on the wall, no openings
    expect(checkCollision(100, 50, walls, [], OX, OZ)).toBe(true);
  });

  test('returns false when outside threshold distance from wall', () => {
    // Player at (100, 0). Wall at y=100, distance=100 > 37.5
    const walls = [makeWall(0, 100, 200, 100)];
    expect(checkCollision(100, 0, walls, [], OX, OZ)).toBe(false);
  });

  test('checks correct wall index for openings', () => {
    // Wall 0: at player position; Wall 1: far away
    const walls = [
      makeWall(0, 0, 200, 0),
      makeWall(0, 500, 200, 500)
    ];
    // Door opening on wall 1 (not wall 0), so wall 0 blocks player
    const openings = [{ wallIndex: 1, type: 'door', t: 0.5 }];
    expect(checkCollision(100, 0, walls, openings, OX, OZ)).toBe(true);
  });

  test('works with non-zero offsets', () => {
    // offsetX = -512, offsetZ = -384 (typical browser offset)
    // Player at (0, 0) => px = 0 - (-512) = 512, pz = 0 - (-384) = 384
    // Wall at y=384, spanning x=412..612
    const walls = [makeWall(412, 384, 612, 384)];
    expect(checkCollision(0, 0, walls, [], -512, -384)).toBe(true);
  });

  test('player near wall endpoint is still detected', () => {
    // Wall from (0,0) to (100,0). Player at (0, 10).
    // Projection: (0, 0), distance=10 < 37.5 => collision
    const walls = [makeWall(0, 0, 100, 0)];
    expect(checkCollision(0, 10, walls, [], OX, OZ)).toBe(true);
  });
});
