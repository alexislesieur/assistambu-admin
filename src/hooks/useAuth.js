import { useState, useEffect, useCallback } from 'react'
import { authApi } from '../lib/api'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = import.meta.env.VITE_AUTH_URL || 'https://auth.assist-ambu.fr/login'
      return
    }

    try {
      const data = await authApi.me()
      if (data.role !== 'admin') {
        localStorage.removeItem('token')
        window.location.href = import.meta.env.VITE_AUTH_URL || 'https://auth.assist-ambu.fr/login'
        return
      }
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      window.location.href = import.meta.env.VITE_AUTH_URL || 'https://auth.assist-ambu.fr/login'
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Récupère le token depuis l'URL si présent (redirect depuis auth)
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      window.history.replaceState({}, '', window.location.pathname)
      fetchUser()
    } else if (!localStorage.getItem('token')) {
      // Pas de token — redirect immédiat vers auth
      window.location.href = import.meta.env.VITE_AUTH_URL || 'https://auth.assist-ambu.fr/login'
    } else {
      fetchUser()
    }
  }, [fetchUser])

  const logout = async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('token')
    window.location.href = import.meta.env.VITE_AUTH_URL || 'https://auth.assist-ambu.fr/login'
  }

  return { user, loading, logout }
}