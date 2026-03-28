import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { X } from "lucide-react";
import createGraph from "ngraph.graph";
import path from "ngraph.path";
import { CAMPUS_INFO } from "../data/locations";
import { nodes, EDGES } from "../data/navigation";
import BuildingDetailsPanel from "./BuildingDetailsPanel";
import { storeContext } from "../context/StoreContext";
import axios from "axios";
import toast from "react-hot-toast";

const calculatePathDistance = (pathCoords) => {
  if (!pathCoords || pathCoords.length < 2) return null;
  let totalMeters = 0;
  for (let i = 0; i < pathCoords.length - 1; i++) {
    const point1 = L.latLng(pathCoords[i][0], pathCoords[i][1]);
    const point2 = L.latLng(pathCoords[i + 1][0], pathCoords[i + 1][1]);
    totalMeters += point1.distanceTo(point2);
  }
  return totalMeters;
};

const createIcon = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<svg height="30" width="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="${color}" stroke="#fff" stroke-width="5"/>
                <circle cx="50" cy="50" r="15" fill="#fff"/>
               </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const getMarkerColor = (category) => {
  const cat = category.toLowerCase();
  if (
    cat.includes("outdoor") ||
    cat.includes("space") ||
    cat.includes("leisure")
  )
    return "green";
  if (
    cat.includes("service") ||
    cat.includes("entry") ||
    cat.includes("parking")
  )
    return "orange";
  if (
    cat.includes("academic") ||
    cat.includes("venue") ||
    cat.includes("libraries")
  )
    return "blue";
  return "red";
};

function MapHandler({ bounds, mapRef, onMapClick }) {
  const map = useMap();
  mapRef.current = map;

  useEffect(() => {
    if (!bounds) return;
    map.setMaxBounds([
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    ]);
    const campusCenter = [
      (bounds.north + bounds.south) / 2,
      (bounds.east + bounds.west) / 2,
    ];
    map.flyTo(campusCenter, 18, { animate: true, duration: 1.5 });
    map.on("click", (e) => onMapClick(e.latlng));
    return () => map.off("click");
  }, [map, bounds, onMapClick]);

  return null;
}

