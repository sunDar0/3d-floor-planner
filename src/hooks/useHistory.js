const { useState, useCallback } = React;

/**
 * Undo/Redo 기능을 제공하는 히스토리 관리 훅
 * 
 * @param {Object} initialState - 초기 상태
 * @returns {Object} { state, pushState, undo, redo, reset, canUndo, canRedo }
 */
export const useHistory = (initialState) => {
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 상태 변경 (새로운 기록 추가)
    const pushState = useCallback((newState) => {
        setHistory(prevHistory => {
            const upToCurrent = prevHistory.slice(0, currentIndex + 1);
            return [...upToCurrent, newState];
        });
        setCurrentIndex(prev => prev + 1);
    }, [currentIndex]);

    // 실행 취소
    const undo = useCallback(() => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    }, []);

    // 다시 실행
    const redo = useCallback(() => {
        setHistory(prevHistory => {
            setCurrentIndex(prev => Math.min(prevHistory.length - 1, prev + 1));
            return prevHistory;
        });
    }, []);

    // 초기화
    const reset = useCallback((newState) => {
        setHistory([newState]);
        setCurrentIndex(0);
    }, []);

    return {
        state: history[currentIndex],
        pushState,
        undo,
        redo,
        reset,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1
    };
};
