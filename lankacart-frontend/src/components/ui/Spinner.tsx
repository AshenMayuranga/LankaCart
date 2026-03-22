import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
  label?: string
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }

export default function Spinner({ size = 'md', fullScreen, className, label }: SpinnerProps) {
  const icon = <Loader2 className={cn('animate-spin text-brand-600', sizeMap[size], className)} />

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50 gap-3">
        {icon}
        {label && <p className="text-sm text-gray-500">{label}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      {icon}
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
