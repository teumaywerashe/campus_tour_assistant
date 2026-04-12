import { useTheme } from '../context/ThemeContext';

interface WalkingInfo {
  distance: string;
  duration: string;
}

interface FloorInfo {
  floors?: number;
  rooms?: number;
  depts?: string[];
}

interface BuildingPanelData {
  id: number | string;
  name: string;
  category: string;
  description?: string;
  images?: string[] | string;
  hours?: string;
  rating?: number;
  tags?: string[];
  floorInfo?: FloorInfo;
  walking?: WalkingInfo;
  loading?: boolean;
}

interface BuildingDetailsPanelProps {
  building: BuildingPanelData | null;
  onViewDetail?: (building: BuildingPanelData) => void;
}

function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export default function BuildingDetailsPanel({ building, onViewDetail }: BuildingDetailsPanelProps) {
  const { darkMode } = useTheme();

  if (!building) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-gray-50 text-gray-500'}`}>
        <div className={`w-16 h-16 ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'} rounded-full flex items-center justify-center mb-4`}>
          <LocationIcon />
        </div>
        <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>No Building Selected</h3>
        <p className="text-sm mt-2">Pick a destination on the map to see route info and building specifics.</p>
      </div>
    );
  }

  const images = Array.isArray(building.images) ? building.images : (building.images ? [building.images] : []);
  const floor = building.floorInfo;
  const displayItems = floor?.depts || building.tags || [];

  return (
    <div className={`h-full flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <br />
      <div className={`p-6 border-b sticky top-0 backdrop-blur-md z-10 ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-100'}`}>
        <div className="flex justify-between items-start">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
            {escapeHtml(building.category)}
          </span>
          <div className={`flex items-center px-2 py-1 rounded border shadow-sm ${darkMode ? 'bg-yellow-900/20 border-yellow-900/30 text-yellow-500' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
            <span className="text-xs font-bold">⭐ {building.rating || '4.5'}</span>
          </div>
        </div>
        <h2 className={`text-2xl font-black mt-2 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{escapeHtml(building.name)}</h2>
        <div className={`flex items-center gap-1.5 mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <ClockIcon />
          <span className="font-medium">{building.hours || 'Open 24 Hours'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {building.walking && (
          <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center gap-2 mb-1"><LocationIcon /><span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Distance</span></div>
                <span className={`text-xl font-black ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>{building.walking.distance}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-2 mb-1"><ClockIcon /><span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>Travel Time</span></div>
                <span className={`text-xl font-black ${darkMode ? 'text-emerald-300' : 'text-green-900'}`}>{building.walking.duration}</span>
              </div>
            </div>
          </section>
        )}

        <section className={`rounded-2xl p-5 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-4"><LayersIcon /><h3 className={`font-bold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Building Details</h3></div>
          <div className="space-y-3">
            <div className={`flex justify-between text-sm border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium`}>Floors</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{floor?.floors ?? 'N/A'}</span>
            </div>
            {floor?.rooms != null && floor.rooms > 0 && (
              <div className={`flex justify-between text-sm border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium`}>Approx. Rooms</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{floor.rooms}</span>
              </div>
            )}
            <div className="pt-1">
              <span className={`text-[10px] font-bold uppercase block mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Departments & Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {displayItems.length > 0 ? (
                  displayItems.map((item, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded text-[11px] font-medium shadow-sm border ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`}>{item}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No specific tags available</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>About</h3>
          <p className={`leading-relaxed text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{escapeHtml(building.description)}</p>
        </section>

        {images.length > 0 && (
          <section className="pb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Gallery</h3>
            <div className="grid grid-cols-1 gap-4">
              {images.map((url, index) => (
                <div key={index} className={`overflow-hidden rounded-2xl border shadow-sm ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                  <img src={url} alt={`${building.name} view ${index + 1}`} className="w-full h-48 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={`p-4 border-t ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
          <button onClick={() => onViewDetail?.(building)}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors bg-indigo-600 hover:bg-indigo-700 text-white">
            VIEW detail
          </button>
        </div>
      </div>
    </div>
  );
}
