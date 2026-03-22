import { Link, useNavigate } from 'react-router-dom'
import { MapPin, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <MapPin className="h-16 w-16 text-gray-200" />
        </div>
        <h1 className="text-7xl font-black text-gray-100 mb-2 leading-none">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
