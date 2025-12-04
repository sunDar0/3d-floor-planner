import { snapToGrid, distance } from './geometry.js';

/**
 * 스마트 스냅 시스템
 * 1. Vertex Snapping (기존 점에 우선 스냅)
 * 2. Alignment Snapping (X/Y축 정렬 스냅)
 * 
 * @param {number} x - 마우스 X 좌표
 * @param {number} y - 마우스 Y 좌표
 * @param {Array} walls - 벽 배열
 * @param {Array} rooms - 방 배열
 * @param {number} scale - 현재 줌 스케일
 * @returns {Object} { x, y, guides }
 */
export const getSnappedPosition = (x, y, walls, rooms, scale) => {
    let sx = snapToGrid(x);
    let sy = snapToGrid(y);
    const SNAP_DIST = 15 / scale; // 스냅 감지 거리 (화면 픽셀 기준 15px)

    const newGuides = [];

    // 참조할 포인트 수집 (벽의 양 끝점)
    const points = [];
    walls.forEach(w => {
        points.push(w.start);
        points.push(w.end);
    });
    rooms.forEach(r => {
        r.points.forEach(p => points.push(p));
    });

    // 1. Vertex Snapping (점 스냅) - 가장 강력한 스냅
    // 기존 점에 가까우면 그 점으로 강제 이동 (줌 아웃 상태에서도 쉽게 연결 가능)
    for (const p of points) {
        const dist = distance({ x, y }, p);
        if (dist < SNAP_DIST) {
            return { x: p.x, y: p.y, guides: [] }; // 가이드 없이 바로 스냅
        }
    }

    // 2. Alignment Snapping (정렬 스냅)
    // X축 스냅 (수직선 가이드) - 다른 점의 X좌표와 일치
    for (const p of points) {
        if (Math.abs(p.x - x) < SNAP_DIST) {
            sx = p.x;
            newGuides.push({ type: 'x', pos: sx, start: Math.min(y, p.y), end: Math.max(y, p.y) });
            break; // 하나만 스냅
        }
    }

    // Y축 스냅 (수평선 가이드) - 다른 점의 Y좌표와 일치
    for (const p of points) {
        if (Math.abs(p.y - y) < SNAP_DIST) {
            sy = p.y;
            newGuides.push({ type: 'y', pos: sy, start: Math.min(x, p.x), end: Math.max(x, p.x) });
            break;
        }
    }

    return { x: sx, y: sy, guides: newGuides };
};
