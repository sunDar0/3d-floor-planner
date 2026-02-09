import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useHistory } from '../../src/hooks/useHistory.js';

describe('useHistory', () => {
  test('returns initial state correctly', () => {
    const { result } = renderHook(() => useHistory({ value: 'initial' }));
    expect(result.current.state).toEqual({ value: 'initial' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  test('pushState adds to history and moves index forward', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  test('undo moves back to previous state', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    await act(async () => {
      result.current.undo();
    });

    expect(result.current.state).toEqual({ value: 'a' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  test('redo moves forward after undo', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    await act(async () => {
      result.current.undo();
    });

    await act(async () => {
      result.current.redo();
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canRedo).toBe(false);
  });

  test('undo does not go below index 0', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.undo();
    });

    expect(result.current.state).toEqual({ value: 'a' });
    expect(result.current.canUndo).toBe(false);
  });

  test('redo does not go beyond last state', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    await act(async () => {
      result.current.redo();
    });

    expect(result.current.state).toEqual({ value: 'b' });
    expect(result.current.canRedo).toBe(false);
  });

  test('pushState after undo truncates redo history', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    await act(async () => {
      result.current.pushState({ value: 'c' });
    });

    await act(async () => {
      result.current.undo();
    });

    expect(result.current.canRedo).toBe(true);

    await act(async () => {
      result.current.pushState({ value: 'd' });
    });

    expect(result.current.state).toEqual({ value: 'd' });
    expect(result.current.canRedo).toBe(false);
  });

  test('reset clears history with new state', async () => {
    const { result } = renderHook(() => useHistory({ value: 'a' }));

    await act(async () => {
      result.current.pushState({ value: 'b' });
    });

    await act(async () => {
      result.current.pushState({ value: 'c' });
    });

    await act(async () => {
      result.current.reset({ value: 'fresh' });
    });

    expect(result.current.state).toEqual({ value: 'fresh' });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  test('multiple undo/redo cycles work correctly', async () => {
    const { result } = renderHook(() => useHistory(0));

    await act(async () => { result.current.pushState(1); });
    await act(async () => { result.current.pushState(2); });
    await act(async () => { result.current.pushState(3); });

    expect(result.current.state).toBe(3);

    await act(async () => { result.current.undo(); });
    await act(async () => { result.current.undo(); });
    expect(result.current.state).toBe(1);

    await act(async () => { result.current.redo(); });
    expect(result.current.state).toBe(2);

    await act(async () => { result.current.redo(); });
    expect(result.current.state).toBe(3);
  });
});
