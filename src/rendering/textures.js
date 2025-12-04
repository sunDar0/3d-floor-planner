import { WALL_MATERIALS, FLOOR_MATERIALS } from '../config/constants.js';

const THREE = window.THREE;

/**
 * 색상 문자열을 RGB로 변환
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
};

/**
 * 나무 마루 느낌의 바닥 텍스처 생성
 */
export const createFloorTexture = (materialId = 'wood_oak') => {
    const material = FLOOR_MATERIALS.find(m => m.id === materialId) || FLOOR_MATERIALS[0];
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.globalAlpha = 1;

    if (material.pattern === 'wood') {
        // 나무 마루 패턴
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        const grainColor = material.grainColor || material.color;
        ctx.fillStyle = grainColor;

        for (let i = 0; i < 20; i++) {
            const y = i * (512 / 20);
            ctx.fillRect(0, y, 512, 2); // 줄눈

            // 나이테 느낌
            for (let j = 0; j < 50; j++) {
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = grainColor;
                const x = Math.random() * 512;
                const w = Math.random() * 100;
                ctx.fillRect(x, y + 2, w, (512 / 20) - 4);
            }
        }
    } else if (material.pattern === 'tile') {
        // 타일 패턴
        const tileSize = 128;
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = material.groutColor || '#cccccc';
        ctx.lineWidth = 3;

        for (let x = 0; x <= 512; x += tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 512);
            ctx.stroke();
        }
        for (let y = 0; y <= 512; y += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(512, y);
            ctx.stroke();
        }
    } else if (material.pattern === 'marble') {
        // 대리석 패턴
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = material.veinColor || '#999999';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;

        // 대리석 결 (랜덤 곡선)
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            let x = Math.random() * 512;
            let y = Math.random() * 512;
            ctx.moveTo(x, y);

            for (let j = 0; j < 10; j++) {
                x += (Math.random() - 0.5) * 100;
                y += (Math.random() - 0.5) * 100;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    } else if (material.pattern === 'concrete') {
        // 콘크리트 패턴
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        // 미세한 점 노이즈
        for (let i = 0; i < 8000; i++) {
            const shade = Math.random() > 0.5 ? 20 : -20;
            const rgb = hexToRgb(material.color);
            ctx.fillStyle = `rgb(${rgb.r + shade}, ${rgb.g + shade}, ${rgb.b + shade})`;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
    } else {
        // 기본 단색
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
};

/**
 * 벽 텍스처 생성
 */
export const createWallTexture = (materialId = 'white') => {
    const material = WALL_MATERIALS.find(m => m.id === materialId) || WALL_MATERIALS[0];
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.globalAlpha = 1;

    if (material.pattern === 'solid') {
        // 단색 벽지
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        // 미세한 질감
        for (let i = 0; i < 3000; i++) {
            const rgb = hexToRgb(material.color);
            const shade = Math.random() > 0.5 ? 10 : -10;
            ctx.fillStyle = `rgb(${Math.min(255, rgb.r + shade)}, ${Math.min(255, rgb.g + shade)}, ${Math.min(255, rgb.b + shade)})`;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
    } else if (material.pattern === 'stripe') {
        // 스트라이프 패턴
        const stripeWidth = 20;
        for (let x = 0; x < 512; x += stripeWidth * 2) {
            ctx.fillStyle = material.color;
            ctx.fillRect(x, 0, stripeWidth, 512);
            ctx.fillStyle = material.stripeColor || '#e0e0e0';
            ctx.fillRect(x + stripeWidth, 0, stripeWidth, 512);
        }
    } else if (material.pattern === 'brick') {
        // 벽돌 패턴
        const brickW = 80;
        const brickH = 35;
        const mortarSize = 4;

        ctx.fillStyle = '#d4cfc9'; // 몰탈 색상
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = material.color;
        let row = 0;
        for (let y = 0; y < 512; y += brickH + mortarSize) {
            const offset = (row % 2) * (brickW / 2);
            for (let x = -brickW; x < 512 + brickW; x += brickW + mortarSize) {
                // 색상 변형 (자연스러움)
                const rgb = hexToRgb(material.color);
                const variation = (Math.random() - 0.5) * 30;
                ctx.fillStyle = `rgb(${rgb.r + variation}, ${rgb.g + variation}, ${rgb.b + variation})`;
                ctx.fillRect(x + offset, y, brickW, brickH);
            }
            row++;
        }
    } else if (material.pattern === 'concrete') {
        // 콘크리트 패턴
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 5000; i++) {
            const shade = Math.random() > 0.5 ? 15 : -15;
            const rgb = hexToRgb(material.color);
            ctx.fillStyle = `rgb(${rgb.r + shade}, ${rgb.g + shade}, ${rgb.b + shade})`;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
        }
    } else {
        ctx.fillStyle = material.color;
        ctx.fillRect(0, 0, 512, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
};

/**
 * 흰색 천장 텍스처 생성
 */
export const createCeilingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 흰색 텍스처 (약간의 질감)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    // 미세한 노이즈
    for (let i = 0; i < 10000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#f1f5f9';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
};
