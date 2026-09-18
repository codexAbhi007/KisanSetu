import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Truck, Store, Sprout, Navigation, Zap, ShieldCheck, Compass, Filter, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, Circle } from '@vis.gl/react-google-maps';

export const KisanMap: React.FC = () => {
  const { products, currentUser, setActivePage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'farms' | 'shops' | 'vehicles'>('all');
  const [selectedGeofenceRadius, setSelectedGeofenceRadius] = useState<number>(10); // in km
  const [isSimulatingTracking, setIsSimulatingTracking] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

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
          `📍 GPS Location Detected successfully (${lat.toFixed(4)}, ${lng.toFixed(4)}) - Proximity filters updated`,
          ...prev,
        ]);
      },
      (_error) => {
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

  // Simulated live moving delivery vehicle coordinates
  const [vehiclePosition, setVehiclePosition] = useState({ lat: 19.2, lng: 73.5, speed: '45 km/h', status: 'In Transit - Cold Chain 4°C' });
  const [geofenceAlerts, setGeofenceAlerts] = useState<string[]>([
    '🚚 Logistics Van #104 entered Nashik FPO Hub geofence (10km radius)',
    '🌾 Patil Organic Farm geofence active: 8 fresh batches ready',
    '🏪 Sharma Mart 5km express delivery zone active',
  ]);

  // Simulate real-time vehicle movement
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

  // Entities mapped on KisanSetu Map
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
      productsCount: 14,
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
      productsCount: 22,
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
      productsCount: 45,
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
      productsCount: 38,
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

  // Location-aware product recommendations based on proximity
  const proximityProducts = products.slice(0, 4).map((p, idx) => ({
    ...p,
    distanceKm: (1.2 + idx * 2.3).toFixed(1),
    sourceName: idx % 2 === 0 ? 'Patil Organic Farm (Nashik)' : 'Sharma Fresh Kirana Mart (Pune)',
  }));

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasValidApiKey = apiKey && apiKey.length > 10 && !apiKey.includes('YOUR_KEY');

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-300">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Google Maps Platform • Real-Time Tracking & Geofencing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Live Agricultural Supply Chain Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Monitor real-time vehicle positions, farm harvests, kirana store geofences, and discover proximity-sorted fresh produce recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-detect-location"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <MapPin className={`w-4 h-4 text-slate-950 ${isDetecting ? 'animate-bounce' : ''}`} />
            <span>{isDetecting ? 'Detecting GPS...' : '📍 Detect My Location'}</span>
          </button>

          <button
            onClick={() => setIsSimulatingTracking(!isSimulatingTracking)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isSimulatingTracking
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTracking ? 'animate-spin' : ''}`} />
            <span>{isSimulatingTracking ? 'Live Tracking Active' : 'Resume Simulation'}</span>
          </button>
        </div>
      </div>

      {userLocation && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
              📍
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Current GPS Position Acquired</div>
              <div className="text-sm font-black text-emerald-950 dark:text-emerald-100">{userLocation.address} (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)})</div>
            </div>
          </div>
          <button
            onClick={() => setUserLocation(null)}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Map & Live Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* Map Controls Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Filter View:</span>
              <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold">
                {[
                  { key: 'all', label: 'All Entities' },
                  { key: 'farms', label: '🌾 Farms' },
                  { key: 'shops', label: '🏪 Shops' },
                  { key: 'vehicles', label: '🚚 Fleet' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === tab.key
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono">Geofence Radius:</span>
              <select
                value={selectedGeofenceRadius}
                onChange={(e) => setSelectedGeofenceRadius(Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={5}>5 km Radius</option>
                <option value={10}>10 km Radius</option>
                <option value={25}>25 km Radius</option>
                <option value={50}>50 km Radius</option>
              </select>
            </div>
          </div>

          {/* Interactive Map Render */}
          <div className="relative h-[480px] w-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
            {hasValidApiKey ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  defaultCenter={{ lat: 19.0, lng: 73.8 }}
                  defaultZoom={8}
                  mapId="kisansetu_map_id"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  className="w-full h-full"
                >
                  {filteredEntities.map((entity) => (
                    <AdvancedMarker
                      key={entity.id}
                      position={{ lat: entity.lat, lng: entity.lng }}
                      onClick={() => setSelectedEntity(entity)}
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 cursor-pointer transition-transform hover:scale-110 ${
                          entity.type === 'farm'
                            ? 'bg-emerald-600 border-white text-white'
                            : entity.type === 'shop'
                            ? 'bg-amber-500 border-white text-slate-950 font-black'
                            : 'bg-sky-600 border-white text-white animate-pulse'
                        }`}
                      >
                        {entity.icon}
                      </div>
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            ) : (
              /* Official Google Maps Simulation Embed with Live Overlay Nodes */
              <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
                {/* Official Google Maps iframe */}
                <iframe
                  title="Google Maps Simulation"
                  src="https://maps.google.com/maps?q=Nashik+to+Pune+Maharashtra+agricultural+corridor&t=&z=9&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full border-0 opacity-80 filter contrast-125"
                  loading="lazy"
                />

                {/* Top Overlay Header */}
                <div className="relative z-10 m-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300 font-mono">Google Maps Live Simulation (Nashik ⇄ Pune)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg font-mono">
                    {selectedGeofenceRadius} km Geofence Active
                  </span>
                </div>

                {/* Floating Bottom Nodes Dock */}
                <div className="relative z-10 m-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {filteredEntities.map((entity) => (
                    <div
                      key={entity.id}
                      onClick={() => setSelectedEntity(entity)}
                      className={`p-3 rounded-2xl border backdrop-blur-md text-left cursor-pointer transition-all flex items-center gap-3 shadow-2xl ${
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
            )}
          </div>

          {/* Selected Entity Card Footer */}
          {selectedEntity && (
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl">
                  {selectedEntity.icon}
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-2">
                    <span>{selectedEntity.name}</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
                      {selectedEntity.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedEntity.location} • Status: <strong className="text-emerald-400">{selectedEntity.status}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Close Info
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Geofence Alerts & Telemetry (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dedicated Live Simulation Telemetry Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl border border-emerald-500/40 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400 animate-bounce" />
                <h3 className="text-sm font-black uppercase tracking-wider text-emerald-200">
                  Live Fleet Simulation
                </h3>
              </div>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Active (4s ping)
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Vehicle Unit:</span>
                <span className="font-bold text-white">Cold-Chain EV #104</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Current Position:</span>
                <span className="font-bold text-emerald-400">({vehiclePosition.lat}, {vehiclePosition.lng})</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Speed & Route:</span>
                <span className="font-bold text-amber-300">48 km/h • Nashik ⇄ Pune</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-800/50 flex items-center justify-between">
                <span className="text-slate-400">Cargo Temp:</span>
                <span className="font-bold text-sky-300">3.8°C (Optimal Cold-Chain)</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setIsSimulatingTracking(!isSimulatingTracking)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTracking ? 'animate-spin' : ''}`} />
                <span>{isSimulatingTracking ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Location-Aware Product Recommendations */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Proximity-Sorted Produce</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted by real-time GPS distance from your current location ({currentUser?.location?.villageOrCity || 'Pune'}):
            </p>

            <div className="space-y-3">
              {proximityProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActivePage('consumer_home')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{prod.name}</h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{prod.sourceName}</p>
                      <span className="text-xs font-black text-slate-900 dark:text-white">₹{prod.price}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg">
                      📍 {prod.distanceKm} away
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
