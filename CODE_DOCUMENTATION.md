# 3D Floor Planner - 코드 구조 문서

## 📋 개요
이 프로젝트는 React와 Three.js를 사용하여 구현된 웹 기반 3D 평면도 설계 도구입니다. 사용자는 2D 편집 모드에서 방, 벽, 문, 창문, 가구를 배치하고, 3D 뷰어에서 실시간으로 확인할 수 있습니다.

## 🏗️ 기술 스택
- **React 18**: UI 컴포넌트 및 상태 관리
- **Three.js (r128)**: 3D 렌더링
- **Tailwind CSS**: 스타일링
- **Babel Standalone**: JSX 변환
- **HTML5 Canvas**: 2D 편집 화면

## 📁 파일 구조
```
index.html (단일 파일, 약 2100줄)
├── HTML 구조 (1-36줄)
├── 상수 정의 (42-96줄)
├── 유틸리티 함수 (98-154줄)
├── 커스텀 훅 (156-192줄)
├── 텍스처 생성 함수 (194-270줄)
├── Viewer3D 컴포넌트 (272-1100줄)
├── Toolbar 컴포넌트 (1102-1180줄)
├── HelpButton 컴포넌트 (1182-1210줄)
└── App 컴포넌트 (1212-2100줄)
```

---

## 🔧 주요 상수 (Constants)

### 그리드 및 벽 설정
```javascript
GRID_SIZE = 1              // 1cm 단위 이동 (정밀함)
VISUAL_GRID_SIZE = 5       // 5cm 격자 표시
WALL_THICKNESS = 15        // 15cm 벽 두께
WALL_HEIGHT = 240          // 2.4m 벽 높이
```

### 오프닝 (문/창문) 설정
```javascript
DOOR_WIDTH = 90            // 90cm 문 폭
DOOR_HEIGHT = 210          // 2.1m 문 높이
WINDOW_WIDTH = 120         // 1.2m 창문 폭
WINDOW_HEIGHT = 120        // 1.2m 창문 높이
WINDOW_SILL = 90           // 창문 바닥에서 떨어진 높이
BALCONY_WIDTH = 240        // 2.4m 발코니 창
BALCONY_HEIGHT = 210       // 2.1m 발코니 높이
```

### 1인칭 시점 높이
```javascript
HEIGHT_MALE = 180          // 남성 시점 (180cm)
HEIGHT_FEMALE = 160        // 여성 시점 (160cm)
```

### 도구 목록
**기본 도구 (TOOLS)**:
- `select`: 선택 도구
- `wall`: 벽 그리기
- `room`: 방(바닥) 그리기
- `door`: 문 배치
- `window`: 창문 배치
- `balcony`: 발코니 창 배치

**가구 도구 (FURNITURE_TOOLS)**:
- 책상, 소파(2인/3인), 침대(S/Q/K)
- 책장(160cm/100cm), 냉장고(양문/단문)
- 식탁(4인/6인), TV장

---

## 🛠️ 유틸리티 함수

### `snapToGrid(val)`
값을 `GRID_SIZE` 단위로 스냅합니다.

### `distance(p1, p2)`
두 점 사이의 유클리드 거리를 계산합니다.

### `projectPointOnLine(point, start, end)`
점을 선분에 투영하고, 투영된 위치와 비율(t)을 반환합니다.

### `getSnappedPosition(x, y)`
**스마트 스냅 시스템**:
1. **Vertex Snapping**: 기존 점에 우선적으로 스냅 (15px 이내)
2. **Alignment Snapping**: X/Y축 정렬 스냅 (가이드라인 표시)

---

## 🎨 텍스처 생성 함수

### `createFloorTexture()`
나무 마루 느낌의 바닥 텍스처를 생성합니다.
- 베이스 색상: `#e5d0b1`
- 나무 결 무늬 및 나이테 효과

### `createWallTexture()`
회색 톤의 벽 텍스처를 생성합니다.
- 베이스 색상: `#f3f4f6`
- 노이즈 효과로 질감 표현

### `createCeilingTexture()`
흰색 천장 텍스처를 생성합니다.
- 베이스 색상: `#f8fafc`
- 미세한 노이즈로 자연스러운 질감

---

## 🎬 커스텀 훅

### `useHistory(initialState)`
Undo/Redo 기능을 제공하는 히스토리 관리 훅입니다.

**반환값**:
- `state`: 현재 상태
- `pushState(newState)`: 새 상태 추가
- `undo()`: 실행 취소
- `redo()`: 다시 실행
- `reset(newState)`: 초기화
- `canUndo`: 실행 취소 가능 여부
- `canRedo`: 다시 실행 가능 여부

---

## 🎮 Viewer3D 컴포넌트

### Props
```javascript
{ walls, rooms, openings, furniture }
```

### 주요 기능

#### 1. **3D 씬 구성**
- **조명**: Ambient, Hemisphere, Directional (그림자 지원)
- **바닥**: 외부 바닥 + 방별 텍스처 바닥
- **벽**: 오프닝(문/창문) 고려한 세그먼트 렌더링
- **천장**: FPV 모드에서만 표시 (Smart Ceiling)

#### 2. **카메라 모드**
- **Orbit 모드**: OrbitControls를 사용한 조감도
- **FPV 모드**: PointerLockControls를 사용한 1인칭 시점
  - WASD 키로 이동
  - 마우스로 시선 이동
  - 충돌 감지 (벽 통과 방지)
  - 문 통과 가능

