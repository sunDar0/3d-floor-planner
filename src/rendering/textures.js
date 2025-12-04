/**
 * 나무 마루 느낌의 바닥 텍스처 생성
 */
export const createFloorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 베이스 컬러
    ctx.fillStyle = '#e5d0b1';
    ctx.fillRect(0, 0, 512, 512);

    // 나무 결 무늬
    ctx.fillStyle = '#d4b895';
    for (let i = 0; i < 20; i++) {
        const y = i * (512 / 20);
        ctx.fillRect(0, y, 512, 2); // 줄눈

        // 나이테 느낌
        for (let j = 0; j < 50; j++) {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#8b5a2b';
            const x = Math.random() * 512;
            const w = Math.random() * 100;
            ctx.fillRect(x, y + 2, w, (512 / 20) - 4);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
};

/**
 * 회색 톤의 벽 텍스처 생성
 */
export const createWallTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 512, 512);

    // 노이즈
    for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#e5e7eb';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
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
