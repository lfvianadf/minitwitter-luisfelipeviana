import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce', () => {
  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 300))
    expect(result.current).toBe('inicial')
  })

  it('não atualiza antes do delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'inicial' } }
    )

    rerender({ value: 'novo' })
    vi.advanceTimersByTime(100)

    expect(result.current).toBe('inicial')
    vi.useRealTimers()
  })

  it('atualiza após o delay completo', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'inicial' } }
    )

    rerender({ value: 'novo' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('novo')
    vi.useRealTimers()
  })

  it('cancela o timer anterior ao receber novo valor', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    vi.advanceTimersByTime(200)
    rerender({ value: 'c' })
    vi.advanceTimersByTime(200)

    // Ainda não passou 300ms desde o último valor
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('c')
    vi.useRealTimers()
  })
})
