// src/contexts/AuthContext.tsx

// Fix React type imports for TypeScript
import * as React from 'react';
import { UserService } from '../services/ApiService';
import { User } from '../types/models';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();
        setUser(currentUser as User);
      } catch (_error) {
        setUser(null); // Only set null, do not pass error
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await UserService.login({ email, password }) as { user: User; token: string };
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (userData: Omit<User, 'id'>) => {
    const newUser = await UserService.register(userData);
    setUser(newUser as User);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};