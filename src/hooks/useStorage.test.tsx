import { createRoot, Root } from 'react-dom/client'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useStorage'

describe('useLocalStorage', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    localStorage.clear()
  })

  afterEach(() => {
    if (container && root) {
      act(() => {
        root!.unmount()
      })
      container.remove()
    }
    container = null
    root = null
  })

  it('should initialize with the provided initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should update the localStorage value when setStoredValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    expect(result.current[0]).toBe('new value')
    expect(localStorage.getItem('test')).toBe(JSON.stringify('new value'))
  })

  it('should retrieve the value from localStorage on initialization', () => {
    localStorage.setItem('test', JSON.stringify('stored value'))

    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    expect(result.current[0]).toBe('stored value')
  })
})
