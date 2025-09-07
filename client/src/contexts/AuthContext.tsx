// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { User, LoginRequest, RegisterRequest, AuthState, AuthStatus } from '../types/auth.types';

// Auth Context Type
interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
}

// Action Types
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        status: 'loading',
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        status: 'authenticated',
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        status: 'error',
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        status: 'unauthenticated',
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_LOADING' });
      
      try {
        const user = await authService.initialize();
        
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize authentication' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await authService.login(credentials);
    //   console.log("credentials:",credentials);
      if (response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<void> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await authService.register(userData);
    //   console.log("userData:", userData);
      if (response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await authService.refreshAccessToken();
      
      if (success) {
        // Get updated user data
        const user = await authService.getCurrentUser();
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return false;
    }
  };

  // Clear error function
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Context value
  const value: AuthContextType = {
    user: state.user,
    status: state.status,
    error: state.error,
    isLoading: state.status === 'loading',
    isAuthenticated: state.status === 'authenticated' && !!state.user,
    login,
    register,
    logout,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;