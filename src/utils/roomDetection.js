import { distance } from './geometry.js';

const pKey = (p) => `${Math.round(p.x)},${Math.round(p.y)}`;

/**
 * 새로운 벽이 추가되었을 때, 닫힌 영역(방)이 형성되는지 감지합니다.
 * BFS를 사용하여 새로운 벽의 끝점에서 시작점까지 이어지는 최단 경로(가장 적은 벽 개수)를 찾습니다.
 * 
 * @param {Array} existingWalls - 기존 벽들의 배열
 * @param {Object} newWall - 새로 추가하려는 벽 { start: {x,y}, end: {x,y} }
 * @returns {Array|null} - 방을 구성하는 점들의 배열 (닫힌 루프가 없으면 null)
 */
export const findClosedRegion = (existingWalls, newWall) => {
    // 1. 인접 리스트 그래프 생성
    const adj = new Map();

    const addEdge = (p1, p2) => {
        const k1 = pKey(p1);
        const k2 = pKey(p2);
        if (!adj.has(k1)) adj.set(k1, []);
        if (!adj.has(k2)) adj.set(k2, []);

        // 중복 방지 및 그래프 구성
        // 주의: 점 객체 자체를 저장하여 나중에 반환할 때 사용
        if (!adj.get(k1).some(n => n.key === k2)) adj.get(k1).push({ key: k2, point: p2 });
        if (!adj.get(k2).some(n => n.key === k1)) adj.get(k2).push({ key: k1, point: p1 });
    };

    // 기존 벽들로 그래프 구성
    existingWalls.forEach(w => {
        addEdge(w.start, w.end);
    });

    // 목표: newWall.end -> ... -> newWall.start 경로 찾기
    const startNode = { key: pKey(newWall.end), point: newWall.end };
    const targetKey = pKey(newWall.start);

    // 그래프에 시작점이나 목표점이 없으면 연결될 수 없음
    if (!adj.has(startNode.key) || !adj.has(targetKey)) {
        return null;
    }

    // 2. BFS 탐색
    const queue = [[startNode]];
    const visited = new Set();
    visited.add(startNode.key);

    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];

        if (current.key === targetKey) {
            // 사이클 발견!
            // 경로의 점들을 추출 (순서대로)
            // path는 [end, ..., start] 순서임.
            // 방의 점들은 순서대로 이어져야 함.
            return path.map(node => node.point);
        }

        const neighbors = adj.get(current.key);
        if (neighbors) {
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.key)) {
                    visited.add(neighbor.key);
                    // 새 경로 생성하여 큐에 추가
                    queue.push([...path, neighbor]);
                }
            }
        }
    }

    return null;
};
