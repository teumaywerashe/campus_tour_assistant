import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Building2, MapPin, ArrowRight, ChevronDown, Compass, Users } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { storeContext } from '../context/StoreContext';

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : charIdx === current.length ? pause : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(false);
        setWordIdx((w) => (w + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Floating particle ────────────────────────────────────────────────────────
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

const PARTICLES = [
  { x: 10, y: 20, size: 6, delay: 0 },
  { x: 85, y: 15, size: 10, delay: 1 },
  { x: 25, y: 70, size: 4, delay: 2 },
  { x: 70, y: 60, size: 8, delay: 0.5 },
  { x: 50, y: 85, size: 5, delay: 1.5 },
  { x: 90, y: 75, size: 7, delay: 2.5 },
  { x: 5,  y: 50, size: 9, delay: 3 },
  { x: 60, y: 25, size: 4, delay: 0.8 },
];

// ── Stat badge ───────────────────────────────────────────────────────────────
function StatBadge({
  icon, value, label, delay, className,
}: {
  icon: React.ReactNode; value: string; label: string; delay: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className={`absolute backdrop-blur-xl bg-white/15 border border-white/25 rounded-2xl px-4 py-3 shadow-xl pointer-events-none ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-white/80">{icon}</div>
        <div>
          <div className="text-white font-black text-lg leading-none">{value}</div>
          <div className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { getBuildings, locations, url } = useContext(storeContext)!;
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const typeword = useTypewriter(['Buildings', 'Libraries', 'Labs', 'Sports Halls', 'Offices']);

  useEffect(() => { getBuildings(); }, [getBuildings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  const theme = {
    text: darkMode ? 'text-white' : 'text-slate-900',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-500',
    bg: darkMode ? 'bg-slate-950' : 'bg-slate-50',
    card: darkMode
      ? 'bg-slate-900/80 border-slate-700/60 hover:border-[#646cff]/50'
      : 'bg-white border-slate-200 hover:border-[#646cff]/40',
    sectionBg: darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative  h-screen min-h-[600px] max-h-[900px] overflow-hidden flex items-center justify-center">

        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/gate.jpg')", y: bgY }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-r from-[#646cff]/20 via-transparent to-cyan-500/10" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Floating stat badges */}
        <StatBadge
          icon={<Building2 size={18} />}
          value={`${locations.length || '15'}+`}
          label="Buildings"
          delay={1.2}
          className="top-[22%] left-[6%] hidden md:flex"
        />
        <StatBadge
          icon={<Users size={18} />}
          value="5K+"
          label="Students"
          delay={1.5}
          className="top-[30%] right-[6%] hidden md:flex"
        />
        <StatBadge
          icon={<Compass size={18} />}
          value="360°"
          label="Campus View"
          delay={1.8}
          className="bottom-[28%] left-[8%] hidden lg:flex"
        />

        {/* Hero content */}
        <motion.div
          style={{ y: contentY, opacity }}
          className="relative z-10 max-w-4xl w-full px-6 text-center"
        >
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">
              Addis Ababa University · 5 Kilo Campus
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4"
          >
            Explore Your
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#818cf8] to-cyan-400">
              Campus
            </span>
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-white/80 font-medium mb-10 h-8"
          >
            Find{' '}
            <span className="text-[#818cf8] font-bold">
              {typeword}
              <span className="animate-pulse">|</span>
            </span>
            {' '}instantly
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className={`flex items-center rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              searchFocused
                ? 'ring-2 ring-[#646cff] shadow-[#646cff]/30'
                : 'ring-1 ring-white/20'
            } bg-white/95 backdrop-blur-xl`}>
              <Search className="ml-5 h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search buildings, labs, offices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 px-4 py-4 md:py-5 text-base text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="m-1.5 px-5 py-3 bg-[#646cff] hover:bg-[#535bf2] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0"
              >
                <span className="hidden sm:inline">Search</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.form>

          {/* Quick action pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {['Academic', 'Libraries', 'Sports', 'Parking', 'Outdoor'].map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.07 }}
              >
                <Link
                  to={`/categories`}
                  onClick={() => {}}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-sm transition-all"
                >
                  {cat}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className={`border-b ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white'}`}>
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: `${locations.length || '15'}+`, label: 'Campus Buildings', icon: <Building2 size={20} className="text-[#646cff]" /> },
            { value: '5+',  label: 'Categories',        icon: <Globe size={20} className="text-cyan-500" /> },
            { value: '360°', label: 'Interactive Map',  icon: <Compass size={20} className="text-emerald-500" /> },
            { value: '5K+', label: 'Students Served',   icon: <Users size={20} className="text-amber-500" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>{stat.icon}</div>
              <div>
                <div className={`text-2xl font-black ${theme.text}`}>{stat.value}</div>
                <div className={`text-xs font-medium ${theme.textMuted}`}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── QUICK ACCESS CARDS ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[#646cff] text-xs font-bold uppercase tracking-widest mb-2">Get Started</p>
          <h2 className={`text-3xl md:text-4xl font-black ${theme.text}`}>What are you looking for?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              to: '/categories',
              icon: <Search className="h-8 w-8" />,
              iconBg: 'bg-[#646cff]/10 text-[#646cff]',
              title: 'Find Buildings',
              desc: 'Browse and locate specific facilities across campus.',
              cta: 'Browse all',
              accent: '#646cff',
            },
            {
              to: '/search',
              icon: <Globe className="h-8 w-8" />,
              iconBg: 'bg-cyan-500/10 text-cyan-500',
              title: 'Interactive Map',
              desc: 'Visualize the full campus layout with live navigation.',
              cta: 'Open map',
              accent: '#06b6d4',
            },
            {
              to: '/about',
              icon: <Building2 className="h-8 w-8" />,
              iconBg: 'bg-emerald-500/10 text-emerald-500',
              title: 'About Campus',
              desc: 'Learn about the 5 Kilo campus and its facilities.',
              cta: 'Learn more',
              accent: '#10b981',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={card.to}
                className={`group flex flex-col h-full p-8 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-xl ${theme.card}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.iconBg}`}>
                  {card.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>{card.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${theme.textMuted}`}>{card.desc}</p>
                <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: card.accent }}>
                  {card.cta}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED LOCATIONS ───────────────────────────────────────────── */}
      <section className={`py-20 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-[#646cff] text-xs font-bold uppercase tracking-widest mb-2">Explore</p>
              <h2 className={`text-3xl md:text-4xl font-black ${theme.text}`}>Featured Locations</h2>
            </div>
            <Link
              to="/categories"
              className={`hidden md:flex items-center gap-1.5 text-sm font-bold text-[#646cff] hover:gap-3 transition-all`}
            >
              View all <ArrowRight size={15} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {(locations.length > 0 ? locations.slice(0, 5) : Array(5).fill(null)).map((loc, i) => (
                <motion.div
                  key={loc?.id ?? i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link to={loc ? `/location/${loc.id}` : '/categories'}>
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 shadow-md">
                      {loc?.images ? (
                        <img
                          src={loc.images as string}
                          alt={loc.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} animate-pulse`} />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {loc && (
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                            {loc.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-1.5 px-1">
                      <MapPin size={12} className="text-[#646cff] mt-0.5 shrink-0" />
                      <p className={`text-sm font-semibold leading-tight ${theme.textMuted} group-hover:text-[#646cff] transition-colors`}>
                        {loc?.name ?? 'Loading...'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link to="/categories" className="px-6 py-2.5 bg-[#646cff] text-white rounded-full text-sm font-bold hover:bg-[#535bf2] transition-colors">
              See all locations
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative overflow-hidden rounded-3xl p-10 md:p-16 text-center border ${
            darkMode
              ? 'bg-linear-to-br from-[#646cff]/20 via-slate-900 to-cyan-500/10 border-[#646cff]/20'
              : 'bg-linear-to-br from-[#646cff]/5 via-white to-cyan-500/5 border-[#646cff]/15'
          }`}
        >
          {/* Background glow blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#646cff]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[#646cff] text-xs font-bold uppercase tracking-widest mb-3">Ready to explore?</p>
            <h2 className={`text-3xl md:text-5xl font-black mb-4 ${theme.text}`}>
              Navigate campus<br />like never before
            </h2>
            <p className={`text-base md:text-lg mb-8 max-w-xl mx-auto ${theme.textMuted}`}>
              Interactive maps, real-time directions, and detailed building info — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/search"
                className="px-8 py-4 bg-[#646cff] hover:bg-[#535bf2] text-white font-bold rounded-2xl transition-colors shadow-lg shadow-[#646cff]/25 flex items-center justify-center gap-2"
              >
                <Globe size={18} /> Open Map
              </Link>
              <Link
                to="/categories"
                className={`px-8 py-4 font-bold rounded-2xl transition-colors border flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'border-slate-700 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Buildings <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
