/**
 * 모바일 환경 감지 훅
 * - window.innerWidth < 768 또는 터치 지원 여부 감지
 * - 리사이즈 이벤트 리스닝으로 동적 업데이트
 */
const { useState, useEffect, useCallback } = React;

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        return window.innerWidth < 768;
    });

    const [isTouchDevice] = useState(() => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isMobile, isTouchDevice };
};
