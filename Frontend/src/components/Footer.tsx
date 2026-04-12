import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Map', path: '/search' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Campus', path: '/about' },
  ];

  const categoryLinks = [
    { name: 'Academic Buildings', path: '/search?category=Academic' },
    { name: 'Libraries & Study', path: '/search?category=Libraries' },
    { name: 'Sports Facilities', path: '/search?category=Sports' },
    { name: 'Outdoor Spaces', path: '/search?category=Outdoor' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className={darkMode ? 'bg-slate-900 text-slate-300' : 'bg-gray-50 text-slate-700'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-900/20">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">CampusTour</span>
            </Link>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Precision navigation for the 5 Kilo campus.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className={`group p-2.5 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} aria-label={social.label}>
                  <social.icon className="h-5 w-5 stroke-slate-200 transition-colors group-hover:stroke-[#646cff]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-bold mb-5 text-sm uppercase tracking-widest pl-4 ${darkMode ? 'text-white' : 'text-slate-700'}`}>Platform</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className={`${darkMode ? 'text-slate-300 hover:text-[#646cff]' : 'text-slate-600 hover:text-[#646cff]'} transition-all duration-200`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold mb-5 text-sm uppercase tracking-widest pl-4 ${darkMode ? 'text-white' : 'text-slate-700'}`}>Categories</h3>
            <ul className="space-y-3 text-sm">
              {categoryLinks.map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className={`${darkMode ? 'text-slate-300 hover:text-[#646cff]' : 'text-slate-600 hover:text-[#646cff]'} transition-all duration-200`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold mb-5 text-sm uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-700'}`}>Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-snug`}>5 Kilo Campus, AAiT<br />Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <a href="mailto:info@campustour.edu" className={`${darkMode ? 'text-slate-300 hover:text-primary-400' : 'text-slate-600 hover:text-primary-600'} transition-colors`}>info@campustour.edu</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>+251 900 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-3 pt-6 border-t ${darkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
          <p className={`${darkMode ? 'text-slate-500' : 'text-slate-600'} text-center`}>
            © {currentYear} Campus Tour Assistant. All rights reserved. Addis Ababa University.
          </p>
        </div>
      </div>
    </footer>
  );
}
