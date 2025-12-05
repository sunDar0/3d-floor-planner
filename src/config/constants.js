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

export const FURNITURE_CATEGORIES = {
    'sofa': {
        icon: '🛋️',
        label: '소파',
        items: [
            { id: 'sofa_2p', icon: '🛋️', label: '소파(2)' },
            { id: 'sofa_3p', icon: '🛋️', label: '소파(3)' },
        ]
    },
    'bed': {
        icon: '🛏️',
        label: '침대',
        items: [
            { id: 'bed_single', icon: '🛏️', label: '침대(S)' },
            { id: 'bed_queen', icon: '🛏️', label: '침대(Q)' },
            { id: 'bed_king', icon: '🛏️', label: '침대(K)' },
        ]
    },
    'storage': {
        icon: '📚',
        label: '수납',
        items: [
            { id: 'bookshelf_160', icon: '📚', label: '책장(150)' },
            { id: 'bookshelf_100', icon: '📚', label: '책장(80)' },
            { id: 'tv_stand', icon: '📺', label: 'TV장' },
            { id: 'wardrobe', icon: '🚪', label: '옷장' },
            { id: 'shoe_rack', icon: '👞', label: '신발장' },
        ]
    },
    'appliances': {
        icon: '🔌',
        label: '가전',
        items: [
            { id: 'fridge_double', icon: '🧊', label: '냉장고(양)' },
            { id: 'fridge_single', icon: '❄️', label: '냉장고(단)' },
            { id: 'washer_top', icon: '🧺', label: '통돌이' },
            { id: 'washer_front', icon: '🧼', label: '드럼세탁기' },
            { id: 'dryer', icon: '🔥', label: '건조기' },
            { id: 'wash_tower', icon: '🗼', label: '세탁건조기' },
        ]
    },
    'dining': {
        icon: '🍽️',
        label: '식탁',
        items: [
            { id: 'dining_table_4p', icon: '🍽️', label: '식탁(4인)' },
            { id: 'dining_table_6p', icon: '🍽️', label: '식탁(6인)' },
        ]
    },
    'lighting': {
        icon: '💡',
        label: '조명',
        items: [
            { id: 'light_floor_living', icon: '💡', label: '거실등(형)' },
            { id: 'light_floor_room', icon: '💡', label: '방등(형)' },
            { id: 'light_floor_kitchen', icon: '💡', label: '주방등(형)' },
            { id: 'light_led_living', icon: '✨', label: '거실등(LED)' },
            { id: 'light_led_room', icon: '✨', label: '방등(LED)' },
            { id: 'light_led_kitchen', icon: '✨', label: '주방등(LED)' },
        ]
    },
    'bathroom': {
        icon: '🛁',
        label: '욕실',
        items: [
            { id: 'bathtub', icon: '🛁', label: '욕조' },
            { id: 'washbasin', icon: '🚿', label: '세면대' },
            { id: 'toilet', icon: '🚽', label: '변기' },
        ]
    },
    'kitchen': {
        icon: '🍳',
        label: '주방',
        items: [
            { id: 'sink_unit', icon: '🚰', label: '싱크대' },
            { id: 'counter_unit', icon: '⬜', label: '조리대' },
            { id: 'stove_unit', icon: '🔥', label: '가스레인지' },
            { id: 'upper_cabinet', icon: '📦', label: '상부장' },
        ]
    },
    'desk': {
        icon: '🪑',
        label: '책상',
        isDirect: true, // 단일 아이템은 바로 선택되도록
        items: [
            { id: 'desk', icon: '🪑', label: '책상' },
        ]
    },
};

