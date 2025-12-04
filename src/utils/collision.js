import { distance, projectPointOnLine } from './geometry.js';
import { WALL_THICKNESS, DOOR_WIDTH, BALCONY_WIDTH } from '../config/constants.js';

/**
 * 플레이어와 벽 충돌 감지
 * 문/발코니 통과 가능 여부 확인
 * 
 * @param {number} x - 플레이어 X 좌표
 * @param {number} z - 플레이어 Z 좌표
 * @param {Array} walls - 벽 배열
 * @param {Array} openings - 오프닝 배열
 * @returns {boolean} 충돌 여부
 */
export const checkCollision = (x, z, walls, openings) => {
    const PLAYER_RADIUS = 30; // 30cm 몸통 반지름
    const THRESHOLD = WALL_THICKNESS / 2 + PLAYER_RADIUS;

    // 오프셋 (중앙 정렬)
    const offsetX = -window.innerWidth / 2;
    const offsetZ = -window.innerHeight / 2;

    const px = x - offsetX;
    const pz = z - offsetZ;

    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];

        const proj = projectPointOnLine({ x: px, y: pz }, wall.start, wall.end);
        const dist = distance({ x: px, y: pz }, proj);

        if (dist < THRESHOLD) {
            // 벽과 충돌했으나, 문(오프닝)이 있는지 확인
            const wallOpenings = openings.filter(o => o.wallIndex === i);

            // 해당 벽의 오프닝들을 확인
            const dx = wall.end.x - wall.start.x;
            const dy = wall.end.y - wall.start.y;
            const len = Math.sqrt(dx * dx + dy * dy);

            // 투영된 지점의 비율(t)이 오프닝 구간 내에 있는지 확인
            const isPassingThroughDoor = wallOpenings.some(op => {
                if (op.type !== 'door' && op.type !== 'balcony') return false; // 창문은 통과 불가

                const opWidth = op.type === 'door' ? DOOR_WIDTH : BALCONY_WIDTH;
                const opPos = op.t * len;
                const start = opPos - opWidth / 2;
                const end = opPos + opWidth / 2;

                const projPos = proj.t * len;

                // 플레이어의 반지름을 고려하여 오프닝 범위 내인지 확인 (조금 여유 있게)
                return projPos >= (start + 10) && projPos <= (end - 10);
            });

            if (isPassingThroughDoor) return false; // 문이면 통과 가능

            return true; // 문이 아니면 충돌
        }
    }
    return false;
};
