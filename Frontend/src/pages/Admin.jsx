import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useTheme } from "../context/ThemeContext";
import { nodes } from "../data/navigation";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

const DEFAULT_IMAGE = "/map_assets/upload_placeholder.png";

function ChangeView({ center }) {
  const map = useMap();
  if (center[0] && center[1]) map.setView(center, 18);
  return null;
}

export default function Admin() {
  const { darkMode } = useTheme();
  const [buildings, setBuildings] = useState([]);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    floors: 1,
    rooms: 1,
    depts: "",
    lat: "",
    lng: "",
    nearestNode: "",
    hours: "",
    location: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/building`);
      if (res.data.success) setBuildings(res.data.buildings);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch buildings");
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name || "",
      category: building.category || "",
      description: building.description || "",
      nearestNode: building.nearestNode || "",
      floors: building.floorinfo?.floors || 1,
      rooms: building.floorinfo?.rooms || 1,
      depts: building.floorinfo?.depts?.join(", ") || "",
      lat: building.lat || "",
      lng: building.lng || "",
      hours: building.hours || "",
      location: building.location || "",
      tags: `{${building.tags?.join(", ")}}` || "",
    });
    setImagePreview("");
  };
  useEffect(() => {
    console.log(editingBuilding, formData);
  }, [editingBuilding]);
  const handleNodeToggle = (nodeId) => {
    const currentNodes = formData.nearestNode
      ? formData.nearestNode.split(",").map((s) => s.trim())
      : [];
    const newNodes = currentNodes.includes(nodeId)
      ? currentNodes.filter((id) => id !== nodeId)
      : [...currentNodes, nodeId];
    setFormData({ ...formData, nearestNode: newNodes.join(", ") });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("nearestNode", formData.nearestNode);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("hours", formData.hours);
    data.append("location", formData.location);
    data.append("tags", formData.tags);
    data.append(
      "floorinfo",
      JSON.stringify({
        floors: Number(formData.floors),
        rooms: Number(formData.rooms),
        depts: formData.depts.split(",").map((d) => d.trim()),
      }),
    );

    if (imageFile) data.append("images", imageFile);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/building`;
      if (editingBuilding) {
        await axios.put(`${url}/${editingBuilding.id}`, data);
      } else {
        await axios.post(url, data);
      }
      setEditingBuilding(null);
      setImageFile(null);
      setImagePreview("");
      fetchBuildings();
      // alert("Saved successfully!");
      toast.success("Saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };


  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this building?")) return;
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/building/${id}`);

      if(response.data.success){
        toast.success("Building deleted successfully");
      }
      fetchBuildings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete building");

    }
  };



  return (
    <div
      className={`min-h-screen p-8 transition-colors ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Buildings Table */}
        <div
          className={`flex-1 rounded-xl border p-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}
        >
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">Campus Buildings</h2>
            <button
              onClick={() => {
                setEditingBuilding(null);
                setFormData({
                  name: "",
                  category: "",
                  description: "",
                  floors: 1,
                  rooms: 1,
                  depts: "",
                  lat: "",
                  lng: "",
                  nearestNode: "",
                  hours: "",
                  location: "",
                  tags: "",
                });
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus size={18} /> Add New
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead
              className={`${darkMode ? "bg-slate-800/50" : "bg-gray-50"} uppercase text-xs font-bold text-gray-500`}
            >
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${darkMode ? "divide-slate-800" : "divide-gray-200"}`}
            >
              {buildings.map((b) => (
                <tr
                  key={b.id}
                  className={
                    darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"
                  }
                >
                  <td className="p-4 font-medium">{b.name}</td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Sidebar */}
        <div
          className={`w-full lg:w-[450px] rounded-xl border p-6 h-fit sticky top-8 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}
        >
          <h2 className="text-xl font-bold mb-6">
            {editingBuilding ? "Edit Building" : "Add Building"}
          </h2>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Map Picker */}
            <div
              className={`w-full h-64 border rounded-lg overflow-hidden relative ${darkMode ? "border-slate-700" : "border-gray-200"}`}
            >
              <MapContainer
                center={[9.0409, 38.7621]}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
              >
                <ChangeView
                  center={[Number(formData.lat), Number(formData.lng)]}
                />
                <TileLayer
                  url={
                    darkMode
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />

                {formData.lat && formData.lng && (
                  <Marker
                    position={[Number(formData.lat), Number(formData.lng)]}
                  />
                )}

                {Object.entries(nodes).map(([id, coords]) => (
                  <CircleMarker
                    key={id}
                    center={[coords.lat, coords.lng]}
                    radius={6}
                    pathOptions={{
                      color: formData.nearestNode.includes(id)
                        ? "#4f46e5"
                        : "#94a3b8",
                      fillOpacity: 1,
                      fillColor: formData.nearestNode.includes(id)
                        ? "#818cf8"
                        : "#cbd5e1",
                    }}
                    eventHandlers={{ click: () => handleNodeToggle(id) }}
                  >
                    <Tooltip>ID: {id}</Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>

              {/* Instruction Text Badge */}
              <div className="absolute bottom-2 left-2 z-[1000] pointer-events-none">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm border ${darkMode
                      ? "bg-slate-800/90 text-indigo-400 border-slate-700"
                      : "bg-white/90 text-indigo-600 border-gray-200"
                    }`}
                >
                  📍 Click dots to select Nearest Nodes
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-4 p-3 border rounded-xl shadow-sm transition-all duration-300
    ${darkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-black"
              }`}
            >
              {/* Image Preview */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={imagePreview || editingBuilding?.images || DEFAULT_IMAGE}
                  alt="Preview"
                  className="w-16 h-16 object-cover shadow-md border dark:border-slate-800"
                />
              </div>
              <label className="flex-1 cursor-pointer flex items-center gap-3 text-sm font-bold py-2 px-3 transition-colors duration-200 hover:text-blue-500 group">
                <Upload
                  size={18}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                />
                <span className="tracking-tight">Upload Photo</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Inputs */}
            <input
              className="admin-input"
              placeholder="Building Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <select
              className="admin-input"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Libraries">Libraries</option>
              <option value="Sports">Sports</option>
              <option value="Parking">Parking</option>
              <option value="Outdoor">Outdoor</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                className="admin-input w-1/2"
                placeholder="Floors"
                value={formData.floors}
                onChange={(e) =>
                  setFormData({ ...formData, floors: e.target.value })
                }
              />
              <input
                type="number"
                className="admin-input w-1/2"
                placeholder="Rooms"
                value={formData.rooms}
                onChange={(e) =>
                  setFormData({ ...formData, rooms: e.target.value })
                }
              />
            </div>

            <textarea
              className="admin-input h-16"
              placeholder="Departments (comma separated)"
              value={formData.depts}
              onChange={(e) =>
                setFormData({ ...formData, depts: e.target.value })
              }
            />
            <textarea
              className="admin-input h-20"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                className="admin-input w-1/2"
                placeholder="Lat"
                value={formData.lat}
                onChange={(e) =>
                  setFormData({ ...formData, lat: e.target.value })
                }
              />
              <input
                type="number"
                step="any"
                className="admin-input w-1/2"
                placeholder="Lng"
                value={formData.lng}
                onChange={(e) =>
                  setFormData({ ...formData, lng: e.target.value })
                }
              />
            </div>

            <input
              className="admin-input border-indigo-500 bg-indigo-50/10"
              placeholder="Nearest Nodes (Click Map Dots)"
              value={formData.nearestNode}
              readOnly
            />
            <input
              className="admin-input"
              placeholder="Hours (e.g. 8:00 AM - 5:00 PM)"
              value={formData.hours}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
            />
            <input
              className="admin-input"
              placeholder="Location Description"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              className="admin-input"
              placeholder="Tags (comma separated)  like {a,b,c}"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />

            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              {editingBuilding ? "Update Building" : "Save New Building"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
          background: ${darkMode ? "#1e293b" : "white"};
          outline: none;
        }
        .admin-input:focus {
          border-color: #4f46e5;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
