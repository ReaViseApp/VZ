'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/vizlet/ProductCard'
import ShopCard from '@/components/vizlet/ShopCard'
import SearchBar from '@/components/vizlet/SearchBar'
import type { VizLetProduct, VizLetShop } from '@/types/vizlet'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<{
    products: VizLetProduct[]
    shops: VizLetShop[]
  }>({ products: [], shops: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setIsLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/vizlet/search?q=${encodeURIComponent(query)}`)
        
        if (!res.ok) {
          throw new Error('Search failed')
        }

        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
          <SearchBar placeholder="Search products or shops..." />
        </div>

        {/* Query Display */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing results for: <span className="font-semibold">&quot;{query}&quot;</span>
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && query && (
          <>
            {/* Products */}
            {results.products.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Products ({results.products.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Shops */}
            {results.shops.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shops ({results.shops.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {results.products.length === 0 && results.shops.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </>
        )}

        {/* No Query State */}
        {!query && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Enter a search term to find products and shops</p>
          </div>
        )}
      </div>
    </div>
  )
}
