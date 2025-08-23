import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  first_name: string
  last_name: string
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
  organization_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: false // Empezar sin loading
  })

  // Cache del perfil en localStorage
  const getCachedProfile = (userId: string): Profile | null => {
    try {
      const cached = localStorage.getItem(`profile_${userId}`)
      if (cached) {
        const profile = JSON.parse(cached)
        // Verificar que no sea muy viejo (5 minutos)
        const cacheTime = localStorage.getItem(`profile_${userId}_time`)
        if (cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
          return profile
        }
      }
    } catch (error) {
      console.error('Error reading cached profile:', error)
    }
    return null
  }

  const setCachedProfile = (userId: string, profile: Profile) => {
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile))
      localStorage.setItem(`profile_${userId}_time`, Date.now().toString())
    } catch (error) {
      console.error('Error caching profile:', error)
    }
  }
  useEffect(() => {
    let mounted = true
    
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      
      const user = session?.user ?? null
      setAuthState(prev => ({ ...prev, session, user, loading: !!user }))
      
      if (user) {
        // Intentar usar cache primero
        const cachedProfile = getCachedProfile(user.id)
        if (cachedProfile) {
          setAuthState(prev => ({ ...prev, profile: cachedProfile, loading: false }))
          // Actualizar en background
          fetchProfile(user.id, true)
        } else {
          fetchProfile(user.id)
        }
      } else {
        setAuthState(prev => ({ ...prev, profile: null, loading: false }))
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        const user = session?.user ?? null
        setAuthState(prev => ({ ...prev, session, user, loading: !!user }))
        
        if (user) {
          // Para login, usar cache si está disponible
          if (event === 'SIGNED_IN') {
            const cachedProfile = getCachedProfile(user.id)
            if (cachedProfile) {
              setAuthState(prev => ({ ...prev, profile: cachedProfile, loading: false }))
              fetchProfile(user.id, true) // Actualizar en background
              return
            }
          }
          await fetchProfile(user.id)
        } else {
          // Limpiar cache al hacer logout
          try {
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('profile_')) {
                localStorage.removeItem(key)
              }
            })
          } catch (error) {
            console.error('Error clearing profile cache:', error)
          }
          setAuthState(prev => ({ ...prev, profile: null, loading: false }))
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string, isBackground = false) => {
    try {
      if (!isBackground) {
        console.log('Fetching profile for user:', userId)
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (!isBackground) {
          console.error('Error fetching profile:', error)
        }
        // Si no existe el perfil, esperar a que el trigger lo cree
        if (error.code === 'PGRST116') {
          if (!isBackground) {
            console.log('Profile not found, waiting for trigger to create it...')
            // Esperar un momento y reintentar solo si no es background
            setTimeout(() => {
              fetchProfile(userId)
            }, 1000) // Reducido de 2000 a 1000ms
          }
          return
        }
        if (!isBackground) {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } else {
        if (!isBackground) {
          console.log('Profile fetched successfully:', profile)
        }
        // Guardar en cache
        setCachedProfile(userId, profile)
        setAuthState(prev => ({ ...prev, profile, loading: false }))
      }
    } catch (error) {
      if (!isBackground) {
        console.error('Unexpected error fetching profile:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authState.user.id)
      .select()
      .single()

    if (!error && data) {
      setAuthState(prev => ({ ...prev, profile: data }))
    }

    return { data, error }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  }
}