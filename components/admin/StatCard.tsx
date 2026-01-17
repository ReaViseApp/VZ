interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  loading?: boolean
}

export default function StatCard({ title, value, icon, change, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-2">
              <span className={`
                inline-flex items-center text-sm font-medium
                ${change.type === 'increase' ? 'text-green-600' : ''}
                ${change.type === 'decrease' ? 'text-red-600' : ''}
                ${change.type === 'neutral' ? 'text-gray-600' : ''}
              `}>
                {change.type === 'increase' && '↑'}
                {change.type === 'decrease' && '↓'}
                {change.value}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0">
            <span className="text-3xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  )
}
