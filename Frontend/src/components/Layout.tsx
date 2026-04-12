import { ReactNode } from 'react';
import Navbar from './navBar';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  setIsAuthenticated?: (val: boolean) => void;
  userRole?: string;
}

export default function Layout({ children }: LayoutProps) {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />
        <main className="flex-grow min-h-0">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
