import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { AuthContextType } from '../types';

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Hook for consuming the context in components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const tokenTimerRef = useRef<number>(); // useRef to store the token expiration timer ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token && !isTokenExpired()) {
      startTokenTimer();
    } else {
      logout();
    }
  }, []);

  const login = (token: string) => {
    const tokenExpirationDate = new Date(
      new Date().getTime() + TOKEN_EXPIRATION_TIME
    ).toISOString();
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate);
    setIsAuthenticated(true);
    startTokenTimer();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    setIsAuthenticated(false);
    if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
  };

  const isTokenExpired = () => {
    const expirationDate = localStorage.getItem('tokenExpirationDate');
    return expirationDate && new Date(expirationDate) <= new Date();
  };

  const startTokenTimer = () => {
    const expirationDate = localStorage.getItem('tokenExpirationDate');
    const remainingTime = expirationDate
      ? new Date(expirationDate).getTime() - new Date().getTime()
      : 0;

    if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current); // Clear any existing timer

    if (remainingTime > 0) {
      tokenTimerRef.current = window.setTimeout(() => {
        refreshToken();
      }, remainingTime - 60000) as unknown as number; // Refresh 1 minute before expiration
    }
  };

  const refreshToken = () => {
    const tokenExpirationDate = new Date(
      new Date().getTime() + TOKEN_EXPIRATION_TIME
    ).toISOString();
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate);
    startTokenTimer(); // Restart the timer with the new expiration time
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
