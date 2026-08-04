import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center pl-4">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-4 text-slate-800 placeholder-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        className="px-8 py-4 m-1 bg-teal-700 text-white font-semibold rounded-md hover:bg-teal-800 transition-colors"
      >
        Search
      </button>
    </form>
  )
}