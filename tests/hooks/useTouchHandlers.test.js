import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useTouchHandlers } from '../../src/hooks/useTouchHandlers.js';

describe('useTouchHandlers', () => {
  let mockCanvas;
  let canvasRef;

  beforeEach(() => {
    mockCanvas = document.createElement('div');
    canvasRef = { current: mockCanvas };
  });

  const dispatchTouch = (type, touches) => {
    const touchList = touches.map(t => ({ clientX: t.x, clientY: t.y }));
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'touches', { value: touchList });
    mockCanvas.dispatchEvent(event);
    return event;
  };

  const defaultProps = () => ({
    canvasRef,
    scale: 1,
    setScale: jest.fn(),
    pan: { x: 0, y: 0 },
    setPan: jest.fn(),
    setIsPanning: jest.fn()
  });

  test('returns isTwoFingerGesture function', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));
    expect(typeof result.current.isTwoFingerGesture).toBe('function');
  });

  test('isTwoFingerGesture returns false initially', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));
    expect(result.current.isTwoFingerGesture()).toBe(false);
  });

  test('two-finger touch start initializes pinch state', async () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]);
    });

    expect(props.setIsPanning).toHaveBeenCalledWith(true);
    expect(result.current.isTwoFingerGesture()).toBe(true);
  });

  test('single touch does not trigger two-finger gesture', async () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [{ x: 100, y: 100 }]);
    });

    expect(props.setIsPanning).not.toHaveBeenCalled();
    expect(result.current.isTwoFingerGesture()).toBe(false);
  });

  test('pinch zoom out (fingers apart) increases scale', async () => {
    const props = defaultProps();
    renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]);
    });

    await act(async () => {
      dispatchTouch('touchmove', [
        { x: 50, y: 50 },
        { x: 250, y: 250 }
      ]);
    });

    expect(props.setScale).toHaveBeenCalled();
    expect(props.setPan).toHaveBeenCalled();
    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeGreaterThan(1);
  });

  test('pinch zoom in (fingers closer) decreases scale', async () => {
    const props = defaultProps();
    renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [
        { x: 50, y: 50 },
        { x: 250, y: 250 }
      ]);
    });

    await act(async () => {
      dispatchTouch('touchmove', [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]);
    });

    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeLessThan(1);
  });

  test('touch end resets two-finger gesture state', async () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]);
    });

    expect(result.current.isTwoFingerGesture()).toBe(true);

    await act(async () => {
      dispatchTouch('touchend', []);
    });

    expect(result.current.isTwoFingerGesture()).toBe(false);
    expect(props.setIsPanning).toHaveBeenCalledWith(false);
  });

  test('scale is clamped between 0.1 and 5', async () => {
    const props = { ...defaultProps(), scale: 4.5 };
    props.canvasRef = canvasRef;
    renderHook(() => useTouchHandlers(props));

    await act(async () => {
      dispatchTouch('touchstart', [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]);
    });

    await act(async () => {
      dispatchTouch('touchmove', [
        { x: 0, y: 0 },
        { x: 1000, y: 1000 }
      ]);
    });

    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeLessThanOrEqual(5);
    expect(newScale).toBeGreaterThanOrEqual(0.1);
  });
});
