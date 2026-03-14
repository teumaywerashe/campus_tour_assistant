import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Car,
  TreePine,
  Dumbbell,
  GraduationCap,
  MapPin,
  ArrowUpRight,
  LayoutGrid
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { storeContext } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const categoryButtons = [
  { id: 'All', name: 'All', icon: LayoutGrid, accent: '#646cff' },
  { id: 'Academic', name: 'Academic', icon: GraduationCap, accent: '#ef4444' },
  { id: 'Libraries', name: 'Libraries', icon: BookOpen, accent: '#3b82f6' },
  { id: 'Sports', name: 'Sports', icon: Dumbbell, accent: '#22c55e' },
  { id: 'Outdoor', name: 'Outdoor', icon: TreePine, accent: '#10b981' },
  { id: 'Parking', name: 'Parking', icon: Car, accent: '#64748b' },
];

export default function Categories() {
  const { getBuildings, locations } = useContext(storeContext);
  const url = "http://localhost:3000";

  useEffect(() => {
    getBuildings();
  }, []);

  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('All');

  const filteredLocations = activeTab === 'All' 
    ? locations 
    : locations.filter(loc => loc.category === activeTab);

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* --- STICKY NAVIGATION --- */}
      <div className={`sticky top-0 z-50 w-full backdrop-blur-md border-b ${
        darkMode ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Scrollable Container */}
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar touch-pan-x">
            {categoryButtons.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all flex-shrink-0 ${
                    isActive ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabPill"
                      className={`absolute inset-0 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}
                    />
                  )}
                  <cat.icon size={16} className="relative z-10" style={{ color: isActive ? cat.accent : 'inherit' }} />
                  <span className="relative z-10 text-[10px] uppercase tracking-widest">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeTab}
          >
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{activeTab}</h1>
            <p className="text-sm opacity-50 mt-1 font-medium">
              {filteredLocations.length} locations found
            </p>
          </motion.div>
        </header>

        {/* --- RESPONSIVE GRID --- */}
        {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <AnimatePresence mode='popLayout'>
            {filteredLocations.map((location) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={location.id}
                className="w-full"
              >
                <Link to={`/search?q=${location.name}`} className="group block">
                  {/* Image wrapper with fixed aspect ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-200">
                    <img
                      src={`${url}/uploads/buildings/${location.images}`}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Visual cue for mobile (icon always visible) */}
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="mt-4 px-1">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-[#646cff] transition-colors">
                      {location.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        <MapPin size={12} className="text-[#646cff]" />
                        <span className="truncate max-w-[120px]">
                          {location.floorInfo?.depts?.[0] || 'Campus Area'}
                        </span>
                      </div>
                      
                      {activeTab === 'All' && (
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {location.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredLocations.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <LayoutGrid className="mx-auto mb-4" size={48} />
            <p className="text-sm font-bold uppercase tracking-widest">No entries found</p>
          </div>
        )}
      </main>
    </div>
  );
}