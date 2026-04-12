import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Building {
  id: number | string;
  name: string;
  category: string;
  images?: string;
  lat?: number | string;
  lng?: number | string;
  nearestNode?: string | string[];
  floorinfo?: { floors?: number; rooms?: number; depts?: string[] };
  description?: string;
  hours?: string;
  location?: string;
  tags?: string[];
  rating?: number;
  [key: string]: unknown;
}

interface StoreContextType {
  token: string | null;
  url: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  adminLogin: (data: { email: string; password: string }) => Promise<void>;
  adminLogOut: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  setToken: (token: string | null) => void;
  getBuildings: () => Promise<void>;
  locations: Building[];
  selectedBuildingId: number | string | null;
  setSelectedBuildingId: (id: number | string | null) => void;
}

export const storeContext = createContext<StoreContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Building[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | string | null>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const adminLogOut = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  const adminLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${url}/api/user/login`, data);
      if (response.data.success) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in successfully!');
        navigate('/admin');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const getBuildings = async () => {
    try {
      const response = await axios.get(`${url}/api/building`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setLocations(response.data.buildings);
      } else {
        toast.error(response.data.message || 'Failed to fetch buildings');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching buildings');
    }
  };

  useEffect(() => {
    getBuildings();
  }, []);

  return (
    <storeContext.Provider
      value={{
        token,
        url,
        isAuthenticated,
        setIsAuthenticated,
        adminLogin,
        adminLogOut,
        darkMode,
        toggleDarkMode,
        setToken,
        getBuildings,
        locations,
        selectedBuildingId,
        setSelectedBuildingId,
      }}
    >
      {children}
    </storeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(storeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
