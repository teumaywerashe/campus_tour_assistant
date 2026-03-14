import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import { ContextProvider } from "./context/StoreContext.jsx"; 
import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';

// --- ScrollToTop Helper ---
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
// --------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop /> {/* This will now reset scroll every time the path changes */}
      <ThemeProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);