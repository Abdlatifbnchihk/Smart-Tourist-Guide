import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-[40%] bg-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="moroccan-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M40 25L55 40L40 55L25 40Z" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M0 0L20 20M80 0L60 20M0 80L20 60M80 80L60 60" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#moroccan-pattern)"/>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Smart Tourist Guide
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join Our Travel Community
          </h1>
          <p className="text-white/80 text-center text-lg">
            Create an account to start exploring Morocco
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-teal-600">Smart Tourist Guide</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
