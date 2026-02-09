import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../../src/hooks/useHistory.js';

describe('useHistory', () => {
  test('returns initial state correctly', () => {
    const { result } = renderHook(() => useHistory({ value: 'initial' }));
    expect(result.current.state).toEqual({ value: 'initial' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  test('pushState adds to history and moves index forward', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  test('undo moves back to previous state', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toEqual({ value: 'a' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  test('redo moves forward after undo', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canRedo).toBe(false);
  });

  test('undo does not go below index 0', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toEqual({ value: 'a' });
    expect(result.current.canUndo).toBe(false);
  });

  test('redo does not go beyond last state', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canRedo).toBe(false);
  });

  test('pushState after undo truncates redo history', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    act(() => {
      result.current.pushState({ value: 'c' });
    });

    act(() => {
      result.current.undo();
    });

    // Now at 'b', redo would go to 'c'
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.pushState({ value: 'd' });
    });

    // 'c' should be truncated, now history is [a, b, d]
    expect(result.current.state).toEqual({ value: 'd' });
    expect(result.current.canRedo).toBe(false);
  });

  test('reset clears history with new state', () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    act(() => {
      result.current.pushState({ value: 'b' });
    });

    act(() => {
      result.current.pushState({ value: 'c' });
    });

    act(() => {
      result.current.reset({ value: 'fresh' });
    });

    expect(result.current.state).toEqual({ value: 'fresh' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  test('multiple undo/redo cycles work correctly', () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => { result.current.pushState(1); });
    act(() => { result.current.pushState(2); });
    act(() => { result.current.pushState(3); });

    expect(result.current.state).toBe(3);

    act(() => { result.current.undo(); });
    act(() => { result.current.undo(); });
    expect(result.current.state).toBe(1);

    act(() => { result.current.redo(); });
    expect(result.current.state).toBe(2);

    act(() => { result.current.redo(); });
    expect(result.current.state).toBe(3);
  });
});
