import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Lock, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { storeContext } from '../context/StoreContext';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(storeContext)!;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Map', path: '/search' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Feedback', path: '/feedback' },
  ];

  const adminLinks = [
    { name: 'Map', path: '/search' },
    { name: 'Categories', path: '/categories' },
    { name: 'Feedback Review', path: '/admin/feedback' },
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const linkClass = (path: string) =>
    `relative text-sm font-medium px-3 py-2.5 transition-all duration-300 ${
      location.pathname === path
        ? `${darkMode ? 'text-white' : 'text-slate-900'} after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#646cff] after:content-['']`
        : `${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'}`
    }`;

  return (
    <nav className={`sticky top-0 z-50 shadow-xl ${darkMode ? 'bg-slate-900 text-white border-b border-white/5' : 'bg-white text-slate-900 border-b border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 font-bold group">
          <img src="/src/images/logo.png" alt="AAU Logo" className="h-9 w-9 rounded-full" />
          <span className={`tracking-tight uppercase text-sm md:text-base px-3 py-2.5 transition-colors duration-300 ${darkMode ? 'text-white group-hover:text-[#646cff]' : 'text-slate-900 group-hover:text-[#646cff]'}`}>
            Addis Ababa University
          </span>
        </Link>
 <div className="hidden md:flex items-center space-x-6">
  {(isAuthenticated ? adminLinks : publicLinks).map((link) => (
            <Link key={link.path} to={link.path} className={linkClass(link.path)}>
              {link.name}
            </Link>
          ))}
</div>
        <div className="hidden md:flex items-center space-x-6">
        
          <button onClick={toggleDarkMode} className={`${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'} focus:outline-none`} aria-label="Toggle theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isAuthenticated && (
            <Link to="/login" className={linkClass('/login')}>
              <Lock size={16} className="inline mr-1" />
              Admin Login
            </Link>
          )}

          {isAuthenticated && (
            <button onClick={handleLogout} className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'} hover:text-[#646cff] transition-all duration-300 focus:outline-none`}>
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-current">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className={`md:hidden p-4 space-y-3 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
          {(isAuthenticated ? adminLinks : publicLinks).map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
              className={`block relative px-3 py-2.5 transition-all duration-300 ${location.pathname === link.path ? 'text-[#646cff]' : darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'}`}>
              {link.name}
            </Link>
          ))}
          <button onClick={toggleDarkMode} className={`flex items-center gap-2 ${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'}`} aria-label="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {!isAuthenticated ? (
            <Link to="/login" className={`${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'} block px-3 py-2.5`}>Admin Login</Link>
          ) : (
            <>
              <Link to="/admin" className={`${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'} block px-3 py-2.5`}>Admin</Link>
              <button onClick={handleLogout} className={`${darkMode ? 'text-white hover:text-[#646cff]' : 'text-slate-900 hover:text-[#646cff]'} block px-3 py-2.5`}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
