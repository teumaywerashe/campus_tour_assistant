import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Clock, BookOpen, Dumbbell, UtensilsCrossed, Home, Stethoscope, Car, Trees } from 'lucide-react';
import { useContext, useEffect, useMemo } from 'react';
import { storeContext } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Libraries: BookOpen,
  Academic: Building2,
  Sports: Dumbbell,
  Dining: UtensilsCrossed,
  Housing: Home,
  Health: Stethoscope,
  Parking: Car,
  Outdoor: Trees,
};

export default function BuildingDetails() {
  const { getBuildings, locations, url } = useContext(storeContext)!;
  const { darkMode } = useTheme();
  const { id } = useParams<{ id: string }>();

  useEffect(() => { getBuildings(); }, [getBuildings]);

  const location = useMemo(() => locations.find((loc) => String(loc.id) === id), [locations, id]);

  if (!location) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-black'}`}>
        <div className="text-center p-6">
          <h1 className="text-3xl font-bold mb-4">Building Not Found</h1>
          <Link to="/search" className="inline-flex items-center text-blue-500 hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[location.category] || Building2;

  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-gray-50',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    textPrimary: darkMode ? 'text-white' : 'text-black',
    textSecondary: darkMode ? 'text-slate-400' : 'text-gray-600',
    tagBg: darkMode ? 'bg-slate-800 text-slate-200' : 'bg-gray-200 text-gray-800',
    accent: darkMode ? 'text-blue-400' : 'text-blue-600',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.textPrimary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <header className="mb-8">
          <Link to="/search" className={`inline-flex items-center mb-4 transition-transform hover:-translate-x-1 ${theme.accent}`}>
            <ArrowLeft className="h-5 w-5 mr-2" /><span className="font-medium">Back to Map</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Building Details</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-transparent dark:border-slate-800">
              <img src={location.images as string} alt={location.name} className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${theme.tagBg}`}>{location.category}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm ${theme.card}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <Icon className={`h-8 w-8 ${theme.accent}`} />
                </div>
                <h2 className="text-2xl font-bold leading-tight">{location.name}</h2>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className={`h-5 w-5 mt-0.5 shrink-0 ${theme.accent}`} />
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>Location</p>
                    <p className="font-medium">{location.location || 'Main Campus'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className={`h-5 w-5 mt-0.5 shrink-0 ${theme.accent}`} />
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>Operations</p>
                    <p className="font-medium">{location.hours || 'Hours not listed'}</p>
                  </div>
                </div>
              </div>

              <div className={`pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                <h3 className="text-sm font-bold mb-3 uppercase tracking-widest">About</h3>
                <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{location.description}</p>
              </div>

              {location.tags && location.tags.length > 0 && (
                <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                  <h3 className="text-sm font-bold mb-4 uppercase tracking-widest">Available Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {location.tags.map((tag, index) => (
                      <span key={index} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${theme.tagBg} hover:opacity-80`}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
