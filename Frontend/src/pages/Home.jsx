import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Globe, Info, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { storeContext } from "../context/StoreContext";

export default function Home() {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { getBuildings, locations, url } = useContext(storeContext);
  const navigate = useNavigate();

  useEffect(() => {
    getBuildings();
  }, [getBuildings]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  // Theme variable mapping for clean code
  const theme = {
    text: darkMode ? "text-white" : "text-slate-900",
    textMuted: darkMode ? "text-slate-400" : "text-slate-600",
    bg: darkMode ? "bg-slate-950" : "bg-gray-50",
    card: darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100",
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      
      {/* HERO SECTION */}
      <div 
        className="relative h-[60vh] min-h-[450px] flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/gate.jpg')" }} // Ensure this path is correct in your public folder
      >
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 max-w-4xl w-full">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-md">
            WELCOME TO OUR
          </h1>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-md">
            CAMPUS TOUR ASSISTANT
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
            Discover, Navigate, Explore.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input
              type="text"
              placeholder="Find buildings, services, or places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-full text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-slate-900 bg-white"
            />
          </form>
        </div>
      </div>

      {/* QUICK ACCESS SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h3 className={`text-xl font-bold mb-8 ${theme.text}`}>Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Find Buildings Card */}
          <Link to="/categories" className={`${theme.card} p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform border flex flex-col items-center text-center`}>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-4">
              <Search className="h-10 w-10 text-blue-500" />
            </div>
            <h4 className="text-xl font-bold mb-2">Find Buildings</h4>
            <p className={theme.textMuted}>Locate specific facilities</p>
          </Link>

          {/* Interactive Map Card */}
          <Link to="/search" className={`${theme.card} p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform border flex flex-col items-center text-center`}>
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl mb-4">
              <Globe className="h-10 w-10 text-cyan-500" />
            </div>
            <h4 className="text-xl font-bold mb-2">Interactive Map</h4>
            <p className={theme.textMuted}>Visualize campus layout</p>
          </Link>

          {/* About Card */}
          <Link to="/about" className={`${theme.card} p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform border flex flex-col items-center text-center`}>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl mb-4">
              <Building2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold mb-2">About Us</h4>
            <p className={theme.textMuted}>Our services</p>
          </Link>

        </div>
      </div>

      {/* EXPLORE FURTHER SECTION */}
      <div className="max-w-7xl mx-auto px-6 pb-20">

        {/* Dynamic Gallery from Store Context */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {locations.slice(0, 5).map((loc) => (
            <Link key={loc.id} to={`/location/${loc.id}`} className="group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-md">
                <img 
                  src={loc.images ? `${url}/uploads/buildings/${loc.images}` : '/placeholder.jpg'} 
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className={`text-center font-semibold text-sm ${theme.textMuted} group-hover:text-blue-500 transition-colors`}>
                {loc.name}
              </p>
            </Link>
          ))}

          {/* Fallback Static Cards if locations are empty */}
          {locations.length === 0 && ["Historic Quad", "Campus Library", "Student Center", "Sports Complex", "Science Labs"].map((item, i) => (
            <Link key={i} to="/categories" className="group">
              <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-3" />
              <p className={`text-center font-semibold text-sm ${theme.textMuted}`}>{item}</p>
            </Link>
          ))}
        </div>

        {/* Small See All button below the gallery */}
        <div className="mt-6 flex justify-center">
          <Link to="/categories" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:opacity-90">
            See all categories
          </Link>
        </div>
      </div>

    </div>
  );
}