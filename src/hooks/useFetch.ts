import { useEffect, useState } from 'react'

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'x-vital-api-key': 'sk_eu_s8sLzZTGinYMP7yWnVQmtq_w-8K1oeLHDBjNi9fQeo0' // this would normally come from logged in user normally or accessed via server if sensitive key
  }
}

type ErrorType = {
  message: string
}

export default function useFetch<T>(url: string | null, dataRef?: string | null, fetchAll: boolean = false) {
  const [ data, setData ] = useState<T | null>(null)
  const [ error, setError ] = useState<string>('')
  const [ loading, setLoading ] = useState<boolean>(true)

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    const fetchTimout = setTimeout(() => controller.abort(), 3000) // add 3 second timeout for fetching
    const fetchData = async () => {      
      try {
        if (fetchAll) {
          let allData: T[] = []
          let page = 1
          let totalPages = 1
          while (page <= totalPages) {
            const response = await fetch(`/vital${url}&page=${page}`, {
               ...defaultOptions,
               signal: controller.signal
            })
            if (!response.ok) {
              throw new Error(`Failed to fetch data: Status: ${response.status}`)
            }
            const json = await response.json()
            totalPages = json.pages
            page += 1
            const respData = dataRef ? json[dataRef]: json
            allData = [...allData, ...respData]
          }
          setData(allData as unknown as T)
        } else {
          const response = await fetch(`/vital${url}`, { ...defaultOptions })
          if (!response.ok) {
            throw new Error('Failed to fetch data')
          }
          const json = await response.json()
          setData(dataRef ? json[dataRef]: json)
        }

        
      } catch (error) {
        setError((error as ErrorType).message)
      } finally {
        clearTimeout(fetchTimout)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      clearTimeout(fetchTimout)
      controller.abort()
    }
  }, [ url, dataRef, fetchAll ])

  return { data, error, loading }
}