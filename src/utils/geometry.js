import { GRID_SIZE } from '../config/constants.js';

/**
 * 값을 그리드에 스냅
 */
export const snapToGrid = (val) => Math.round(val / GRID_SIZE) * GRID_SIZE;

/**
 * 두 점 사이의 유클리드 거리 계산
 */
export const distance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

/**
 * 점을 선분에 투영하고 투영된 위치와 비율(t) 반환
 */
export const projectPointOnLine = (point, start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return start;

    let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / len2;
    t = Math.max(0, Math.min(1, t));

    return {
        x: start.x + t * dx,
        y: start.y + t * dy,
        t: t // 비율 (0~1)
    };
};

/**
 * 점이 폴리곤 내부에 있는지 확인 (Ray Casting 알고리즘)
 */
export const isPointInPolygon = (x, y, points) => {
    if (!points || points.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
    }
    
    return inside;
};
