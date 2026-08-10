import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cities', path: '/cities' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Attractions', path: '/attractions' },
  { name: 'Restaurants', path: '/restaurants' },
  { name: 'AI Planner', path: '/ai/itinerary' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all ${scrolled ? 'shadow-md' : 'border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-teal-600">Smart Tourist Guide</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => link.name !== 'AI Planner' || user?.role === 'tourist')
              .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-teal-600'
                    : 'text-slate-700 hover:text-teal-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.first_name}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      My Profile
                    </Link>

                    {user?.role === 'hotel_manager' ? (
                      <>
                        <hr className="my-1 border-slate-200" />
                        <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase">Hotel Manager</div>
                        <Link
                          to="/hotel-manager"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/hotel-manager/hotels"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Hotels
                        </Link>
                        <Link
                          to="/hotel-manager/bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Bookings
                        </Link>
                      </>
                    ) : user?.role === 'driver' ? (
                      <>
                        <hr className="my-1 border-slate-200" />
                        <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase">Driver</div>
                        <Link
                          to="/driver"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/driver/vehicles"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Vehicles
                        </Link>
                        <Link
                          to="/driver/bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Bookings
                        </Link>
                      </>
                    ) : user?.role === 'administrator' ? (
                      <>
                        <hr className="my-1 border-slate-200" />
                        <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase">Admin</div>
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    ) : (
                      <>
                        <hr className="my-1 border-slate-200" />
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          to="/my-bookings/hotel"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Hotel Bookings
                        </Link>
                        <Link
                          to="/my-bookings/transport"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Transport Bookings
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Favorites
                        </Link>
                        <Link
                          to="/my-reviews"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Reviews
                        </Link>
                      </>
                    )}

                    <hr className="my-1 border-slate-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks
              .filter((link) => link.name !== 'AI Planner' || user?.role === 'tourist')
              .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-2 border-t border-slate-200 mt-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
