// 그리드 설정
export const GRID_SIZE = 1; // 1cm 단위 이동 (정밀함)
export const VISUAL_GRID_SIZE = 5; // 5cm 격자 표시

// 벽 설정
export const WALL_THICKNESS = 15; // 15cm 벽 두께
export const WALL_HEIGHT = 240; // 2.4m 벽 높이

// 오프닝 설정
export const DOOR_WIDTH = 90; // 90cm 문 폭
export const DOOR_HEIGHT = 210; // 2.1m 문 높이
export const WINDOW_WIDTH = 120; // 1.2m 창문 폭
export const WINDOW_HEIGHT = 120; // 1.2m 창문 높이
export const WINDOW_SILL = 90; // 창문 바닥에서 떨어진 높이 (90cm)
export const BALCONY_WIDTH = 240; // 2.4m 발코니 창
export const BALCONY_HEIGHT = 210; // 2.1m 발코니 높이

// 1인칭 시점 높이
export const HEIGHT_MALE = 180;
export const HEIGHT_FEMALE = 160;

// 도구 목록
export const TOOLS = [
    { id: 'select', icon: '👆', label: '선택' },
    { id: 'wall', icon: '🧱', label: '벽' },
    { id: 'room', icon: '⬛', label: '방(바닥)' },
    { id: 'door', icon: '🚪', label: '문' },
    { id: 'window', icon: '🪟', label: '창문' },
    { id: 'balcony', icon: '🪟🪟', label: '발코니' },
];

export const FURNITURE_TOOLS = [
    { id: 'desk', icon: '🪑', label: '책상' },
    { id: 'sofa_2p', icon: '🛋️', label: '소파(2)' },
    { id: 'sofa_3p', icon: '🛋️', label: '소파(3)' },
    { id: 'bed_single', icon: '🛏️', label: '침대(S)' },
    { id: 'bed_queen', icon: '🛏️', label: '침대(Q)' },
    { id: 'bed_king', icon: '🛏️', label: '침대(K)' },
    { id: 'bookshelf_160', icon: '📚', label: '책장(160)' },
    { id: 'bookshelf_100', icon: '📚', label: '책장(100)' },
    { id: 'fridge_double', icon: '🧊', label: '냉장고(양)' },
    { id: 'fridge_single', icon: '❄️', label: '냉장고(단)' },
    { id: 'dining_table_4p', icon: '🍽️', label: '식탁(4인)' },
    { id: 'dining_table_6p', icon: '🍽️', label: '식탁(6인)' },
    { id: 'tv_stand', icon: '📺', label: 'TV장' },
    { id: 'washer_top', icon: '🧺', label: '통돌이' },
    { id: 'washer_front', icon: '🧼', label: '드럼세탁기' },
    { id: 'dryer', icon: '🔥', label: '건조기' },
    { id: 'wash_tower', icon: '🗼', label: '세탁건조기' },
    { id: 'light_floor_living', icon: '💡', label: '거실등(형)' },
    { id: 'light_floor_room', icon: '💡', label: '방등(형)' },
    { id: 'light_floor_kitchen', icon: '💡', label: '주방등(형)' },
    { id: 'light_led_living', icon: '✨', label: '거실등(LED)' },
    { id: 'light_led_room', icon: '✨', label: '방등(LED)' },
    { id: 'light_led_kitchen', icon: '✨', label: '주방등(LED)' },
    { id: 'wardrobe', icon: '🚪', label: '옷장' },
    { id: 'shoe_rack', icon: '👞', label: '신발장' },
];

export const FURNITURE_TEMPLATES = {
    'desk': { label: '책상', width: 160, depth: 80, height: 75, color: 0x8b4513 },
    'sofa_2p': { label: '소파 2인', width: 160, depth: 80, height: 85, color: 0x9ca3af },
    'sofa_3p': { label: '소파 3인', width: 210, depth: 80, height: 85, color: 0x9ca3af },
    'bed_single': { label: '침대 S', width: 100, depth: 200, height: 50, color: 0xffffff },
    'bed_queen': { label: '침대 Q', width: 150, depth: 200, height: 50, color: 0xffffff },
    'bed_king': { label: '침대 K', width: 180, depth: 200, height: 50, color: 0xffffff },
    'bookshelf_160': { label: '책장 160', width: 160, depth: 30, height: 200, color: 0x8b4513 },
    'bookshelf_100': { label: '책장 100', width: 100, depth: 30, height: 200, color: 0x8b4513 },
    'fridge_double': { label: '냉장고(양문)', width: 95, depth: 90, height: 185, color: 0xe5e7eb },
    'fridge_single': { label: '냉장고(단문)', width: 60, depth: 70, height: 185, color: 0xe5e7eb },
    'dining_table_4p': { label: '식탁 4인', width: 120, depth: 80, height: 75, color: 0xd4a373 },
    'dining_table_6p': { label: '식탁 6인', width: 180, depth: 80, height: 75, color: 0xd4a373 },
    'tv_stand': { label: 'TV장', width: 180, depth: 40, height: 45, color: 0x8d6e63 },
    'washer_top': { label: '통돌이 세탁기', width: 65, depth: 70, height: 110, color: 0xe5e7eb },
    'washer_front': { label: '드럼 세탁기', width: 60, depth: 60, height: 85, color: 0xe5e7eb },
    'dryer': { label: '건조기', width: 60, depth: 60, height: 85, color: 0xe5e7eb },
    'wash_tower': { label: '세탁건조기', width: 60, depth: 60, height: 170, color: 0xe5e7eb },
    'light_floor_living': { label: '거실등(형광)', width: 100, depth: 60, height: 10, color: 0xffffff },
    'light_floor_room': { label: '방등(형광)', width: 50, depth: 50, height: 10, color: 0xffffff },
    'light_floor_kitchen': { label: '주방등(형광)', width: 80, depth: 20, height: 10, color: 0xffffff },
    'light_led_living': { label: '거실등(LED)', width: 100, depth: 60, height: 5, color: 0xffffff },
    'light_led_room': { label: '방등(LED)', width: 50, depth: 50, height: 5, color: 0xffffff },
    'light_led_kitchen': { label: '주방등(LED)', width: 80, depth: 20, height: 5, color: 0xffffff },
    'wardrobe': { label: '옷장', width: 90, depth: 60, height: 200, color: 0x8b4513 },
    'shoe_rack': { label: '신발장', width: 90, depth: 40, height: 100, color: 0x8b4513 },
};
