import { locations } from '../data/locations';
import { useTheme } from '../context/ThemeContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { darkMode } = useTheme();
  const categories = ['All', ...new Set(locations.map((loc) => loc.category))];

  return (
    <div className={`mb-4 p-3 rounded-xl shadow-sm border overflow-x-auto whitespace-nowrap ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-150 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white font-semibold'
                : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
