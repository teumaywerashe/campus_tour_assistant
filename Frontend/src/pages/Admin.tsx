import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

interface Building {
  id: number | string;
  name: string;
  category: string;
  images?: string;
}

export default function Admin() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/building`);
      if (res.data.success) setBuildings(res.data.buildings);
    } catch {
      toast.error('Failed to fetch buildings');
    }
  };

  useEffect(() => { fetchBuildings(); }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm('Delete this building?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/building/${id}`);
      toast.success('Building deleted');
      fetchBuildings();
    } catch {
      toast.error('Failed to delete building');
    }
  };

  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen p-8 transition-colors ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">Campus Buildings</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{buildings.length} buildings total</p>
          </div>
          <button onClick={() => navigate('/admin/building/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition">
            <Plus size={18} /> Add Building
          </button>
        </div>

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-slate-800/60 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-100'}`}>
              {buildings.map((b) => (
                <tr key={b.id} className={`transition ${darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-3">
                    <img
                      src={b.images || ''}
                      alt={b.name}
                      className="w-12 h-12 object-cover rounded-lg border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </td>
                  <td className="px-6 py-3 font-semibold">{b.name}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                      {b.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/building/edit/${b.id}`)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(b.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {buildings.length === 0 && (
                <tr>
                  <td colSpan={4} className={`px-6 py-16 text-center text-sm ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    No buildings yet. Click "Add Building" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
