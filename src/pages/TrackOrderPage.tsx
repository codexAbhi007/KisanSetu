import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, MapPin, CheckCircle2, Clock, ShieldCheck, Navigation, Phone, Star, AlertCircle } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, selectedOrderIdForTracking, setSelectedOrderIdForTracking, updateOrderStatus, currentUser } = useApp();
  const order = orders.find((o) => o.id === selectedOrderIdForTracking) || orders[0];

  const [simulatedProgress, setSimulatedProgress] = useState(order?.tracking.progressPercent || 72);

  // Simulate vehicle movement along route
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedProgress((prev) => (prev >= 98 ? 98 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-20 text-center transition-colors">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">No active orders found for tracking.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Order Selector */}
        <div className="bg-emerald-900 dark:bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded animate-pulse">
                Live GPS Tracking
              </span>
              <span className="text-emerald-300 text-xs font-mono">SIMULATED GPS — SIH DEMO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Order #{order.id}</h1>
            <p className="text-xs text-emerald-100 dark:text-slate-300">
              {order.productName} ({order.quantityKg} kg) • Buyer: {order.buyerName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={order.id}
              onChange={(e) => setSelectedOrderIdForTracking(e.target.value)}
              className="bg-emerald-800 dark:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-700 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.id} ({o.productName.slice(0, 18)}...)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Map Simulation */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg flex flex-col h-[520px] relative transition-colors">
            {/* Top Overlay Banner */}
            <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[10px]">Estimated Arrival</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">Today, 04:35 PM (32 mins remaining)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[10px]">Distance</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">18.4 km away</span>
              </div>
            </div>

            {/* Simulated Map Canvas Background */}
            <div className="flex-1 bg-emerald-950 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Route line */}
              <div className="absolute w-3/4 h-1.5 bg-emerald-600/60 rounded-full top-1/2 left-1/8 transform -translate-y-1/2" />
              
              {/* Farm Marker */}
              <div className="absolute left-[15%] top-1/2 transform -translate-y-1/2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl mx-auto mb-1 border-2 border-white dark:border-slate-800">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white bg-emerald-950/80 dark:bg-slate-900/90 px-2.5 py-1 rounded-md shadow-sm">
                  Nashik Farm
                </span>
              </div>

              {/* Moving Vehicle Marker */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-linear"
                style={{ left: `${simulatedProgress}%` }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-emerald-400 rounded-full blur-sm opacity-75 animate-ping" />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-2xl relative border-2 border-white dark:border-slate-800">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-[11px] px-3 py-1 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    🚚 In Transit ({simulatedProgress}%)
                  </div>
                </div>
              </div>

              {/* Destination Marker */}
              <div className="absolute right-[15%] top-1/2 transform -translate-y-1/2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xl mx-auto mb-1 border-2 border-white dark:border-slate-800">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white bg-emerald-950/80 dark:bg-slate-900/90 px-2.5 py-1 rounded-md shadow-sm">
                  Kolkata Buyer
                </span>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Journey Progress</span>
                <span className="text-emerald-700 dark:text-emerald-400">{simulatedProgress}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${simulatedProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Driver Info & Delivery Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Driver Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Assigned Logistics Partner</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg">
                  AD
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{order.assignedDriver?.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{order.assignedDriver?.vehicleId}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{order.assignedDriver?.rating} Driver Rating</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Secure Communication</span>
                <button
                  onClick={() => alert('Demo: Secure driver calling simulated.')}
                  className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Driver</span>
                </button>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Order Status & Timeline</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 text-xs">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 font-bold ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="pt-1">
                      <h4 className={`font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{step.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {currentUser?.role === 'admin' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Mark as Delivered & Release Escrow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
