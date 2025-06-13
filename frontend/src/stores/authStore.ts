import { DefaultService, type User } from '@/api/generated'
import { setAuthorizationHeader } from '@/services/api';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const loginHelper = async (token: string) => {
  try {
    localStorage.setItem('session_token', token);
    setAuthorizationHeader();
    const user = await DefaultService.getCurrentUserInfoAuthMeGet();
    return { user, isAuthenticated: true, isAuthPopupOpen: false, sessionToken: token }
  } catch {
    return { user: null, isAuthenticated: false, isAuthPopupOpen: true, sessionToken: token }
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthPopupOpen: boolean
  sessionToken: string | null
  authError: string | null
  
  initLogin: () => void
  login: (token: string) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAuthPopupOpen: false,
      sessionToken: null,

      login: async (token) => {
        set(await loginHelper(token))
      },

      initLogin: async () => {
        set({ isLoading: true })
        try {
        const token = localStorage.getItem('session_token')
        if (token) {
          set(await loginHelper(token))
          } else {
            set({ isAuthPopupOpen: true })
          }
        } catch {
          set({ authError: 'Invalid session token' })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('session_token')
        set({ 
          user: null, 
          isAuthenticated: false,
          sessionToken: null,
        })
      },
    }),
    {
      name: 'auth-store',
    }
  )
) 