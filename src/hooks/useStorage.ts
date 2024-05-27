import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [ storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (e) {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (e) {
      console.error(e)
    }
  }, [ key, storedValue ])

  const setValue = (value: T | ((val: T) => T) ) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    } catch (e) {
      console.error(e)
    }
  }

  return [ storedValue, setValue ]
}