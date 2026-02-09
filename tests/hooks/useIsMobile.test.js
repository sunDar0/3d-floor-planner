import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../../src/hooks/useIsMobile.js';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
      configurable: true
    });
  });

  test('returns isMobile=true when window.innerWidth < 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      writable: true,
      configurable: true
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(true);
  });

  test('returns isMobile=false when window.innerWidth >= 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
      configurable: true
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(false);
  });

  test('returns isTouchDevice based on ontouchstart presence', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(typeof result.current.isTouchDevice).toBe('boolean');
  });

  test('updates isMobile on window resize', async () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
      configurable: true
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(false);

    await act(async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 500,
        writable: true,
        configurable: true
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isMobile).toBe(true);
  });

  test('returns object with isMobile and isTouchDevice', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toHaveProperty('isMobile');
    expect(result.current).toHaveProperty('isTouchDevice');
  });

  test('cleans up resize event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
