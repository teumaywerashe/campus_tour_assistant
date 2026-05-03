import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Upload, ArrowLeft, Save } from 'lucide-react';
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';
import { nodes } from '../data/navigation';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

const DEFAULT_IMAGE = '/map_assets/upload_placeholder.png';

interface FormData {
  name: string;
  category: string;
  description: string;
  floors: number | string;
  rooms: number | string;
  depts: string;
  lat: string;
  lng: string;
  nearestNode: string;
  hours: string;
  location: string;
  tags: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  if (center[0] && center[1]) map.setView(center, 18);
  return null;
}

export default function BuildingForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState<FormData>({
    name: '', category: '', description: '', floors: 1, rooms: 1,
    depts: '', lat: '', lng: '', nearestNode: '', hours: '', location: '', tags: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/building/${id}`)
      .then((res) => {
        const b = res.data.building?.[0] ?? res.data.building;
        if (!b) return;
        setFormData({
          name: b.name || '',
          category: b.category || '',
          description: b.description || '',
          nearestNode: b.nearestNode || '',
          floors: b.floorinfo?.floors ?? 1,
          rooms: b.floorinfo?.rooms ?? 1,
          depts: b.floorinfo?.depts?.join(', ') || '',
          lat: String(b.lat || ''),
          lng: String(b.lng || ''),
          hours: b.hours || '',
          location: b.location || '',
          tags: b.tags ? `{${b.tags.join(', ')}}` : '',
        });
        setExistingImage(b.images || '');
      })
      .catch(() => toast.error('Failed to load building'));
  }, [id, isEditing]);

  const handleNodeToggle = (nodeId: string) => {
    const current = formData.nearestNode ? formData.nearestNode.split(',').map((s) => s.trim()) : [];
    const updated = current.includes(nodeId)
      ? current.filter((n) => n !== nodeId)
      : [...current, nodeId];
    setFormData({ ...formData, nearestNode: updated.join(', ') });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Name and category are required');
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('nearestNode', formData.nearestNode);
    data.append('lat', String(formData.lat));
    data.append('lng', String(formData.lng));
    data.append('hours', formData.hours);
    data.append('location', formData.location);
    data.append('tags', formData.tags);
    data.append('floorinfo', JSON.stringify({
      floors: Number(formData.floors),
      rooms: Number(formData.rooms),
      depts: formData.depts.split(',').map((d) => d.trim()).filter(Boolean),
    }));
    if (imageFile) data.append('images', imageFile);

    try {
      const base = `${import.meta.env.VITE_BACKEND_URL}/api/building`;
      if (isEditing) {
        await axios.put(`${base}/${id}`, data);
        toast.success('Building updated!');
      } else {
        await axios.post(base, data);
        toast.success('Building created!');
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-indigo-500 transition ${
    darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
  }`;

  return (
    <div className={`min-h-screen p-6 transition-colors ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')}
            className={`p-2 rounded-lg border transition ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-100'}`}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black">{isEditing ? 'Edit Building' : 'Add New Building'}</h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {isEditing ? 'Update the building information below' : 'Fill in the details to add a new campus building'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left column */}
          <div className="space-y-6">

            {/* Image upload */}
            <div className={`rounded-xl border p-5 ${card}`}>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest opacity-60">Building Photo</h3>
              <div className="flex items-center gap-4">
                <img
                  src={imagePreview || existingImage || DEFAULT_IMAGE}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
                <label className={`flex-1 cursor-pointer flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed transition ${
                  darkMode ? 'border-slate-700 hover:border-indigo-500 text-slate-400' : 'border-gray-200 hover:border-indigo-400 text-gray-400'
                }`}>
                  <Upload size={20} />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Basic info */}
            <div className={`rounded-xl border p-5 space-y-4 ${card}`}>
              <h3 className="font-bold mb-2 text-sm uppercase tracking-widest opacity-60">Basic Info</h3>
              <input className={inputCls} placeholder="Building Name *" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <select className={inputCls} value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="">Select Category *</option>
                <option value="Academic">Academic</option>
                <option value="Libraries">Libraries</option>
                <option value="Sports">Sports</option>
                <option value="Parking">Parking</option>
                <option value="Outdoor">Outdoor</option>
              </select>
              <textarea className={`${inputCls} h-24 resize-none`} placeholder="Description"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input className={inputCls} placeholder="Hours (e.g. 8:00 AM - 5:00 PM)" value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })} />
              <input className={inputCls} placeholder="Location (e.g. 5 Kilo)" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <input className={inputCls} placeholder="Tags e.g. {Lab,Study,Lounge}" value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
            </div>

            {/* Floor info */}
            <div className={`rounded-xl border p-5 space-y-4 ${card}`}>
              <h3 className="font-bold mb-2 text-sm uppercase tracking-widest opacity-60">Floor Info</h3>
              <div className="flex gap-3">
                <input type="number" className={`${inputCls} w-1/2`} placeholder="Floors" value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })} />
                <input type="number" className={`${inputCls} w-1/2`} placeholder="Rooms" value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
              </div>
              <textarea className={`${inputCls} h-16 resize-none`} placeholder="Departments (comma separated)"
                value={formData.depts} onChange={(e) => setFormData({ ...formData, depts: e.target.value })} />
            </div>
          </div>

          {/* Right column — map */}
          <div className="space-y-6">
            <div className={`rounded-xl border p-5 ${card}`}>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest opacity-60">Location & Nearest Nodes</h3>

              {/* Coordinates */}
              <div className="flex gap-3 mb-4">
                <input type="number" step="any" className={`${inputCls} w-1/2`} placeholder="Latitude" value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })} />
                <input type="number" step="any" className={`${inputCls} w-1/2`} placeholder="Longitude" value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })} />
              </div>

              {/* Nearest nodes (read-only, set by clicking map) */}
              <input className={`${inputCls} mb-4 border-indigo-400`}
                placeholder="Nearest Nodes — click dots on map" value={formData.nearestNode} readOnly />

              {/* Map */}
              <div className={`w-full h-96 rounded-xl overflow-hidden border relative ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <MapContainer center={[9.0409, 38.7621]} zoom={17} style={{ height: '100%', width: '100%' }}>
                  <ChangeView center={[Number(formData.lat) || 9.0409, Number(formData.lng) || 38.7621]} />
                  <TileLayer url={darkMode
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                  {formData.lat && formData.lng && (
                    <Marker position={[Number(formData.lat), Number(formData.lng)]} />
                  )}
                  {Object.entries(nodes).map(([nodeId, coords]) => (
                    <CircleMarker key={nodeId} center={[coords.lat, coords.lng]} radius={7}
                      pathOptions={{
                        color: formData.nearestNode.includes(nodeId) ? '#4f46e5' : '#94a3b8',
                        fillOpacity: 1,
                        fillColor: formData.nearestNode.includes(nodeId) ? '#818cf8' : '#cbd5e1',
                      }}
                      eventHandlers={{ click: () => handleNodeToggle(nodeId) }}>
                      <Tooltip>Node: {nodeId}</Tooltip>
                    </CircleMarker>
                  ))}
                </MapContainer>
                <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold shadow border ${
                    darkMode ? 'bg-slate-800/90 text-indigo-400 border-slate-700' : 'bg-white/90 text-indigo-600 border-gray-200'
                  }`}>📍 Click dots to select nearest nodes</span>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button onClick={handleSave} disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-base transition">
              <Save size={18} />
              {loading ? 'Saving...' : isEditing ? 'Update Building' : 'Save Building'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
