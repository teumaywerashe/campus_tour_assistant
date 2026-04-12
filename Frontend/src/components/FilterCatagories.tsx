import { useState } from 'react';
import { Building2, BookOpen, Dumbbell, UtensilsCrossed, Car, Trees, Filter, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All', icon: Filter, color: 'bg-gray-500' },
  { id: 'academic', name: 'Academic', icon: Building2, color: 'bg-blue-500' },
  { id: 'library', name: 'Libraries', icon: BookOpen, color: 'bg-amber-500' },
  { id: 'sports', name: 'Sports', icon: Dumbbell, color: 'bg-green-500' },
  { id: 'dining', name: 'Dining', icon: UtensilsCrossed, color: 'bg-red-500' },
  { id: 'parking', name: 'Parking', icon: Car, color: 'bg-cyan-500' },
  { id: 'outdoor', name: 'Outdoor', icon: Trees, color: 'bg-emerald-500' },
];

interface FilterCategoriesProps {
  selectedCategories?: string[];
  onCategoryChange?: (selected: string[]) => void;
  variant?: 'horizontal' | 'grid';
}

export default function FilterCategories({ selectedCategories = [], onCategoryChange, variant = 'horizontal' }: FilterCategoriesProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCategories);

  const handleCategoryClick = (categoryId: string) => {
    let newSelected: string[];
    if (categoryId === 'all') {
      newSelected = [];
    } else {
      newSelected = localSelected.includes(categoryId)
        ? localSelected.filter((id) => id !== categoryId)
        : [...localSelected, categoryId];
    }
    setLocalSelected(newSelected);
    onCategoryChange?.(newSelected);
  };

  const isSelected = (categoryId: string) => {
    if (categoryId === 'all') return localSelected.length === 0;
    return localSelected.includes(categoryId);
  };

  const clearFilters = () => {
    setLocalSelected([]);
    onCategoryChange?.([]);
  };

  if (variant === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3>
          {localSelected.length > 0 && (
            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center space-x-1">
              <X className="h-4 w-4" /><span>Clear all</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button key={category.id} onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 ${isSelected(category.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <div className={`p-2 rounded-lg ${category.color}`}>
                <category.icon className="h-4 w-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${isSelected(category.id) ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Category</h3>
        {localSelected.length > 0 && (
          <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center space-x-1">
            <X className="h-4 w-4" /><span>Clear</span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ${isSelected(category.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800'}`}>
            <category.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
