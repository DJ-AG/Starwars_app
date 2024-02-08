import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { AuthContextType } from '../types';

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000;

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      // Check if the token is expired on app start
      if (isTokenExpired()) {
        logout();
      } else {
        startTokenTimer();
      }
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
    if (tokenTimer) clearTimeout(tokenTimer); // Here, clearTimeout expects a number
  };

  // Function to check if the token is expired
  const isTokenExpired = () => {
    const expirationDate = localStorage.getItem('tokenExpirationDate');
    return expirationDate && new Date(expirationDate) <= new Date();
  };

  // Function to start a timer that will check for token expiration
  let tokenTimer: number;
  const startTokenTimer = () => {
    // Calculate the remaining time until the token expires
    const expirationDate = localStorage.getItem('tokenExpirationDate');
    const remainingTime = expirationDate
      ? new Date(expirationDate).getTime() - new Date().getTime()
      : 0;
    if (remainingTime > 0) {
      // Cast the return value of setTimeout to `number`
      tokenTimer = setTimeout(
        refreshToken,
        remainingTime - 60000
      ) as unknown as number;
    }

    // Set a timer to refresh the token a bit before it expires
    if (remainingTime > 0) {
      tokenTimer = setTimeout(refreshToken, remainingTime - 60000); // Refresh 1 minute before expiration
    }
  };

  // Function to refresh the token
  const refreshToken = () => {
    // Since this is a mock, simply reset the token expiration time
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
