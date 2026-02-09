import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useTouchHandlers } from '../../src/hooks/useTouchHandlers.js';

describe('useTouchHandlers', () => {
  const createTouchEvent = (touches, type = 'touchstart') => ({
    touches: touches.map(t => ({ clientX: t.x, clientY: t.y })),
    preventDefault: jest.fn()
  });

  const defaultProps = () => ({
    scale: 1,
    setScale: jest.fn(),
    pan: { x: 0, y: 0 },
    setPan: jest.fn(),
    setIsPanning: jest.fn()
  });

  test('provides handler functions', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));
    expect(typeof result.current.handleTouchStart).toBe('function');
    expect(typeof result.current.handleTouchMove).toBe('function');
    expect(typeof result.current.handleTouchEnd).toBe('function');
    expect(typeof result.current.isTwoFingerGesture).toBe('function');
  });

  test('isTwoFingerGesture returns false initially', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));
    expect(result.current.isTwoFingerGesture()).toBe(false);
  });

  test('two-finger touch start initializes pinch state', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    const event = createTouchEvent([
      { x: 100, y: 100 },
      { x: 200, y: 200 }
    ]);

    act(() => {
      result.current.handleTouchStart(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.setIsPanning).toHaveBeenCalledWith(true);
    expect(result.current.isTwoFingerGesture()).toBe(true);
  });

  test('single touch does not trigger two-finger gesture', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    const event = createTouchEvent([{ x: 100, y: 100 }]);

    act(() => {
      result.current.handleTouchStart(event);
    });

    expect(props.setIsPanning).not.toHaveBeenCalled();
    expect(result.current.isTwoFingerGesture()).toBe(false);
  });

  test('pinch zoom changes scale via setScale', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    // Start two-finger touch
    const startEvent = createTouchEvent([
      { x: 100, y: 100 },
      { x: 200, y: 200 }
    ]);

    act(() => {
      result.current.handleTouchStart(startEvent);
    });

    // Move fingers apart (zoom in)
    const moveEvent = createTouchEvent([
      { x: 50, y: 50 },
      { x: 250, y: 250 }
    ], 'touchmove');

    act(() => {
      result.current.handleTouchMove(moveEvent);
    });

    expect(props.setScale).toHaveBeenCalled();
    expect(props.setPan).toHaveBeenCalled();

    // The new scale should be larger than initial (fingers moved apart)
    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeGreaterThan(1);
  });

  test('pinch zoom in reduces scale via setScale', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    // Start with fingers far apart
    const startEvent = createTouchEvent([
      { x: 50, y: 50 },
      { x: 250, y: 250 }
    ]);

    act(() => {
      result.current.handleTouchStart(startEvent);
    });

    // Move fingers closer (zoom out)
    const moveEvent = createTouchEvent([
      { x: 100, y: 100 },
      { x: 200, y: 200 }
    ], 'touchmove');

    act(() => {
      result.current.handleTouchMove(moveEvent);
    });

    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeLessThan(1);
  });

  test('touch end resets two-finger gesture state', () => {
    const props = defaultProps();
    const { result } = renderHook(() => useTouchHandlers(props));

    // Start two-finger touch
    act(() => {
      result.current.handleTouchStart(createTouchEvent([
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]));
    });

    expect(result.current.isTwoFingerGesture()).toBe(true);

    // End touch (all fingers lifted)
    act(() => {
      result.current.handleTouchEnd({ touches: [], preventDefault: jest.fn() });
    });

    expect(result.current.isTwoFingerGesture()).toBe(false);
    expect(props.setIsPanning).toHaveBeenCalledWith(false);
  });

  test('scale is clamped between 0.1 and 5', () => {
    const props = { ...defaultProps(), scale: 4.5 };
    const { result } = renderHook(() => useTouchHandlers(props));

    // Start pinch
    act(() => {
      result.current.handleTouchStart(createTouchEvent([
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]));
    });

    // Extreme zoom in (fingers very far apart)
    act(() => {
      result.current.handleTouchMove(createTouchEvent([
        { x: 0, y: 0 },
        { x: 1000, y: 1000 }
      ]));
    });

    const newScale = props.setScale.mock.calls[0][0];
    expect(newScale).toBeLessThanOrEqual(5);
    expect(newScale).toBeGreaterThanOrEqual(0.1);
  });
});
