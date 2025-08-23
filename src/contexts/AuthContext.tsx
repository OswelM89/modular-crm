import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getCurrentProfile, Profile, Organization } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: (Profile & { organization: Organization }) | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<(Profile & { organization: Organization }) | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    try {
      if (user) {
        const profileData = await getCurrentProfile()
        if (profileData) {
          setProfile(profileData)
        } else {
          // If profile is null, user doesn't exist in database
          console.log('Profile not found, signing out user')
          await handleSignOut()
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // If any error occurs (including JWT errors), sign out
      await handleSignOut()
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        handleSignOut()
        return
      }
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setUser(session?.user ?? null)
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('User signed in, fetching profile...')
        await refreshProfile()
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Refresh profile when user changes
  useEffect(() => {
    if (user && !profile && !loading) {
      refreshProfile()
    }
  }, [user, loading])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    // Clear any remaining session data
    localStorage.removeItem('supabase.auth.token')
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}