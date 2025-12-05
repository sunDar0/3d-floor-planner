import {
    WALL_HEIGHT, WALL_THICKNESS, DOOR_WIDTH, DOOR_HEIGHT,
    WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_SILL,
    BALCONY_WIDTH, BALCONY_HEIGHT
} from '../config/constants.js';

const THREE = window.THREE;

export const createRoomObjects = (room, floorMaterial, ceilingMaterial, offsetX, offsetZ) => {
    if (room.points.length < 3) return null;

    const shape = new THREE.Shape();
    shape.moveTo(room.points[0].x + offsetX, room.points[0].y + offsetZ);
    for (let i = 1; i < room.points.length; i++) {
        shape.lineTo(room.points[i].x + offsetX, room.points[i].y + offsetZ);
    }
    shape.lineTo(room.points[0].x + offsetX, room.points[0].y + offsetZ);
    const geometry = new THREE.ShapeGeometry(shape);

    // 방 바닥에 텍스처 적용 (캐싱된 재질 사용)
    const material = floorMaterial;

    // UV 매핑 조정 (텍스처 스케일)
    const posAttribute = geometry.attributes.position;
    const uvAttribute = geometry.attributes.uv;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        uvAttribute.setXY(i, x / 500, y / 500); // 500 단위로 반복
    }

    const floorMesh = new THREE.Mesh(geometry, material);
    floorMesh.rotation.x = Math.PI / 2;
    floorMesh.position.y = 0.5;
    floorMesh.receiveShadow = true;

    // 천장 생성 (Smart Ceiling)
    const ceilingGeom = new THREE.ShapeGeometry(shape);
    // UV 매핑
    const cPosAttribute = ceilingGeom.attributes.position;
    const cUvAttribute = ceilingGeom.attributes.uv;
    for (let i = 0; i < cPosAttribute.count; i++) {
        const x = cPosAttribute.getX(i);
        const y = cPosAttribute.getY(i);
        cUvAttribute.setXY(i, x / 500, y / 500);
    }

    const ceilingMesh = new THREE.Mesh(ceilingGeom, ceilingMaterial);
    ceilingMesh.rotation.x = Math.PI / 2; // 바닥과 같은 방향 (뒤집힘 주의)
    ceilingMesh.position.y = WALL_HEIGHT; // 벽 높이에 배치
    ceilingMesh.visible = false; // 기본적으로 숨김 (FPV에서만 표시)
    ceilingMesh.castShadow = true; // 그림자 생성 (태양광 차단)
    ceilingMesh.receiveShadow = true;

    return { floorMesh, ceilingMesh };
};