export default function CampusMapContainer({
  searchQuery,
  selectedCategory,
  onBuildingSelect,
  isDarkMode,
}) {
  const { setSelectedBuildingId } = useContext(storeContext);
 
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/building`);
      if (res.data.success) setLocations(res.data.buildings);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch buildings");
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    console.log("location", locations);
  }, [locations]);

  const [userLoc, setUserLoc] = useState({
    lat: 9.04093889954351,
    lng: 38.76219059547216,
  });
  const [locationStatus, setLocationStatus] = useState("Initializing GPS...");
  const [routeLayer, setRouteLayer] = useState(null);
  const mapRef = useRef();

  const graph = useMemo(() => {
    const g = createGraph();
    Object.keys(nodes).forEach((id) => g.addNode(id, nodes[id]));
    Object.entries(EDGES).forEach(([from, targets]) => {
      targets.forEach((to) => g.addLink(from, to));
    });
    return g;
  }, []);

  const pathFinder = useMemo(
    () =>
      path.aStar(graph, {
        distance(fromNode, toNode) {
          const dx = fromNode.data.lng - toNode.data.lng;
          const dy = fromNode.data.lat - toNode.data.lat;
          return Math.sqrt(dx * dx + dy * dy);
        },
      }),
    [graph],
  );

  useEffect(() => {
    if (onBuildingSelect) handleBuildingClick(onBuildingSelect);
  }, [onBuildingSelect]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("Live GPS Active ✅");
      },
      () => setLocationStatus("Using Default Location (Gate)"),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getNearestNode = (lat, lng) => {
    let closest = null;
    let minDist = Infinity;
    Object.entries(nodes).forEach(([id, coords]) => {
      const dist = Math.sqrt(
        Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2),
      );
      if (dist < minDist) {
        minDist = dist;
        closest = id;
      }
    });
    return closest;
  };

  const handleBuildingClick = (building) => {
    if (routeLayer) {
      mapRef.current.removeLayer(routeLayer);
      setRouteLayer(null);
    }
    setSelectedBuilding({ ...building, loading: true });
    if (setSelectedBuildingId) setSelectedBuildingId(building.id);

    const startNode = getNearestNode(userLoc.lat, userLoc.lng);
    let shortestPath = null;

    
    const entranceList = Array.isArray(building.nearestNode)
    ? building.nearestNode
    : typeof building.nearestNode === 'string' 
      ? building.nearestNode.split(',').map(s => s.trim()) 
      : [building.nearestNode];

    entranceList.forEach((nodeId) => {
      const tempPath = pathFinder.find(startNode, nodeId);
      if (tempPath && tempPath.length > 0) {
        if (!shortestPath || tempPath.length < shortestPath.length) {
          shortestPath = tempPath;
        }
      }
    });

    if (startNode && shortestPath) {
      const pathCoords = shortestPath
        .map((n) => [n.data.lat, n.data.lng])
        .reverse();
      const fullPath = [[userLoc.lat, userLoc.lng], ...pathCoords];

      const line = L.polyline(fullPath, {
        color: isDarkMode ? "#3b82f6" : "#0070f3",
        weight: 5,
        opacity: 0.8,
        dashArray: "10, 5",
        lineJoin: "round",
      }).addTo(mapRef.current);

      setRouteLayer(line);
      mapRef.current.fitBounds(line.getBounds(), {
        padding: [50, 50],
        maxZoom: 18,
      });

      const meters = calculatePathDistance(fullPath);
      setSelectedBuilding({
        ...building,
        walking: {
          distance: `${Math.round(meters)} m`,
          duration: `${Math.ceil(meters / 80)} min`,
        },
        loading: false,
      });
      if (setSelectedBuildingId) setSelectedBuildingId(building.id);
    } else {
      alert("Walking path not available for this location yet.");
      mapRef.current.flyTo([building.lat, building.lng], 18);
      setSelectedBuilding({ ...building, walking: null, loading: false });
      if (setSelectedBuildingId) setSelectedBuildingId(building.id);
    }
  };

  const filteredBuildings = useMemo(() => {
    let list = locations; // use the latest locations

    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((tag) => tag.toLowerCase().includes(q))),
      );
    }

    return list;
  }, [locations, searchQuery, selectedCategory]); // ✅ include locations here

  const handleRecenter = () => {
    if (mapRef.current) mapRef.current.flyTo([userLoc.lat, userLoc.lng], 18);
  };

  return (
    <div className="w-full h-full relative flex flex-col lg:flex-row">
      <div className="flex-grow h-full w-full relative">
      <LeafletMap
        center={[userLoc.lat, userLoc.lng]}
        zoom={18}
        minZoom={16}       
        maxZoom={21}        
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
          <MapHandler
            bounds={CAMPUS_INFO?.bounds}
            mapRef={mapRef}
            onMapClick={() => {}}
          />
          <TileLayer
            url={
              isDarkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            maxZoom={21}      
            maxNativeZoom={19}  
          />

          <Marker
            position={[userLoc.lat, userLoc.lng]}
            icon={L.divIcon({
              className: "user-location-icon",
              html: `<div style="position: relative;"><div style="background-color: #4285F4; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div><div style="position: absolute; top: -5px; left: -5px; width: 25px; height: 25px; background-color: rgba(66, 133, 244, 0.3); border-radius: 50%; animation: pulse 2s infinite;"></div></div>`,
              iconSize: [25, 25],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>

          {filteredBuildings?.map((b) => (
            <Marker
              key={b.id}
              position={[Number(b.lat), Number(b.lng)]}
              icon={createIcon(getMarkerColor(b.category))}
              eventHandlers={{ click: () => handleBuildingClick(b) }}
            >
              <Popup>{b.name}</Popup>
            </Marker>
          ))}
        </LeafletMap>
        <div className="absolute bottom-6 left-6 z-[500] flex flex-col items-start gap-2">
          {/* Status Label */}
          <span
            className={`${
              isDarkMode
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-white/90 text-black border-gray-200"
            } backdrop-blur text-[10px] px-2 py-1 rounded shadow-sm font-mono border`}
          >
            {locationStatus}
          </span>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className={`${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-800"
                : "bg-white border-gray-200 text-slate-800 hover:bg-gray-50"
            } p-3 rounded-full shadow-xl border active:scale-95 transition-all flex items-center`}
          >
            📍{" "}
            <span className="text-xs font-bold ml-1 hidden sm:inline">
              Recenter
            </span>
          </button>
        </div>
      </div>
      {selectedBuilding && (
        <aside
          className={`fixed bottom-0 left-0 right-0 z-[1000] ${
            isDarkMode
              ? "bg-slate-900 border-slate-700 text-white"
              : "bg-white border-l text-black"
          } rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.1)] lg:relative lg:w-96 lg:h-full lg:rounded-none lg:border-l`}
        >
          <div
            className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <div
              className={`w-12 h-1 ${
                isDarkMode ? "bg-slate-700" : "bg-gray-200"
              } rounded-full lg:hidden absolute top-2 left-1/2 -translate-x-1/2`}
            />
            <h3 className="font-bold">Building Details</h3>
            <button
              onClick={() => {
                setSelectedBuilding(null);
                if (setSelectedBuildingId) setSelectedBuildingId(null);
              }}
              className="p-1 hover:bg-gray-100/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="max-h-[50vh] lg:max-h-[calc(100%_-_120px)] overflow-y-auto">
            <BuildingDetailsPanel
              building={selectedBuilding}
              onViewDetail={(b) => {
                // close panel and navigate in-place
                setSelectedBuilding(null);
                if (setSelectedBuildingId) setSelectedBuildingId(null);
                navigate(`/location/${b.id}`);
              }}
            />
          </div>
        </aside>
      )}
    </div>
  );
}