export const FURNITURE_TEMPLATES = {
    'desk': { label: '책상', width: 150, depth: 70, height: 75, color: 0x8b4513 },
    'sofa_2p': { label: '소파 2인', width: 160, depth: 80, height: 85, color: 0x9ca3af },
    'sofa_3p': { label: '소파 3인', width: 210, depth: 80, height: 85, color: 0x9ca3af },
    'bed_single': { label: '침대 S', width: 100, depth: 200, height: 50, color: 0xffffff },
    'bed_queen': { label: '침대 Q', width: 150, depth: 200, height: 50, color: 0xffffff },
    'bed_king': { label: '침대 K', width: 180, depth: 200, height: 50, color: 0xffffff },
    'bookshelf_160': { label: '책장 150', width: 150, depth: 30, height: 200, color: 0x8b4513 },
    'bookshelf_100': { label: '책장 80', width: 80, depth: 30, height: 200, color: 0x8b4513 },
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
    'shoe_rack': { label: '신발장', width: 80, depth: 40, height: 100, color: 0x8b4513 },
    // 욕실
    'bathtub': { label: '욕조', width: 150, depth: 70, height: 55, color: 0xffffff },
    'washbasin': { label: '세면대', width: 60, depth: 45, height: 85, color: 0xffffff },
    'toilet': { label: '변기', width: 40, depth: 65, height: 45, color: 0xffffff },
    // 주방
    'sink_unit': { label: '싱크대', width: 80, depth: 60, height: 85, color: 0xffffff },
    'counter_unit': { label: '조리대', width: 80, depth: 60, height: 85, color: 0xffffff },
    'stove_unit': { label: '가스레인지', width: 60, depth: 60, height: 85, color: 0x333333 },
    'upper_cabinet': { label: '상부장', width: 80, depth: 35, height: 70, color: 0xffffff },
};

// 벽지 재질 옵션
export const WALL_MATERIALS = [
    { id: 'white', label: '화이트', color: '#ffffff', pattern: 'solid' },
    { id: 'ivory', label: '아이보리', color: '#fffef0', pattern: 'solid' },
    { id: 'beige', label: '베이지', color: '#f5f5dc', pattern: 'solid' },
    { id: 'light_gray', label: '라이트 그레이', color: '#e0e0e0', pattern: 'solid' },
    { id: 'warm_gray', label: '웜 그레이', color: '#d4cfc9', pattern: 'solid' },
    { id: 'mint', label: '민트', color: '#e8f5e9', pattern: 'solid' },
    { id: 'sky_blue', label: '스카이 블루', color: '#e3f2fd', pattern: 'solid' },
    { id: 'lavender', label: '라벤더', color: '#f3e5f5', pattern: 'solid' },
    { id: 'stripe_gray', label: '스트라이프 그레이', color: '#f0f0f0', pattern: 'stripe', stripeColor: '#e0e0e0' },
    { id: 'stripe_beige', label: '스트라이프 베이지', color: '#faf8f5', pattern: 'stripe', stripeColor: '#ebe5d9' },
    { id: 'brick', label: '벽돌', color: '#c9785d', pattern: 'brick' },
    { id: 'concrete', label: '콘크리트', color: '#9e9e9e', pattern: 'concrete' },
];

// 바닥재 재질 옵션
export const FLOOR_MATERIALS = [
    { id: 'wood_oak', label: '오크 원목', color: '#deb887', pattern: 'wood', grainColor: '#c9a76a' },
    { id: 'wood_walnut', label: '월넛 원목', color: '#5d4037', pattern: 'wood', grainColor: '#4e342e' },
    { id: 'wood_maple', label: '메이플 원목', color: '#f5deb3', pattern: 'wood', grainColor: '#deb887' },
    { id: 'wood_cherry', label: '체리 원목', color: '#b5651d', pattern: 'wood', grainColor: '#8b4513' },
    { id: 'laminate_gray', label: '그레이 강마루', color: '#9e9e9e', pattern: 'wood', grainColor: '#757575' },
    { id: 'laminate_white', label: '화이트 강마루', color: '#f5f5f5', pattern: 'wood', grainColor: '#e0e0e0' },
    { id: 'tile_white', label: '화이트 타일', color: '#ffffff', pattern: 'tile', groutColor: '#e0e0e0' },
    { id: 'tile_gray', label: '그레이 타일', color: '#e0e0e0', pattern: 'tile', groutColor: '#bdbdbd' },
    { id: 'tile_beige', label: '베이지 타일', color: '#f5f5dc', pattern: 'tile', groutColor: '#d4c9a8' },
    { id: 'marble_white', label: '화이트 마블', color: '#fafafa', pattern: 'marble', veinColor: '#bdbdbd' },
    { id: 'marble_black', label: '블랙 마블', color: '#424242', pattern: 'marble', veinColor: '#757575' },
    { id: 'polished_concrete', label: '폴리싱 콘크리트', color: '#9e9e9e', pattern: 'concrete' },
];