export const createWallObjects = (wall, index, openings, wallMaterial, offsetX, offsetZ) => {
    const wallOpenings = openings.filter(o => o.wallIndex === index);
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const wallMat = wallMaterial;
    const doors = [];
    let mesh = null;

    // 기둥 생성 함수 (양쪽 끝을 둥글게 처리)
    const createPillar = (x, y, z) => {
        const geometry = new THREE.CylinderGeometry(WALL_THICKNESS / 2, WALL_THICKNESS / 2, WALL_HEIGHT, 16);
        const pillar = new THREE.Mesh(geometry, wallMat);
        pillar.position.set(x, y, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        return pillar;
    };

    if (wallOpenings.length === 0) {
        const group = new THREE.Group();
        const cx = (wall.start.x + wall.end.x) / 2;
        const cz = (wall.start.y + wall.end.y) / 2;

        // 그룹 위치를 벽의 중심으로 설정 (높이는 0)
        group.position.set(cx + offsetX, 0, cz + offsetZ);
        group.rotation.y = -angle;

        // 벽 메쉬
        const geometry = new THREE.BoxGeometry(len, WALL_HEIGHT, WALL_THICKNESS);
        const wallMesh = new THREE.Mesh(geometry, wallMat);
        wallMesh.position.set(0, WALL_HEIGHT / 2, 0);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        group.add(wallMesh);

        // 양쪽 끝 기둥 추가
        group.add(createPillar(-len / 2, WALL_HEIGHT / 2, 0));
        group.add(createPillar(len / 2, WALL_HEIGHT / 2, 0));

        mesh = group;
    } else {
        wallOpenings.sort((a, b) => a.t - b.t);
        let currentPos = 0;
        const wallGroup = new THREE.Group();
        wallGroup.position.set(wall.start.x + offsetX, 0, wall.start.y + offsetZ);
        wallGroup.rotation.y = -angle;

        // 시작점 기둥
        wallGroup.add(createPillar(0, WALL_HEIGHT / 2, 0));

        wallOpenings.forEach(op => {
            const opPos = op.t * len;
            const opWidth = op.type === 'door' ? DOOR_WIDTH : (op.type === 'balcony' ? BALCONY_WIDTH : WINDOW_WIDTH);
            const opHeight = op.type === 'door' ? DOOR_HEIGHT : (op.type === 'balcony' ? BALCONY_HEIGHT : WINDOW_HEIGHT);
            const opY = (op.type === 'door' || op.type === 'balcony') ? 0 : WINDOW_SILL;
            const start = opPos - opWidth / 2;
            const end = opPos + opWidth / 2;

            if (start > currentPos) {
                const segLen = start - currentPos;
                const geom = new THREE.BoxGeometry(segLen, WALL_HEIGHT, WALL_THICKNESS);
                const mesh = new THREE.Mesh(geom, wallMat);
                mesh.position.set(currentPos + segLen / 2, WALL_HEIGHT / 2, 0);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                wallGroup.add(mesh);
            }

            const headerHeight = WALL_HEIGHT - (opY + opHeight);
            if (headerHeight > 0) {
                const geom = new THREE.BoxGeometry(opWidth, headerHeight, WALL_THICKNESS);
                const mesh = new THREE.Mesh(geom, wallMat);
                mesh.position.set(opPos, WALL_HEIGHT - headerHeight / 2, 0);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                wallGroup.add(mesh);
            }

            if (opY > 0) {
                const geom = new THREE.BoxGeometry(opWidth, opY, WALL_THICKNESS);
                const mesh = new THREE.Mesh(geom, wallMat);
                mesh.position.set(opPos, opY / 2, 0);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                wallGroup.add(mesh);
            }

            if (op.type === 'door') {
                // 경첩(Pivot) 역할을 할 그룹 생성
                const doorPivot = new THREE.Group();
                doorPivot.position.set(start, 0, 0); // 오프닝의 시작점(왼쪽)을 경첩 위치로

                const doorGeom = new THREE.BoxGeometry(opWidth, opHeight, 5);
                const doorMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 });
                const door = new THREE.Mesh(doorGeom, doorMat);

                // 피벗 기준 문 위치 조정 (문의 왼쪽 끝이 피벗에 오도록 중심 이동)
                door.position.set(opWidth / 2, opHeight / 2, 0);
                door.castShadow = true;

                // 손잡이 추가
                const handleGeom = new THREE.SphereGeometry(3);
                const handleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
                const handle = new THREE.Mesh(handleGeom, handleMat);
                // 손잡이 위치 수정: 높이는 중앙(0), 가로는 끝쪽(opWidth/2 - 10)
                handle.position.set(opWidth / 2 - 10, 0, 5);
                door.add(handle);
                const handle2 = handle.clone();
                handle2.position.z = -5;
                door.add(handle2);

                doorPivot.add(door);
                wallGroup.add(doorPivot);

                // 애니메이션을 위해 참조 저장
                doors.push({
                    pivot: doorPivot,
                    width: opWidth
                });
            } else if (op.type === 'balcony') {
                // 발코니 창 (유리)
                const winGeom = new THREE.BoxGeometry(opWidth, opHeight, 2);
                const winMat = new THREE.MeshPhysicalMaterial({
                    color: 0xa7d3ef, // 조금 더 진한 하늘색
                    transparent: true,
                    opacity: 0.6, // 투명도 감소 (더 잘 보이게)
                    metalness: 0.1,
                    roughness: 0.1,
                    transmission: 0.2 // 투과율 감소
                });
                const win = new THREE.Mesh(winGeom, winMat);
                win.position.set(opPos, opHeight / 2, 0);

                // 프레임 추가 (테두리)
                const frameGeom = new THREE.BoxGeometry(opWidth + 4, opHeight + 4, 4);
                const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // 짙은 회색 프레임

                // 간단한 프레임 (상하좌우)
                const frameThick = 4;
                const frameDepth = 6;
                const frameGroup = new THREE.Group();
                frameGroup.position.set(opPos, opHeight / 2, 0);

                // 상
                const topFrame = new THREE.Mesh(new THREE.BoxGeometry(opWidth, frameThick, frameDepth), frameMat);
                topFrame.position.y = opHeight / 2 - frameThick / 2;
                frameGroup.add(topFrame);
                // 하
                const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(opWidth, frameThick, frameDepth), frameMat);
                bottomFrame.position.y = -opHeight / 2 + frameThick / 2;
                frameGroup.add(bottomFrame);
                // 좌
                const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, opHeight, frameDepth), frameMat);
                leftFrame.position.x = -opWidth / 2 + frameThick / 2;
                frameGroup.add(leftFrame);
                // 우
                const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, opHeight, frameDepth), frameMat);
                rightFrame.position.x = opWidth / 2 - frameThick / 2;
                frameGroup.add(rightFrame);

                wallGroup.add(frameGroup);
                wallGroup.add(win);

            } else {
                const winGeom = new THREE.BoxGeometry(opWidth, opHeight, 2);
                const winMat = new THREE.MeshPhysicalMaterial({
                    color: 0xa7d3ef,
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0.1,
                    roughness: 0.1,
                    transmission: 0.2
                });
                const win = new THREE.Mesh(winGeom, winMat);
                win.position.set(opPos, opY + opHeight / 2, 0);

                // 창문 프레임
                const frameThick = 4;
                const frameDepth = 6;
                const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // 흰색 프레임
                const frameGroup = new THREE.Group();
                frameGroup.position.set(opPos, opY + opHeight / 2, 0);

                // 상
                const topFrame = new THREE.Mesh(new THREE.BoxGeometry(opWidth, frameThick, frameDepth), frameMat);
                topFrame.position.y = opHeight / 2 - frameThick / 2;
                frameGroup.add(topFrame);
                // 하
                const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(opWidth, frameThick, frameDepth), frameMat);
                bottomFrame.position.y = -opHeight / 2 + frameThick / 2;
                frameGroup.add(bottomFrame);
                // 좌
                const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, opHeight, frameDepth), frameMat);
                leftFrame.position.x = -opWidth / 2 + frameThick / 2;
                frameGroup.add(leftFrame);
                // 우
                const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, opHeight, frameDepth), frameMat);
                rightFrame.position.x = opWidth / 2 - frameThick / 2;
                frameGroup.add(rightFrame);

                wallGroup.add(frameGroup);
                wallGroup.add(win);
            }
            currentPos = end;
        });

        if (currentPos < len) {
            const segLen = len - currentPos;
            const geom = new THREE.BoxGeometry(segLen, WALL_HEIGHT, WALL_THICKNESS);
            const mesh = new THREE.Mesh(geom, wallMat);
            mesh.position.set(currentPos + segLen / 2, WALL_HEIGHT / 2, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            wallGroup.add(mesh);
        }

        // 끝점 기둥
        wallGroup.add(createPillar(len, WALL_HEIGHT / 2, 0));

        mesh = wallGroup;
    }

    return { mesh, doors };
};
