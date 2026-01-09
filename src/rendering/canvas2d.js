import {
    BALCONY_WIDTH,
    DOOR_WIDTH,
    FLOOR_MATERIALS,
    FURNITURE_TEMPLATES,
    VISUAL_GRID_SIZE,
    WALL_MATERIALS,
    WINDOW_WIDTH
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
 * 방 그리기 (room 객체 또는 points 배열 지원)
 */
export const drawRoom = (ctx, roomOrPoints, isPreview = false, scale, floorMaterialId = null, isSelected = false) => {
    // room 객체인 경우 points 추출, 배열인 경우 그대로 사용
    const points = Array.isArray(roomOrPoints) ? roomOrPoints : roomOrPoints.points;
    const materialId = Array.isArray(roomOrPoints) ? floorMaterialId : (roomOrPoints.floorMaterialId || floorMaterialId);
    
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    if (!isPreview) ctx.closePath();

    // 재질 색상 적용 (단순 색상만, 패턴 없음)
    if (isPreview) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    } else if (materialId) {
        const baseColor = getFloorColor(materialId);
        ctx.fillStyle = baseColor + (isSelected ? 'ee' : 'cc');
    } else {
        ctx.fillStyle = "rgba(224, 231, 255, 0.7)";
    }
    ctx.fill();
    
    // 선택 시 테두리 강조
    ctx.strokeStyle = isSelected ? "#2563eb" : (isPreview ? "blue" : "#6366f1");
    ctx.lineWidth = (isSelected ? 4 : 2) / scale;
    ctx.stroke();

    points.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = isSelected ? "#2563eb" : "#4f46e5";
        ctx.arc(p.x, p.y, (isSelected ? 6 : 4) / scale, 0, Math.PI * 2);
        ctx.fill();
    });

    // 방 치수선 표시 (각 변의 길이)
    if (points.length > 1) {
        ctx.fillStyle = "#374151";
        ctx.font = `bold ${11 / scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < (isPreview ? points.length - 1 : points.length); i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const dist = distance(p1, p2);
            if (dist > 20) {
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                // 배경 박스 그리기
                ctx.save();
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                const text = `${Math.round(dist)}`;
                const textWidth = ctx.measureText(text).width;
                ctx.fillRect(midX - textWidth/2 - 2, midY - 6/scale, textWidth + 4, 12/scale);
                ctx.restore();
                ctx.fillStyle = "#374151";
                ctx.fillText(text, midX, midY);
            }
        }
    }
};

/**
 * 벽 그리기 (벽 객체의 개별 재질 지원, 선택 상태 표시)
 */
export const drawWall = (ctx, wall, color, scale, isGuide = false, defaultMaterialId = null, isSelected = false) => {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // 벽의 개별 재질 색상 적용 (없으면 기본값 사용)
    const materialId = wall.materialId || defaultMaterialId;
    const material = WALL_MATERIALS.find(m => m.id === materialId);
    const wallColor = material ? material.color : (color || '#9ca3af');
    
    // 벽 두께
    const wallThickness = isGuide ? 4 : 12;
    
    // 벽을 두꺼운 사각형으로 그리기
    ctx.save();
    ctx.translate(wall.start.x, wall.start.y);
    ctx.rotate(angle);
    
    // 벽 배경 (재질 색상, 단순 색상만)
    ctx.beginPath();
    ctx.rect(0, -wallThickness / 2 / scale, len, wallThickness / scale);
    
    if (isSelected) {
        ctx.fillStyle = "#dbeafe";
    } else if (isGuide) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
    } else {
        ctx.fillStyle = wallColor;
    }
    ctx.fill();
    
    // 벽 테두리
    ctx.strokeStyle = isSelected ? "#2563eb" : (isGuide ? "#ef4444" : "#374151");
    ctx.lineWidth = (isSelected ? 3 : 1.5) / scale;
    ctx.stroke();
    
    ctx.restore();

    // 끝점 핸들
    ctx.fillStyle = isSelected ? "#2563eb" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(wall.start.x, wall.start.y, (isSelected ? 7 : 5) / scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(wall.end.x, wall.end.y, (isSelected ? 7 : 5) / scale, 0, Math.PI * 2);
    ctx.fill();

    // 치수 표시
    if (len > 5) {
        const midX = (wall.start.x + wall.end.x) / 2;
        const midY = (wall.start.y + wall.end.y) / 2;

        ctx.save();
        ctx.translate(midX, midY);

        let textAngle = Math.atan2(dy, dx);
        if (textAngle > Math.PI / 2) textAngle -= Math.PI;
        else if (textAngle < -Math.PI / 2) textAngle += Math.PI;

        ctx.rotate(textAngle);

        const fontSize = Math.max(12 / scale, 8);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        // 배경 박스
        const text = Math.round(len) + " cm";
        const textWidth = ctx.measureText(text).width;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(-textWidth/2 - 3, -fontSize - 6/scale, textWidth + 6, fontSize + 2);
        
        // 텍스트
        ctx.fillStyle = isSelected ? "#1d4ed8" : "#374151";
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
