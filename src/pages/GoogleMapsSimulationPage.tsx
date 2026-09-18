import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Truck, Store, Sprout, Navigation, Zap, ShieldCheck, Compass, RefreshCw, ArrowLeft, Layers, AlertCircle } from 'lucide-react';

export const GoogleMapsSimulationPage: React.FC = () => {
  const { products, currentUser, setActivePage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'farms' | 'shops' | 'vehicles'>('all');
  const [selectedGeofenceRadius, setSelectedGeofenceRadius] = useState<number>(10);
  const [isSimulatingTracking, setIsSimulatingTracking] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  // Pick and Drop location route selection state for dynamic path highlighting
  const [pickLocation, setPickLocation] = useState<string>('Patil Organic Farm, Nashik');
  const [dropLocation, setDropLocation] = useState<string>('Sharma Fresh Kirana Mart, Pune');

  const mapEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(pickLocation)}&daddr=${encodeURIComponent(dropLocation)}&t=&z=9&ie=UTF8&iwloc=&output=embed`;

  // Simulated live moving delivery vehicle coordinates
  const [vehiclePosition, setVehiclePosition] = useState({ lat: 19.2, lng: 73.5, speed: '48 km/h', status: 'In Transit - Cold Chain 3.8°C' });
  const [geofenceAlerts, setGeofenceAlerts] = useState<string[]>([
    '🚚 Logistics Van #104 entered Nashik FPO Hub geofence (10km radius)',
    '🌾 Patil Organic Farm geofence active: 8 fresh batches ready',
    '🏪 Sharma Mart 5km express delivery zone active',
  ]);

  useEffect(() => {
    if (!isSimulatingTracking) return;
    const interval = setInterval(() => {
      setVehiclePosition((prev) => {
        const newLat = prev.lat + (Math.random() - 0.5) * 0.02;
        const newLng = prev.lng + (Math.random() - 0.5) * 0.02;
        return {
          ...prev,
          lat: Number(newLat.toFixed(4)),
          lng: Number(newLng.toFixed(4)),
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulatingTracking]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng, address: `GPS Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}` });
        setIsDetecting(false);
        setGeofenceAlerts((prev) => [
          `📍 GPS Location Detected (${lat.toFixed(4)}, ${lng.toFixed(4)}) - Proximity filters updated`,
          ...prev,
        ]);
      },
      () => {
        setIsDetecting(false);
        setUserLocation({ lat: 18.5204, lng: 73.8567, address: 'Pune Central, Maharashtra (Default)' });
        setGeofenceAlerts((prev) => [
          `📍 Using default Pune Hub coordinates due to permission prompt.`,
          ...prev,
        ]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mapEntities = [
    {
      id: 'farm-1',
      type: 'farm',
      name: 'Patil Organic Farm',
      location: 'Nashik, Maharashtra',
      lat: 20.0,
      lng: 73.78,
      status: 'Harvest Ready • FPO Certified',
      icon: '🌾',
      distance: '4.2 km',
    },
    {
      id: 'farm-2',
      type: 'farm',
      name: 'Sahyadri Agro Producer',
      location: 'Pune Rural, Maharashtra',
      lat: 18.65,
      lng: 73.9,
      status: 'Cold Storage Active • 2°C',
      icon: '🌾',
      distance: '12.5 km',
    },
    {
      id: 'shop-1',
      type: 'shop',
      name: 'Sharma Fresh Kirana Mart',
      location: 'Kothrud, Pune',
      lat: 18.52,
      lng: 73.81,
      status: 'Open • 30-min Express Ready',
      icon: '🏪',
      distance: '1.8 km',
    },
    {
      id: 'shop-2',
      type: 'shop',
      name: 'GreenBasket Daily Essentials',
      location: 'Viman Nagar, Pune',
      lat: 18.56,
      lng: 73.91,
      status: 'Open • Bulk Restocking Hub',
      icon: '🏪',
      distance: '6.4 km',
    },
    {
      id: 'vehicle-1',
      type: 'vehicle',
      name: 'Cold-Chain EV Van #104',
      location: 'Nashik-Pune Expressway',
      lat: vehiclePosition.lat,
      lng: vehiclePosition.lng,
      status: vehiclePosition.status,
      icon: '🚚',
      distance: '3.1 km',
      speed: vehiclePosition.speed,
    },
  ];

  const filteredEntities = mapEntities.filter((e) => {
    if (selectedCategory === 'farms') return e.type === 'farm';
    if (selectedCategory === 'shops') return e.type === 'shop';
    if (selectedCategory === 'vehicles') return e.type === 'vehicle';
    return true;
  });

  const proximityProducts = products.slice(0, 4).map((p, idx) => ({
    ...p,
    distanceKm: (1.2 + idx * 2.3).toFixed(1),
    sourceName: idx % 2 === 0 ? 'Patil Organic Farm (Nashik)' : 'Sharma Fresh Kirana Mart (Pune)',
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Header Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('marketplace')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                Google Maps Live Agri-Simulation & Route Planner
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Select pick and drop locations to dynamically highlight transport paths on Google Maps.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-detect-location-page"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <MapPin className={`w-4 h-4 ${isDetecting ? 'animate-bounce' : ''}`} />
            <span>{isDetecting ? 'Detecting GPS...' : '📍 Detect My Location'}</span>
          </button>

          <button
            onClick={() => setIsSimulatingTracking(!isSimulatingTracking)}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isSimulatingTracking
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTracking ? 'animate-spin' : ''}`} />
            <span>{isSimulatingTracking ? 'Tracking Live (4s)' : 'Simulation Paused'}</span>
          </button>
        </div>
      </header>

      {/* Pick & Drop Route Selection Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700 flex-1 min-w-[240px]">
            <span className="text-xs font-bold text-emerald-400 shrink-0">🌾 Pick Location:</span>
            <select
              value={pickLocation}
              onChange={(e) => setPickLocation(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none w-full cursor-pointer"
            >
              <option value="Patil Organic Farm, Nashik" className="bg-slate-900 text-white">Patil Organic Farm (Nashik)</option>
              <option value="Sahyadri Agro Producer, Pune" className="bg-slate-900 text-white">Sahyadri Agro Producer (Pune Rural)</option>
              <option value="Nashik FPO Central Hub" className="bg-slate-900 text-white">Nashik FPO Central Hub</option>
              <option value="Mumbai APMC Market, Vashi" className="bg-slate-900 text-white">Mumbai APMC Market, Vashi</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700 flex-1 min-w-[240px]">
            <span className="text-xs font-bold text-amber-400 shrink-0">🏪 Drop Location:</span>
            <select
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none w-full cursor-pointer"
            >
              <option value="Sharma Fresh Kirana Mart, Pune" className="bg-slate-900 text-white">Sharma Fresh Kirana Mart (Kothrud Pune)</option>
              <option value="GreenBasket Daily Essentials, Viman Nagar" className="bg-slate-900 text-white">GreenBasket Daily Essentials (Viman Nagar)</option>
              <option value="Pune Central Retail Hub" className="bg-slate-900 text-white">Pune Central Retail Hub</option>
              <option value="Thane Urban Consumer Hub" className="bg-slate-900 text-white">Thane Urban Consumer Hub</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-emerald-400 font-mono bg-emerald-950/80 px-3 py-2 rounded-xl border border-emerald-800 shrink-0">
          ✨ Route Path Highlighted on Google Maps
        </div>
      </div>

      {/* GPS Notification Banner */}
      {userLocation && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 px-6 py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <div>
              <span className="font-bold text-emerald-300">Active GPS Coordinates:</span>{' '}
              <strong className="text-white">{userLocation.address}</strong> (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)})
            </div>
          </div>
          <button
            onClick={() => setUserLocation(null)}
            className="text-emerald-400 hover:text-white underline text-[11px] font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Simulation Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left/Center: Clean Google Maps Simulation Iframe + Entity Dock below (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-slate-900 overflow-hidden">
          {/* Entity Filter & Geofence Controls — moved above the map to keep the map area clean */}
          <div className="border-b border-slate-800 px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 font-mono">Entity Filter:</span>
              <div className="inline-flex rounded-xl bg-slate-800 p-1 text-xs font-bold">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'farms', label: '🌾 Farms' },
                  { key: 'shops', label: '🏪 Shops' },
                  { key: 'vehicles', label: '🚚 Fleet' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as any)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === tab.key ? 'bg-emerald-600 text-white font-black' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Geofence:</span>
              <select
                value={selectedGeofenceRadius}
                onChange={(e) => setSelectedGeofenceRadius(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
              >
                <option value={5} className="bg-slate-900 text-white">5 km</option>
                <option value={10} className="bg-slate-900 text-white">10 km</option>
                <option value={25} className="bg-slate-900 text-white">25 km</option>
                <option value={50} className="bg-slate-900 text-white">50 km</option>
              </select>
            </div>
          </div>

          {/* Map Area — kept clean of floating controls */}
          <div className="relative h-[600px] lg:h-auto lg:flex-1 min-h-0 overflow-hidden">
            <iframe
              title="Google Maps Route Simulation"
              src={mapEmbedUrl}
              className="absolute inset-0 w-full h-full border-0 opacity-85 filter contrast-125"
              loading="lazy"
            />
          </div>

          {/* Entity Nodes Dock — shifted below the map to keep the map area clean */}
          <div className="relative z-10 border-t border-slate-800 px-4 py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {filteredEntities.map((entity) => (
              <div
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 shadow-lg ${
                  selectedEntity?.id === entity.id
                    ? 'bg-emerald-900/95 border-emerald-400 scale-105'
                    : 'bg-slate-900/90 hover:bg-slate-800/95 border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/50 border border-emerald-400 flex items-center justify-center text-xl shrink-0 text-white">
                  {entity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-bold">
                    <span className="uppercase">{entity.type}</span>
                    <span>{entity.distance}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-white truncate">{entity.name}</h4>
                  <p className="text-[10px] text-slate-300 truncate">{entity.status}</p>
                </div>
              </div>
            ))}
          </div>
          </div>

        {/* Right Sidebar: Telemetry & Proximity Recommendations (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 space-y-6 overflow-y-auto">
          {/* Live Fleet Telemetry Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl border border-emerald-500/40 p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400 animate-bounce" />
                <h3 className="text-sm font-black uppercase tracking-wider text-emerald-200">
                  Live Fleet Simulation
                </h3>
              </div>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Active (4s)
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Vehicle Unit:</span>
                <span className="font-bold text-white">Cold-Chain EV #104</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Current Position:</span>
                <span className="font-bold text-emerald-400">({vehiclePosition.lat}, {vehiclePosition.lng})</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Speed & Route:</span>
                <span className="font-bold text-amber-300">48 km/h • Nashik ⇄ Pune</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Cargo Temp:</span>
                <span className="font-bold text-sky-300">3.8°C (Optimal)</span>
              </div>
            </div>
          </div>

          {/* Proximity Recommendations */}
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Proximity Produce Recommendations</span>
            </h3>

            <div className="space-y-2.5">
              {proximityProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActivePage('consumer_home')}
                  className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{prod.name}</h4>
                      <p className="text-[10px] text-emerald-400">{prod.sourceName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg">
                    📍 {prod.distanceKm} away
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
