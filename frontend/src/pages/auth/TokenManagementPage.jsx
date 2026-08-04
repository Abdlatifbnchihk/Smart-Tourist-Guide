import { useState, useEffect } from 'react'
import * as authService from '../../services/authService'
import InputField from '../../components/ui/InputField'
import Button from '../../components/ui/Button'

export default function TokenManagementPage() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTokenName, setNewTokenName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdToken, setCreatedToken] = useState('')
  const [error, setError] = useState('')
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false)

  useEffect(() => {
    loadTokens()
  }, [])

  async function loadTokens() {
    try {
      const data = await authService.getTokens()
      setTokens(data.data || data || [])
    } catch {
      setTokens([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTokenName.trim()) return
    setCreating(true)
    setError('')
    try {
      const data = await authService.createToken(newTokenName)
      setCreatedToken(data.plainTextToken || data.token || data)
      setNewTokenName('')
      await loadTokens()
    } catch (err) {
      setError(err.message || 'Failed to create token')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this token?')) return
    try {
      await authService.revokeToken(id)
      setTokens((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to revoke token')
    }
  }

  const handleRevokeAll = async () => {
    try {
      await authService.revokeAllTokens()
      setTokens([])
      setConfirmRevokeAll(false)
    } catch (err) {
      setError(err.message || 'Failed to revoke tokens')
    }
  }

  const copyToken = () => {
    if (createdToken) navigator.clipboard.writeText(createdToken)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          API Tokens
        </h1>
        {tokens.length > 0 && (
          <button onClick={() => setConfirmRevokeAll(true)} className="text-sm text-red-600 hover:text-red-700 font-medium">
            Revoke All Tokens
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Token</h3>
        <form onSubmit={handleCreate} className="flex gap-3">
          <div className="flex-1">
            <InputField name="token_name" placeholder="Token name (e.g. Mobile App)" value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} />
          </div>
          <Button type="submit" loading={creating} className="w-auto px-6">Create Token</Button>
        </form>
        {createdToken && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 mb-2 font-medium">Token created! Copy it now, it won't be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white border border-green-300 rounded text-sm text-slate-800 break-all">{createdToken}</code>
              <button onClick={copyToken} className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors">Copy</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Tokens</h3>
        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <p className="text-slate-500">No API tokens yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{token.name}</p>
                  <p className="text-sm text-slate-500">Created: {new Date(token.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleRevoke(token.id)} className="text-sm text-red-600 hover:text-red-700 font-medium">Revoke</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmRevokeAll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Revoke All Tokens?</h3>
            <p className="text-slate-600 mb-4">This will remove all your API tokens. You'll need to create new ones.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmRevokeAll(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleRevokeAll} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
