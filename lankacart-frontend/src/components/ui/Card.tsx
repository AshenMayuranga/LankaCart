import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  action?: ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ children, title, action, className, padding = true }: CardProps) {
  return (
    <div className={cn('card', padding && 'p-6', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
