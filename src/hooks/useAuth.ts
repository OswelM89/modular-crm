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
    loading: true
  })

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setAuthState(prev => ({ ...prev, profile: null, loading: false }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error);
        // Si no existe el perfil, esperar a que el trigger lo cree
        if (error.code === 'PGRST116') {
          console.log('Profile not found, waiting for trigger to create it...');
          // Esperar un momento y reintentar
          setTimeout(() => {
            fetchProfile(userId);
          }, 2000);
          return;
        }
        setAuthState(prev => ({ ...prev, loading: false }));
      } else {
        console.log('Profile fetched successfully:', profile);
        setAuthState(prev => ({ ...prev, profile }))
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setAuthState(prev => ({ ...prev, loading: false }))
    } finally {
      // El loading se maneja en cada caso específico arriba
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