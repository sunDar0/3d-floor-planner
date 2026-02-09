/**
 * 터치 이벤트 관리 훅
 * - 1 finger: 그리기 (마우스 클릭+드래그와 동일)
 * - 2 finger pinch: 줌
 * - 2 finger pan: 이동
 */
const { useRef, useCallback, useEffect } = React;

export const useTouchHandlers = ({ canvasRef, scale, setScale, pan, setPan, setIsPanning }) => {
    const touchStateRef = useRef({
        activeTouches: [],
        initialPinchDist: null,
        initialScale: 1,
        initialPan: { x: 0, y: 0 },
        initialMidpoint: null,
        isTwoFingerGesture: false
    });

    const getTouchDistance = (t1, t2) => {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchMidpoint = (t1, t2) => ({
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
    });

    const handleTouchStart = useCallback((e) => {
        const touches = e.touches;
        touchStateRef.current.activeTouches = Array.from(touches);

        if (touches.length === 2) {
            e.preventDefault();
            touchStateRef.current.isTwoFingerGesture = true;
            touchStateRef.current.initialPinchDist = getTouchDistance(touches[0], touches[1]);
            touchStateRef.current.initialScale = scale;
            touchStateRef.current.initialPan = { ...pan };
            touchStateRef.current.initialMidpoint = getTouchMidpoint(touches[0], touches[1]);
            setIsPanning(true);
        }
    }, [scale, pan, setIsPanning]);

    const handleTouchMove = useCallback((e) => {
        const touches = e.touches;
        const ts = touchStateRef.current;

        if (touches.length === 2 && ts.initialPinchDist) {
            e.preventDefault();

            const currentDist = getTouchDistance(touches[0], touches[1]);
            const currentMidpoint = getTouchMidpoint(touches[0], touches[1]);

            // Pinch zoom
            const zoomRatio = currentDist / ts.initialPinchDist;
            const newScale = Math.min(Math.max(0.1, ts.initialScale * zoomRatio), 5);

            // Pan (2-finger drag)
            const dx = currentMidpoint.x - ts.initialMidpoint.x;
            const dy = currentMidpoint.y - ts.initialMidpoint.y;

            // Adjust pan for zoom around midpoint
            const scaleChange = newScale / ts.initialScale;
            const newPanX = ts.initialPan.x + dx - (currentMidpoint.x - ts.initialPan.x) * (scaleChange - 1);
            const newPanY = ts.initialPan.y + dy - (currentMidpoint.y - ts.initialPan.y) * (scaleChange - 1);

            setScale(newScale);
            setPan({ x: newPanX, y: newPanY });
        }
    }, [setScale, setPan]);

    const handleTouchEnd = useCallback((e) => {
        const ts = touchStateRef.current;
        if (e.touches.length < 2) {
            ts.initialPinchDist = null;
            ts.initialMidpoint = null;
            if (ts.isTwoFingerGesture) {
                ts.isTwoFingerGesture = false;
                setIsPanning(false);
            }
        }
        ts.activeTouches = Array.from(e.touches);
    }, [setIsPanning]);

    const isTwoFingerGesture = () => touchStateRef.current.isTwoFingerGesture;

    useEffect(() => {
        const el = canvasRef?.current;
        if (!el) return;
        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd);
        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        isTwoFingerGesture
    };
};
