import {
    VISUAL_GRID_SIZE, DOOR_WIDTH, WINDOW_WIDTH, BALCONY_WIDTH, FURNITURE_TEMPLATES,
    WALL_MATERIALS, FLOOR_MATERIALS
} from '../config/constants.js';
import { distance } from '../utils/geometry.js';

/**
 * 재질 ID로 색상 가져오기
 */
const getFloorColor = (materialId) => {
    const mat = FLOOR_MATERIALS.find(m => m.id === materialId);
    return mat ? mat.color : '#e0e7ff';
};

const getWallColor = (materialId) => {
    const mat = WALL_MATERIALS.find(m => m.id === materialId);
    return mat ? mat.color : '#9ca3af';
};

/**
 * 방 그리기
 */
export const drawRoom = (ctx, points, isPreview = false, scale, floorMaterialId = null) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    if (!isPreview) ctx.closePath();

    // 재질 색상 적용
    if (isPreview) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    } else if (floorMaterialId) {
        const baseColor = getFloorColor(floorMaterialId);
        ctx.fillStyle = baseColor + 'aa'; // 투명도 추가
    } else {
        ctx.fillStyle = "rgba(224, 231, 255, 0.5)";
    }
    ctx.fill();
    ctx.strokeStyle = isPreview ? "blue" : "#a5b4fc";
    ctx.lineWidth = 2 / scale;
    ctx.stroke();

    points.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(p.x, p.y, 3 / scale, 0, Math.PI * 2);
        ctx.fill();
    });

    // 방 치수선 표시 (각 변의 길이)
    if (points.length > 1) {
        ctx.fillStyle = "#6b7280";
        ctx.font = `${10 / scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < (isPreview ? points.length - 1 : points.length); i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const dist = distance(p1, p2);
            if (dist > 20) {
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                ctx.fillText(`${Math.round(dist)}`, midX, midY);
            }
        }
    }
};

/**
 * 벽 그리기
 */
export const drawWall = (ctx, wall, color, scale, isGuide = false, wallMaterialId = null) => {
    ctx.beginPath();
    // 재질 색상 적용
    if (wallMaterialId && !isGuide) {
        ctx.strokeStyle = getWallColor(wallMaterialId);
    } else {
        ctx.strokeStyle = color;
    }
    ctx.lineWidth = (isGuide ? 2 : 4) / scale;
    ctx.lineCap = "round";
    ctx.moveTo(wall.start.x, wall.start.y);
    ctx.lineTo(wall.end.x, wall.end.y);
    ctx.stroke();

    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(wall.start.x, wall.start.y, 4 / scale, 0, Math.PI * 2);
    ctx.arc(wall.end.x, wall.end.y, 4 / scale, 0, Math.PI * 2);
    ctx.fill();

    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len > 5) {
        const midX = (wall.start.x + wall.end.x) / 2;
        const midY = (wall.start.y + wall.end.y) / 2;

        ctx.save();
        ctx.translate(midX, midY);

        let angle = Math.atan2(dy, dx);
        if (angle > Math.PI / 2) angle -= Math.PI;
        else if (angle < -Math.PI / 2) angle += Math.PI;

        ctx.rotate(angle);

        const fontSize = Math.max(12 / scale, 8);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = "#4b5563";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3 / scale;
        const text = Math.round(len) + " cm";
        ctx.strokeText(text, 0, -4 / scale);
        ctx.fillText(text, 0, -4 / scale);

        ctx.restore();
    }
};

/**
 * 오프닝 (문/창문) 그리기
 */
export const drawOpening = (ctx, op, walls, scale, isPreview = false) => {
    const wall = walls[op.wallIndex];
    if (!wall) return;

    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;

    const cx = wall.start.x + dx * op.t;
    const cy = wall.start.y + dy * op.t;

    const angle = Math.atan2(dy, dx);
    const width = op.type === 'door' ? DOOR_WIDTH : (op.type === 'balcony' ? BALCONY_WIDTH : WINDOW_WIDTH);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = "white";
    ctx.fillRect(-width / 2, -4 / scale, width, 8 / scale);

    ctx.strokeStyle = isPreview ? "red" : "brown";
    ctx.lineWidth = 2 / scale;

    if (op.type === 'door') {
        ctx.beginPath();
        ctx.arc(-width / 2, -width / 2, width, 0, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width / 2, 0);
        ctx.lineTo(-width / 2, -width);
        ctx.stroke();
    } else {
        ctx.strokeRect(-width / 2, -2 / scale, width, 4 / scale);
        ctx.fillStyle = "#bae6fd";
        ctx.fillRect(-width / 2, -2 / scale, width, 4 / scale);

        // 발코니는 중간에 선 추가 (슬라이딩 도어 느낌)
        if (op.type === 'balcony') {
            ctx.beginPath();
            ctx.moveTo(0, -2 / scale);
            ctx.lineTo(0, 2 / scale);
            ctx.stroke();
        }
    }

    ctx.restore();
};

/**
 * 가구 그리기
 */
export const drawFurniture = (ctx, item, scale, selectedFurnitureId, isPreview = false) => {
    const template = FURNITURE_TEMPLATES[item.type];
    if (!template) return;

    const isSelected = item.id === selectedFurnitureId;

    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation);

    const { width, depth, label } = template;

    ctx.beginPath();
    ctx.rect(-width / 2, -depth / 2, width, depth);

    ctx.fillStyle = isPreview ? "rgba(100, 100, 100, 0.5)" : (isSelected ? "#bfdbfe" : "#e5e7eb");
    ctx.fill();
    ctx.strokeStyle = isPreview ? "blue" : (isSelected ? "#2563eb" : "#4b5563");
    ctx.lineWidth = (isSelected ? 3 : 2) / scale;
    ctx.stroke();

    // 선택된 경우 모서리 핸들 표시
    if (isSelected) {
        ctx.fillStyle = "#2563eb";
        const handleSize = 6 / scale;
        ctx.fillRect(-width / 2 - handleSize / 2, -depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(width / 2 - handleSize / 2, -depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(width / 2 - handleSize / 2, depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(-width / 2 - handleSize / 2, depth / 2 - handleSize / 2, handleSize, handleSize);
    }

    // 방향 표시 (앞쪽)
    ctx.beginPath();
    ctx.moveTo(-width / 4, depth / 2 - 5);
    ctx.lineTo(width / 4, depth / 2 - 5);
    ctx.stroke();

    // 텍스트
    ctx.fillStyle = "#000";
    ctx.font = `${12 / scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.rotate(-item.rotation); // 텍스트는 정방향 유지
    ctx.fillText(label, 0, 0);
    ctx.restore();

    ctx.restore();
};

/**
 * 그리드 그리기
 */
export const drawGrid = (ctx, canvas, scale, pan) => {
    const startX = Math.floor(-pan.x / scale / VISUAL_GRID_SIZE) * VISUAL_GRID_SIZE;
    const startY = Math.floor(-pan.y / scale / VISUAL_GRID_SIZE) * VISUAL_GRID_SIZE;
    const endX = startX + (canvas.width / scale) + VISUAL_GRID_SIZE;
    const endY = startY + (canvas.height / scale) + VISUAL_GRID_SIZE;

    ctx.beginPath();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1 / scale;

    for (let x = startX; x <= endX; x += VISUAL_GRID_SIZE) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += VISUAL_GRID_SIZE) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();
};
