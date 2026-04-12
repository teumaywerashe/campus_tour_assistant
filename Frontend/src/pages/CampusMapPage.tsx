import { useState, useEffect, useRef, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import CampusMapContainer from '../components/CampusMapContainer';
import { locations as BUILDINGS } from '../data/locations';

export default function CampusMapPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = useMemo(() => {
    if (!query && selectedCategory === 'All') return [];
    return BUILDINGS.filter((b) => {
      const matchesQuery = b.name.toLowerCase().includes(query.toLowerCase());
      const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100">
      <div ref={searchRef} className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-[95%] max-w-md transition-all">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div onFocus={() => setShowDropdown(true)}>
            <SearchBar onSearch={(val) => { setQuery(val); setShowDropdown(true); }} />
          </div>
          <div className="px-3 pb-2 overflow-x-auto">
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>
          {showDropdown && (query || selectedCategory !== 'All') && (
            <div className="border-t max-h-[60vh] overflow-y-auto bg-white">
              {filteredResults.length > 0 ? (
                filteredResults.map((loc) => (
                  <button key={loc.id} onClick={() => { setActiveBuilding(loc); setShowDropdown(false); }}
                    className="w-full text-left p-4 hover:bg-indigo-50 border-b last:border-none flex flex-col transition-colors">
                    <span className="font-bold text-gray-800 text-sm">{loc.name}</span>
                    <span className="text-xs text-gray-500">{loc.category}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm italic">No buildings found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <main className="h-full w-full">
        <CampusMapContainer searchQuery={query} selectedCategory={selectedCategory} onBuildingSelect={activeBuilding} />
      </main>
    </div>
  );
}
