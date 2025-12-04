import { FURNITURE_TEMPLATES, WALL_HEIGHT } from '../config/constants.js';

const THREE = window.THREE;

export const createFurnitureGroup = (item, offsetX, offsetZ) => {
    const template = FURNITURE_TEMPLATES[item.type];
    if (!template) return null;

    const group = new THREE.Group();
    group.position.set(item.x + offsetX, 0, item.y + offsetZ);
    group.rotation.y = -item.rotation;
    const { width, depth, height, color } = template;

    // 가구 재질 (Standard Material)
    const furnitureMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });

    if (item.type.includes('bed')) {
        const frameGeom = new THREE.BoxGeometry(width, 30, depth);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
        const frame = new THREE.Mesh(frameGeom, frameMat);
        frame.position.y = 15;
        frame.castShadow = true;
        group.add(frame);

        const matGeom = new THREE.BoxGeometry(width - 10, 20, depth - 10);
        const matMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        const mat = new THREE.Mesh(matGeom, matMat);
        mat.position.y = 30 + 10;
        mat.castShadow = true;
        group.add(mat);

        const pillowGeom = new THREE.BoxGeometry(width - 20, 10, 30);
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 1 });
        const pillow = new THREE.Mesh(pillowGeom, pillowMat);
        pillow.position.set(0, 55, -depth / 2 + 25);
        pillow.castShadow = true;
        group.add(pillow);

        const headGeom = new THREE.BoxGeometry(width, 100, 10);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.6 });
        const head = new THREE.Mesh(headGeom, headMat);
        head.position.set(0, 50, -depth / 2 + 5);
        head.castShadow = true;
        group.add(head);
    } else if (item.type.includes('sofa')) {
        const seatHeight = 40;
        const seatGeom = new THREE.BoxGeometry(width, seatHeight, depth - 20);
        const seatMat = new THREE.MeshStandardMaterial({ color, roughness: 1 }); // 패브릭 느낌
        const seat = new THREE.Mesh(seatGeom, seatMat);
        seat.position.set(0, seatHeight / 2, 10);
        seat.castShadow = true;
        group.add(seat);

        const backGeom = new THREE.BoxGeometry(width, height, 20);
        const back = new THREE.Mesh(backGeom, seatMat);
        back.position.set(0, height / 2, -depth / 2 + 10);
        back.castShadow = true;
        group.add(back);

        const armGeom = new THREE.BoxGeometry(15, 60, depth);
        const armLeft = new THREE.Mesh(armGeom, seatMat);
        armLeft.position.set(-width / 2 + 7.5, 30, 0);
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeom, seatMat);
        armRight.position.set(width / 2 - 7.5, 30, 0);
        group.add(armRight);
    } else if (item.type === 'desk') {
        const topGeom = new THREE.BoxGeometry(width, 5, depth);
        const topMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });
        const top = new THREE.Mesh(topGeom, topMat);
        top.position.y = height - 2.5;
        top.castShadow = true;
        group.add(top);

        const legGeom = new THREE.BoxGeometry(5, height - 5, 5);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.8 });
        [{ x: -width / 2 + 10, z: -depth / 2 + 10 }, { x: width / 2 - 10, z: -depth / 2 + 10 },
        { x: -width / 2 + 10, z: depth / 2 - 10 }, { x: width / 2 - 10, z: depth / 2 - 10 }]
            .forEach(pos => {
                const leg = new THREE.Mesh(legGeom, legMat);
                leg.position.set(pos.x, (height - 5) / 2, pos.z);
                leg.castShadow = true;
                group.add(leg);
            });

        // 의자 추가
        const chairGroup = new THREE.Group();
        const chairWidth = 45;
        const chairDepth = 45;
        const chairHeight = 45;

        // 책상 앞쪽에 배치
        chairGroup.position.set(0, 0, depth / 2 + 20);
        chairGroup.rotation.y = Math.PI; // 책상을 바라보게

        // 좌판
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(chairWidth, 5, chairDepth),
            new THREE.MeshStandardMaterial({ color: 0x4b5563 }) // 다크 그레이
        );
        seat.position.y = chairHeight - 2.5;
        seat.castShadow = true;
        chairGroup.add(seat);

        // 다리 (오피스 체어 스타일)
        const poleGeom = new THREE.BoxGeometry(5, chairHeight - 10, 5);
        const pole = new THREE.Mesh(poleGeom, new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
        pole.position.y = (chairHeight - 10) / 2;
        chairGroup.add(pole);

        const baseGeom = new THREE.BoxGeometry(35, 5, 35);
        const base = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
        base.position.y = 2.5;
        chairGroup.add(base);

        // 등받이
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(chairWidth, 45, 5),
            new THREE.MeshStandardMaterial({ color: 0x4b5563 })
        );
        back.position.set(0, chairHeight + 22.5, -chairDepth / 2 + 2.5);
        back.castShadow = true;
        chairGroup.add(back);

        // 팔걸이
        const armGeom = new THREE.BoxGeometry(5, 20, 30);
        const armMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });

        const leftArm = new THREE.Mesh(armGeom, armMat);
        leftArm.position.set(-chairWidth / 2 + 2.5, chairHeight + 10, 0);
        chairGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeom, armMat);
        rightArm.position.set(chairWidth / 2 - 2.5, chairHeight + 10, 0);
        chairGroup.add(rightArm);

        group.add(chairGroup);
    } else if (item.type.includes('bookshelf')) {
        const thickness = 2;
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });

        // Back
        const backGeom = new THREE.BoxGeometry(width, height, thickness);
        const back = new THREE.Mesh(backGeom, mat);
        back.position.set(0, height / 2, -depth / 2 + thickness / 2);
        back.castShadow = true;
        group.add(back);

        // Sides
        const sideGeom = new THREE.BoxGeometry(thickness, height, depth);
        const left = new THREE.Mesh(sideGeom, mat);
        left.position.set(-width / 2 + thickness / 2, height / 2, 0);
        left.castShadow = true;
        group.add(left);

        const right = new THREE.Mesh(sideGeom, mat);
        right.position.set(width / 2 - thickness / 2, height / 2, 0);
        right.castShadow = true;
        group.add(right);

        // Shelves
        const shelfCount = 6;
        const shelfGeom = new THREE.BoxGeometry(width - thickness * 2, thickness, depth - thickness);
        for (let i = 0; i < shelfCount; i++) {
            const shelf = new THREE.Mesh(shelfGeom, mat);
            const posY = (height - thickness) * (i / (shelfCount - 1)) + thickness / 2;
            shelf.position.set(0, posY, thickness / 2);
            shelf.castShadow = true;
            group.add(shelf);
        }
    } else if (item.type.includes('fridge')) {
        // Body
        const bodyGeom = new THREE.BoxGeometry(width, height, depth - 5);
        const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.1 });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(0, height / 2, -2.5);
        body.castShadow = true;
        group.add(body);

        // Doors
        const doorDepth = 5;
        const doorGap = 0.5;

        if (item.type === 'fridge_double') {
            const doorWidth = (width - doorGap) / 2;
            const doorGeom = new THREE.BoxGeometry(doorWidth, height, doorDepth);

            const leftDoor = new THREE.Mesh(doorGeom, bodyMat);
            leftDoor.position.set(-width / 4 - doorGap / 4, height / 2, depth / 2 - doorDepth / 2);
            leftDoor.castShadow = true;
            group.add(leftDoor);

            const rightDoor = new THREE.Mesh(doorGeom, bodyMat);
            rightDoor.position.set(width / 4 + doorGap / 4, height / 2, depth / 2 - doorDepth / 2);
            rightDoor.castShadow = true;
            group.add(rightDoor);

            // Handles
            const handleGeom = new THREE.BoxGeometry(2, 40, 2);
            const handleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1, metalness: 0.8 });

            const leftHandle = new THREE.Mesh(handleGeom, handleMat);
            leftHandle.position.set(-5, height / 2, depth / 2 + 1);
            group.add(leftHandle);

            const rightHandle = new THREE.Mesh(handleGeom, handleMat);
            rightHandle.position.set(5, height / 2, depth / 2 + 1);
            group.add(rightHandle);
        } else {
            const doorGeom = new THREE.BoxGeometry(width, height, doorDepth);
            const door = new THREE.Mesh(doorGeom, bodyMat);
            door.position.set(0, height / 2, depth / 2 - doorDepth / 2);
            door.castShadow = true;
            group.add(door);

            const handleGeom = new THREE.BoxGeometry(2, 40, 2);
            const handleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1, metalness: 0.8 });
            const handle = new THREE.Mesh(handleGeom, handleMat);
            handle.position.set(-width / 2 + 10, height / 2, depth / 2 + 1);
            group.add(handle);
        }
    } else if (item.type.includes('dining_table')) {
        // 상판
        const topGeom = new THREE.BoxGeometry(width, 4, depth);
        const topMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
        const top = new THREE.Mesh(topGeom, topMat);
        top.position.y = height - 2;
        top.castShadow = true;
        group.add(top);

        // 다리 (4개)
        const legGeom = new THREE.BoxGeometry(6, height - 4, 6);
        const legMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
        const legPos = [
            { x: -width / 2 + 10, z: -depth / 2 + 10 },
            { x: width / 2 - 10, z: -depth / 2 + 10 },
            { x: -width / 2 + 10, z: depth / 2 - 10 },
            { x: width / 2 - 10, z: depth / 2 - 10 }
        ];
        legPos.forEach(pos => {
            const leg = new THREE.Mesh(legGeom, legMat);
            leg.position.set(pos.x, (height - 4) / 2, pos.z);
            leg.castShadow = true;
            group.add(leg);
        });

        // 의자 (간단하게 큐브로 표현하거나 등받이 있는 형태)
        const chairWidth = 40;
        const chairDepth = 40;
        const chairHeight = 45;

        const chairCountSide = item.type === 'dining_table_6p' ? 3 : 2;
        const spacing = width / chairCountSide;

        for (let side = -1; side <= 1; side += 2) { // 양쪽 (-1, 1)
            for (let i = 0; i < chairCountSide; i++) {
                const chairGroup = new THREE.Group();
                // 위치 계산: 중앙 정렬
                const x = -width / 2 + spacing / 2 + i * spacing;
                const z = side * (depth / 2 + 20); // 테이블에서 약간 떨어짐

                chairGroup.position.set(x, 0, z);
                // 회전: 테이블을 바라보게
                chairGroup.rotation.y = side === 1 ? Math.PI : 0;

                // 좌판
                const seat = new THREE.Mesh(
                    new THREE.BoxGeometry(chairWidth, 5, chairDepth),
                    new THREE.MeshStandardMaterial({ color: 0xa1887f })
                );
                seat.position.y = chairHeight - 2.5;
                seat.castShadow = true;
                chairGroup.add(seat);

                // 다리
                const cLegGeom = new THREE.BoxGeometry(4, chairHeight - 5, 4);
                const cLegs = [
                    { x: -15, z: -15 }, { x: 15, z: -15 },
                    { x: -15, z: 15 }, { x: 15, z: 15 }
                ];
                cLegs.forEach(p => {
                    const l = new THREE.Mesh(cLegGeom, new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
                    l.position.set(p.x, (chairHeight - 5) / 2, p.z);
                    chairGroup.add(l);
                });

                // 등받이
                const back = new THREE.Mesh(
                    new THREE.BoxGeometry(chairWidth, 40, 5),
                    new THREE.MeshStandardMaterial({ color: 0xa1887f })
                );
                back.position.set(0, chairHeight + 20, -chairDepth / 2 + 2.5);
                back.castShadow = true;
                chairGroup.add(back);

                group.add(chairGroup);
            }
        }

    } else if (item.type.includes('washer') || item.type === 'dryer' || item.type === 'wash_tower') {
        // Body
        const bodyGeom = new THREE.BoxGeometry(width, height, depth);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = height / 2;
        body.castShadow = true;
        group.add(body);

        // Door / Lid
        if (item.type === 'washer_top') {
            // Top lid
            const lidGeom = new THREE.BoxGeometry(width - 4, 2, depth - 10);
            const lidMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2 });
            const lid = new THREE.Mesh(lidGeom, lidMat);
            lid.position.set(0, height + 1, -2);
            group.add(lid);

            // Control panel
            const panelGeom = new THREE.BoxGeometry(width, 10, 10);
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const panel = new THREE.Mesh(panelGeom, panelMat);
            panel.position.set(0, height + 5, depth / 2 - 5);
            group.add(panel);
        } else if (item.type === 'washer_front' || item.type === 'dryer') {
            // Front door (Circle)
            const doorGeom = new THREE.CylinderGeometry(width / 2 - 5, width / 2 - 5, 5, 32);
            const doorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.5 });
            const door = new THREE.Mesh(doorGeom, doorMat);
            door.rotation.x = Math.PI / 2;
            door.position.set(0, height / 2, depth / 2 + 2.5);
            group.add(door);

            // Window inside door
            const winGeom = new THREE.CylinderGeometry(width / 2 - 10, width / 2 - 10, 6, 32);
            const winMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1, metalness: 0.1 });
            const win = new THREE.Mesh(winGeom, winMat);
            win.rotation.x = Math.PI / 2;
            win.position.set(0, height / 2, depth / 2 + 2.5);
            group.add(win);

            // Control panel
            const panelGeom = new THREE.BoxGeometry(width, 10, 2);
            const panelMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
            const panel = new THREE.Mesh(panelGeom, panelMat);
            panel.position.set(0, height - 5, depth / 2 + 1);
            group.add(panel);
        } else if (item.type === 'wash_tower') {
            // Two doors
            const doorGeom = new THREE.CylinderGeometry(width / 2 - 5, width / 2 - 5, 5, 32);
            const doorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.5 });

            // Bottom door (Washer)
            const bottomDoor = new THREE.Mesh(doorGeom, doorMat);
            bottomDoor.rotation.x = Math.PI / 2;
            bottomDoor.position.set(0, height * 0.25, depth / 2 + 2.5);
            group.add(bottomDoor);

            // Top door (Dryer)
            const topDoor = new THREE.Mesh(doorGeom, doorMat);
            topDoor.rotation.x = Math.PI / 2;
            topDoor.position.set(0, height * 0.75, depth / 2 + 2.5);
            group.add(topDoor);

            // Control panel (Center)
            const panelGeom = new THREE.BoxGeometry(width, 10, 2);
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const panel = new THREE.Mesh(panelGeom, panelMat);
            panel.position.set(0, height * 0.5, depth / 2 + 1);
            group.add(panel);
        }
    } else if (item.type.includes('light')) {
        // Ceiling Light
        // Move group to ceiling height
        group.position.y = WALL_HEIGHT;

        const isLed = item.type.includes('led');
        const lightColor = 0xffffee; // Warm white

        if (isLed) {
            // Slim LED Panel
            const panelGeom = new THREE.BoxGeometry(width, height, depth); // Height is thickness here
            const panelMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: lightColor,
                emissiveIntensity: 0.8,
                roughness: 0.1
            });
            const panel = new THREE.Mesh(panelGeom, panelMat);
            panel.position.y = -height / 2; // Attach to ceiling
            group.add(panel);

            // Point Light for illumination
            const light = new THREE.PointLight(lightColor, 0.4, 300);
            light.position.y = -10;
            group.add(light);
        } else {
            // Fluorescent Light (Bulky)
            const bodyGeom = new THREE.BoxGeometry(width, height, depth);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.position.y = -height / 2;
            group.add(body);

            // Tubes (Visual only)
            const tubeGeom = new THREE.CylinderGeometry(2, 2, width - 10, 16);
            const tubeMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1
            });

            const tube1 = new THREE.Mesh(tubeGeom, tubeMat);
            tube1.rotation.z = Math.PI / 2;
            tube1.position.set(0, -height, -depth / 4);
            group.add(tube1);

            const tube2 = new THREE.Mesh(tubeGeom, tubeMat);
            tube2.rotation.z = Math.PI / 2;
            tube2.position.set(0, -height, depth / 4);
            group.add(tube2);

            // Point Light
            const light = new THREE.PointLight(lightColor, 0.3, 300);
            light.position.y = -20;
            group.add(light);
        }
    } else if (item.type === 'wardrobe' || item.type === 'shoe_rack') {
        const bodyGeom = new THREE.BoxGeometry(width, height, depth);
        const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = height / 2;
        body.castShadow = true;
        group.add(body);

        // Doors
        const doorWidth = width / 2 - 1;
        const doorGeom = new THREE.BoxGeometry(doorWidth, height - 4, 2);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }); // White doors usually

        const leftDoor = new THREE.Mesh(doorGeom, doorMat);
        leftDoor.position.set(-width / 4, height / 2, depth / 2 + 1);
        group.add(leftDoor);

        const rightDoor = new THREE.Mesh(doorGeom, doorMat);
        rightDoor.position.set(width / 4, height / 2, depth / 2 + 1);
        group.add(rightDoor);

        // Handles
        const handleGeom = new THREE.BoxGeometry(2, 10, 2);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const leftHandle = new THREE.Mesh(handleGeom, handleMat);
        leftHandle.position.set(-5, height / 2, depth / 2 + 3);
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeom, handleMat);
        rightHandle.position.set(5, height / 2, depth / 2 + 3);
        group.add(rightHandle);
    } else if (item.type === 'tv_stand') {
        // 본체
        const bodyGeom = new THREE.BoxGeometry(width, height - 10, depth);
        const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = (height - 10) / 2 + 10;
        body.castShadow = true;
        group.add(body);

        // 다리
        const legGeom = new THREE.BoxGeometry(5, 10, 5);
        const legPos = [
            { x: -width / 2 + 10, z: -depth / 2 + 10 },
            { x: width / 2 - 10, z: -depth / 2 + 10 },
            { x: -width / 2 + 10, z: depth / 2 - 10 },
            { x: width / 2 - 10, z: depth / 2 - 10 }
        ];
        legPos.forEach(pos => {
            const leg = new THREE.Mesh(legGeom, bodyMat);
            leg.position.set(pos.x, 5, pos.z);
            leg.castShadow = true;
            group.add(leg);
        });

        // 서랍/문 디테일
        const drawerGeom = new THREE.BoxGeometry(width / 3 - 4, height - 20, 2);
        const drawerMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
        for (let i = -1; i <= 1; i++) {
            const drawer = new THREE.Mesh(drawerGeom, drawerMat);
            drawer.position.set(i * (width / 3), (height - 10) / 2 + 10, depth / 2 + 1);
            group.add(drawer);
        }

        // TV
        const tvWidth = 140;
        const tvHeight = 80;
        const tvDepth = 5;
        const tvGeom = new THREE.BoxGeometry(tvWidth, tvHeight, tvDepth);
        const tvMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
        const tv = new THREE.Mesh(tvGeom, tvMat);
        tv.position.set(0, height + tvHeight / 2, 0);
        tv.castShadow = true;
        group.add(tv);

        // TV 받침대
        const standGeom = new THREE.BoxGeometry(40, 5, 20);
        const stand = new THREE.Mesh(standGeom, tvMat);
        stand.position.set(0, height + 2.5, 0);
        group.add(stand);

        const neckGeom = new THREE.BoxGeometry(10, 10, 5);
        const neck = new THREE.Mesh(neckGeom, tvMat);
        neck.position.set(0, height + 7.5, 0);
        group.add(neck);
    }
    return group;
};
