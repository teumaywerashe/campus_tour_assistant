import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const storeContext = createContext();

export const ContextProvider = ({ children }) => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null
      ? JSON.parse(saved)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  
  // track which building (id) is currently selected for detail view
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const adminLogOut = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const adminLogin = async (data) => {
    try {
      const response = await axios.post(`${url}/api/user/login`, data);
      if (response.data.success) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token);
        toast.success("Logged in successfully!");
        navigate("/admin");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const getBuildings = async () => {
    try {
      const response = await axios.get(`${url}/api/building`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        setLocations(response.data.buildings);
      } else {
        toast.error(response.data.message || "Failed to fetch buildings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching buildings");
    }
  };
  useEffect(() => {
    getBuildings();
  }, []);
   useEffect(() => {
    console.log(locations);
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
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
