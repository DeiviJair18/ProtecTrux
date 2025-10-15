import { auth } from '@/firebase.config';
import { AuthService } from '@/services/auth.service';
import { FirestoreService } from '@/services/firestore.service';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User, UserRole } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Inicialmente en loading para verificar estado
  error: null,
};

// Acciones del reducer
type AuthAction =
  | { type: 'INITIALIZE' }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isLoading: false,
      };
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
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
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar estado de autenticación con Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const userData = await FirestoreService.getUserByEmail(firebaseUser.email!);
          if (userData) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
          } else {
            // Si no existe en Firestore, cerrar sesión
            await signOut(auth);
            dispatch({ type: 'INITIALIZE' });
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          dispatch({ type: 'INITIALIZE' });
        }
      } else {
        dispatch({ type: 'INITIALIZE' });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      // Obtener datos del usuario desde Firestore
      const userData = await FirestoreService.getUserByEmail(credentials.email);
      
      if (!userData) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      if (!userData.isActive) {
        throw new Error('Usuario inactivo. Contacte al administrador.');
      }

      // Guardar token en AsyncStorage para persistencia
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión. Verifique sus credenciales.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: errorMessage 
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userToken');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así, limpiar el estado local
      dispatch({ type: 'LOGOUT' });
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Crear usuario usando AuthService
      const newUser = await AuthService.registerUser(
        credentials.email,
        credentials.password,
        {
          name: credentials.name,
          lastName: credentials.lastName,
          phoneNumber: credentials.phoneNumber,
          role: UserRole.CITIZEN, // Por defecto, los nuevos usuarios son ciudadanos
          isActive: true
        }
      );

      // Guardar token en AsyncStorage para persistencia
      if (auth.currentUser) {
        await AsyncStorage.setItem('userToken', auth.currentUser.uid);
      }
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
    } catch (error: any) {
      let errorMessage = 'Error al registrar usuario. Intente nuevamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Use al menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ 
        type: 'REGISTER_ERROR', 
        payload: errorMessage 
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
