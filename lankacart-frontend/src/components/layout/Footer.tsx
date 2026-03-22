import { Link } from 'react-router-dom'
import { Package, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Package className="h-4.5 w-4.5 text-white" size={18} />
              </div>
              <span className="font-bold text-white text-lg">LankaCart</span>
            </Link>
            <p className="text-sm text-brand-300 leading-relaxed">
              Sri Lanka's premier online marketplace. Quality products, trusted sellers, delivered to your door.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'New Arrivals', to: '/products' },
                { label: 'Best Sellers', to: '/products' },
                { label: 'Deals & Offers', to: '/products' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-brand-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/register' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Track Order', to: '/orders' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-brand-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-brand-300">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>No. 42, Galle Road,<br />Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-brand-300">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-brand-300">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@lankacart.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-400">© 2025 LankaCart (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-brand-400 hover:text-brand-200 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-brand-400 hover:text-brand-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
