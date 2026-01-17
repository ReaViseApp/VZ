'use client'

import { useState, useEffect, useCallback } from 'react'
import type { VizLetProduct, VizLetShop } from '@/types/vizlet'

interface VizLetData {
  trendingProducts: VizLetProduct[]
  popularShops: VizLetShop[]
  isLoading: boolean
  error: string | null
}

/**
 * Custom hook to fetch and auto-refresh Viz.Let trending products and popular shops
 * Refreshes data every 60 seconds
 */
export function useVizLetData() {
  const [data, setData] = useState<VizLetData>({
    trendingProducts: [],
    popularShops: [],
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }))

      // Fetch trending products and popular shops in parallel
      const [productsRes, shopsRes] = await Promise.all([
        fetch('/api/vizlet/products/trending'),
        fetch('/api/vizlet/shops/popular'),
      ])

      if (!productsRes.ok || !shopsRes.ok) {
        throw new Error('Failed to fetch Viz.Let data')
      }

      const [productsData, shopsData] = await Promise.all([
        productsRes.json(),
        shopsRes.json(),
      ])

      setData({
        trendingProducts: productsData.products || [],
        popularShops: shopsData.shops || [],
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching Viz.Let data:', error)
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }))
    }
  }, [])

  useEffect(() => {
    // Fetch data immediately on mount
    fetchData()

    // Set up interval to refresh every 60 seconds (60000ms)
    const intervalId = setInterval(fetchData, 60000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [fetchData])

  return {
    ...data,
    refetch: fetchData,
  }
}
