'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Point {
  x: number
  y: number
}

interface QuotableRegion {
  id: string
  title: string
  coordinates: { points: Point[] }
  approvalType: string
}

interface ContentDisplayProps {
  content: {
    id: string
    mediaUrl: string
    type: 'PHOTO' | 'VIDEO'
    caption?: string
    quotableRegions?: QuotableRegion[]
    user: {
      username: string
    }
  }
  isEditorial?: boolean
}

export default function ContentDisplay({ content, isEditorial = false }: ContentDisplayProps) {
  const [hoveredRegion, setHoveredRegion] = useState<QuotableRegion | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const img = containerRef.current.querySelector('img')
        if (img) {
          setDimensions({
            width: img.clientWidth,
            height: img.clientHeight,
          })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [content.mediaUrl])

  const handleRegionClick = (region: QuotableRegion, e: React.MouseEvent) => {
    e.stopPropagation()
    setHoveredRegion(region)
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }

  const handleRegionHover = (region: QuotableRegion | null, e?: React.MouseEvent) => {
    setHoveredRegion(region)
    if (e) {
      setTooltipPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const regions = content.quotableRegions || []

  return (
    <div className="relative">
      <div ref={containerRef} className="relative">
        {content.type === 'PHOTO' ? (
          <img
            src={content.mediaUrl}
            alt={content.caption || 'Content'}
            className="w-full rounded-lg"
            onLoad={() => {
              if (containerRef.current) {
                const img = containerRef.current.querySelector('img')
                if (img) {
                  setDimensions({
                    width: img.clientWidth,
                    height: img.clientHeight,
                  })
                }
              }
            }}
          />
        ) : (
          <video src={content.mediaUrl} controls className="w-full rounded-lg" />
        )}

        {dimensions.width > 0 && regions.length > 0 && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            {regions.map((region) => {
              const points = region.coordinates.points
              if (!points || points.length < 3) return null

              const pathData = points
                .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
                .join(' ') + ' Z'

              return (
                <g key={region.id}>
                  <path
                    d={pathData}
                    fill="rgba(0, 123, 255, 0.1)"
                    stroke="rgba(0, 123, 255, 0.4)"
                    strokeWidth="2"
                    className="transition-all duration-200 hover:fill-[rgba(0,123,255,0.2)] hover:stroke-[rgba(0,123,255,0.6)] cursor-pointer pointer-events-auto"
                    onMouseEnter={(e) => handleRegionHover(region, e as any)}
                    onMouseLeave={() => handleRegionHover(null)}
                    onClick={(e) => handleRegionClick(region, e as any)}
                  />
                </g>
              )
            })}
          </svg>
        )}
      </div>

      {content.caption && (
        <p className="mt-3 text-gray-900">
          <span className="font-semibold">@{content.user.username}</span> {content.caption}
        </p>
      )}

      {hoveredRegion && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl p-4 border border-gray-200 max-w-sm pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <h4 className="font-semibold text-gray-900 mb-1">{hoveredRegion.title}</h4>
          {isEditorial && (
            <p className="text-sm text-blue-600 hover:underline">
              View source content →
            </p>
          )}
        </div>
      )}
    </div>
  )
}