#### 3. **인터랙티브 도어 시스템**
- **자동 개폐**: 플레이어가 1.5m 이내 접근 시 자동 열림
- **히스테리시스**: 열림(150cm), 닫힘(250cm) 거리 차이로 떨림 방지
- **방향 감지**: 플레이어 위치에 따라 밀고 들어가는 방향으로 회전
- **부드러운 애니메이션**: Lerp를 사용한 자연스러운 회전

#### 4. **가구 3D 모델링**
각 가구 타입별로 상세한 3D 모델 구현:
- **침대**: 프레임, 매트리스, 베개, 헤드보드
- **소파**: 좌석, 등받이, 팔걸이
- **책상**: 상판, 다리, **의자 포함**
- **책장**: 뒷판, 측면, 선반
- **냉장고**: 본체, 문, 손잡이
- **식탁**: 상판, 다리, **의자 포함** (4인/6인)
- **TV장**: 본체, 다리, 서랍, **TV 포함**

---

## 🖥️ App 컴포넌트

### 상태 관리
```javascript
{
  walls: [],      // 벽 배열
  rooms: [],      // 방 배열
  openings: [],   // 문/창문 배열
  furniture: []   // 가구 배열
}
```

### 주요 기능

#### 1. **2D 편집 모드**
- **Canvas 기반 렌더링**
- **줌 & 팬**: 마우스 휠 줌, 우클릭/Shift+드래그 팬
- **스마트 가이드**: 정렬 시 가이드라인 표시
- **실시간 치수 표시**: 벽/방 길이 자동 표시

#### 2. **도구별 동작**
- **벽 그리기**: 드래그하여 벽 생성, Shift로 수직/수평 고정
- **방 그리기**: 드래그하여 사각형 방 생성
- **문/창문 배치**: 벽 위에 마우스 올려 배치
- **가구 배치**: 클릭하여 배치, R키로 회전, 드래그로 이동

#### 3. **데이터 관리**
- **자동 저장**: LocalStorage에 자동 저장
- **파일 저장/불러오기**: JSON 형식으로 내보내기/가져오기
- **Undo/Redo**: Ctrl+Z / Ctrl+Y

#### 4. **단축키**
- `Ctrl+Z`: 실행 취소
- `Ctrl+Y` / `Ctrl+Shift+Z`: 다시 실행
- `R`: 가구 회전
- `Del` / `Backspace`: 선택된 가구 삭제
- `Esc`: 도구 선택 취소

---

## 🎯 핵심 알고리즘

### 1. **Vertex Snapping (정점 스냅)**
```javascript
// 기존 점에 15px 이내로 접근하면 해당 점에 강제 스냅
for (const p of points) {
    const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
    if (dist < SNAP_DIST) {
        return { x: p.x, y: p.y, guides: [] };
    }
}
```

### 2. **충돌 감지 (Collision Detection)**
```javascript
// 플레이어와 벽 사이의 거리 계산
// 문/발코니가 있는 경우 통과 가능
const proj = projectPointOnLine({ x: px, y: pz }, wall.start, wall.end);
const dist = distance({ x: px, y: pz }, proj);
if (dist < THRESHOLD) {
    // 문 구간 확인 후 통과 여부 결정
}
```

### 3. **도어 애니메이션**
```javascript
// 히스테리시스 적용
const OPEN_DIST = 150;   // 열림 거리
const CLOSE_DIST = 250;  // 닫힘 거리

// 방향 감지 (내적 사용)
const doorDir = new THREE.Vector3(0, 0, 1);
const toPlayer = new THREE.Vector3().subVectors(playerPos, worldPos).normalize();
const dot = doorDir.dot(toPlayer);

// 부드러운 회전 (Lerp)
door.pivot.rotation.y = THREE.MathUtils.lerp(
    door.pivot.rotation.y, 
    door.targetAngle, 
    0.05
);
```

---

## 📊 데이터 구조

### Wall (벽)
```javascript
{
  start: { x, y },
  end: { x, y },
  thickness: 15
}
```

### Room (방)
```javascript
{
  points: [{ x, y }, ...]  // 다각형 꼭짓점 배열
}
```

### Opening (문/창문)
```javascript
{
  type: 'door' | 'window' | 'balcony',
  wallIndex: number,  // 어느 벽에 속하는지
  t: number          // 벽 상의 위치 비율 (0~1)
}
```

### Furniture (가구)
```javascript
{
  id: number,
  type: string,      // 'desk', 'bed_single', etc.
  x: number,
  y: number,
  rotation: number   // 라디안 단위
}
```

---

## 🚀 성능 최적화

1. **useMemo**: 텍스처 및 재질 캐싱
2. **requestAnimationFrame**: 부드러운 애니메이션
3. **Canvas 재사용**: 동일 캔버스 재렌더링
4. **조건부 렌더링**: FPV 모드에서만 천장 표시

---

## 🐛 알려진 제한사항

1. **단일 파일 구조**: 약 2100줄의 코드가 하나의 파일에 집중
2. **복잡한 방 모양**: 현재는 사각형 방만 지원
3. **가구 충돌**: 가구끼리의 충돌 감지 미구현
4. **모바일 지원**: 터치 이벤트 미구현

---

## 📝 향후 개선 계획

1. **Phase 2: 조명 시스템** (implementation_plan.md 참조)
   - 천장 조명 (형광등, LED)
   - 스탠드 조명
   - 실시간 조명 효과

2. **Phase 3: 가전제품 추가**
   - 세탁기 (통돌이, 드럼)
   - 건조기

3. **코드 리팩토링** (선택사항)
   - 모듈화 (ES Modules)
   - 컴포넌트 분리
   - 타입스크립트 도입

---

## 📚 참고 자료

- [Three.js 공식 문서](https://threejs.org/docs/)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
