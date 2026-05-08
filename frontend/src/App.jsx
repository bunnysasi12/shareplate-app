import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, MapPin, Upload, CheckCircle, AlertTriangle, XCircle, User, LogOut, 
  Menu, Search, Clock, Package, Users, Navigation, ShieldCheck, Activity, 
  FileText, Globe, Info, Heart, Truck, Zap, BarChart3, ChevronRight, 
  Smartphone, Mail, Lock, ArrowLeft, RefreshCw, Check, KeyRound, Video, 
  X, StopCircle, PlayCircle, Plus, Trash2, List, UtensilsCrossed, Bike, ArrowRight,
  Lightbulb, Database, ClipboardList, Droplets, Leaf, Award, Ban, History
} from 'lucide-react';

// --- GLOBAL STYLES FOR ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
    .animate-pulse-soft { animation: pulse-soft 2s infinite; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 10px; }
  `}</style>
);

// --- MOCK DATA & CONFIG ---
const USER_ROLES = { DONOR: 'donor', RECEIVER: 'receiver', VOLUNTEER: 'volunteer', ADMIN: 'admin' };
const FOOD_TYPES = ['Rice / Grains', 'Curry / Gravy', 'Roti / Bread', 'Dessert', 'Snacks', 'Raw Vegetables', 'Mixed Meal'];
const FOOD_SERVING_RATIOS = { 'Rice / Grains': { adult: 6, child: 8 }, 'Curry / Gravy': { adult: 4, child: 6 }, 'Roti / Bread': { adult: 8, child: 12 }, 'Dessert': { adult: 10, child: 15 }, 'Snacks': { adult: 10, child: 15 }, 'Raw Vegetables': { adult: 5, child: 7 }, 'Mixed Meal': { adult: 2.5, child: 4 } };
const BG_IMAGES = ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1600'];

const INITIAL_USERS = [
  { id: 1, name: 'Sasi Kapoor', role: USER_ROLES.DONOR, type: 'Individual', email: 'sasi@lpu.in', phone: '9347556855', password: 'password', location: { lat: 31.255, lng: 75.705 }, suspended: false }, 
  { id: 2, name: 'Hope Foundation', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 200, capacityChildren: 100, capacityAdults: 100, email: 'help@hope.org', phone: '7032374400', password: 'password', location: { lat: 31.260, lng: 75.710 }, status: 'Active Now', demand: 'High', suspended: false },
  { id: 3, name: 'Safe Admin', role: USER_ROLES.ADMIN, email: 'admin@shareplate.org', phone: '0000000000', password: 'password', suspended: false },
  { id: 4, name: 'City Care Trust', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 50, capacityChildren: 0, capacityAdults: 50, email: 'care@city.org', phone: '9876543210', password: 'password', location: { lat: 31.250, lng: 75.700 }, status: 'Last active 5m ago', demand: 'Moderate', suspended: false },
  { id: 6, name: 'Rahul Verma', role: USER_ROLES.VOLUNTEER, type: 'Individual', email: 'volunteer@shareplate.org', phone: '9988776655', password: 'password', location: { lat: 31.258, lng: 75.708 }, suspended: false },
  { id: 7, name: 'Green Leaf Restaurant', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'greenleaf@demo.com', phone: '9876543211', password: 'password', location: { lat: 31.258, lng: 75.712 }, suspended: false },
];

const INITIAL_DONATIONS = [
  { id: 101, donorId: 1, foodType: 'Rice / Grains', quantity: 5, servingsAdults: 30, servingsChildren: 40, prepTime: '2 hours ago', packaging: 'secure', storage: 'hot', status: 'Delivered', score: 95, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=400', mediaType: 'image', timestamp: new Date().toISOString(), location: { lat: 31.255, lng: 75.705 }, claimedBy: 2, receiverId: 2, volunteerId: 6, pickedUp: true, delivered: true },
  { id: 103, donorId: 7, foodType: 'Raw Vegetables', quantity: 15, servingsAdults: 75, servingsChildren: 105, prepTime: '1 hour ago', packaging: 'sealed', storage: 'chilled', status: 'Safe to Donate', score: 100, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 1800000).toISOString(), location: { lat: 31.255, lng: 75.705 }, claimedBy: null, receiverId: null, volunteerId: null, pickedUp: false, delivered: false },
  { id: 104, donorId: 7, foodType: 'Curry / Gravy', quantity: 10, servingsAdults: 40, servingsChildren: 60, prepTime: '1 hour ago', packaging: 'sealed', storage: 'hot', status: 'Awaiting Volunteer', score: 98, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString(), location: { lat: 31.260, lng: 75.715 }, claimedBy: 4, receiverId: 4, volunteerId: null, pickedUp: false, delivered: false },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 5) strength += 1;
  if (password.length > 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return Math.min(strength, 4); 
};

// --- CUSTOM TOAST COMPONENT ---
const ToastNotification = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) { const timer = setTimeout(onClose, 4000); return () => clearTimeout(timer); }
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white animate-slideInRight ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
      <span className="font-bold text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity"><X size={16} /></button>
    </div>
  );
};

// --- COMPONENTS ---

const Navbar = ({ user, onLogout, setView, onLoginClick }) => (
  <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 relative">
        <div className="flex items-center cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-orange-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 shadow-md">
            <UtensilsCrossed size={20} className="text-white" />
          </div>
          <span className="ml-2 font-black text-xl tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">SharePlate</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <button onClick={() => setView('landing')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">Home</button>
          <button onClick={() => setView('howItWorks')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">How it Works</button>
          <button onClick={() => setView('aboutUs')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">About Us</button>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('dashboard')} className="hidden md:block text-sm font-bold text-gray-800 hover:text-orange-600 transition-colors">Dashboard</button>
            <span className="hidden md:block text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-200 uppercase">{user.role}</span>
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-300" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-black hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Login / Join Platform
          </button>
        )}
      </div>
    </div>
  </nav>
);

const LandingPage = ({ onGetStarted, onLearnMore, availableUsers }) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [stats, setStats] = useState({ saved: 1240, meals: 4500, partners: 89 });
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [locStatus, setLocStatus] = useState("idle"); 
  const [locationError, setLocationError] = useState(null);
  const [landingSection, setLandingSection] = useState('impact'); 

  useEffect(() => {
    const timer = setInterval(() => setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length), 5000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(p => ({ saved: p.saved + 1, meals: p.meals + 2, partners: p.partners }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLocateNGOs = () => {
    setLocStatus("loading");
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const nearby = availableUsers.filter(u => u.role === USER_ROLES.RECEIVER && !u.suspended)
            .map(ngo => ({ ...ngo, distance: calculateDistance(latitude, longitude, ngo.location.lat, ngo.location.lng) }))
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 3);
          setNearbyNGOs(nearby); setLocStatus("success");
        },
        () => {
          setLocStatus("error");
          setLocationError("Location access denied. Enable GPS to see data.");
        }
      );
    } else {
      setLocStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => { if (landingSection === 'gps') handleLocateNGOs(); }, [landingSection, availableUsers]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {BG_IMAGES.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-orange-50/10" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck size={20} className="text-orange-400" />
            <span className="text-sm font-bold tracking-wide">Enterprise Food Safety Standard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">Stop Waste. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Feed Hope.</span></h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">Connect surplus food with local communities in real-time. Verified safe by the system, delivered by volunteers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button onClick={onGetStarted} className="group relative inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1">Start Donating <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></button>
            <button onClick={onLearnMore} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"><Info size={20} /> Discover How</button>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-white/50 py-6 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center divide-x divide-gray-200">
            <div><p className="text-3xl font-black text-gray-800">{stats.saved}kg</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Food Rescued</p></div>
            <div><p className="text-3xl font-black text-orange-600">{stats.meals}+</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Meals Provided</p></div>
            <div><p className="text-3xl font-black text-blue-600">{stats.partners}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Partners</p></div>
          </div>
        </div>
      </div>

      <div id="discover" className="bg-orange-950 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 via-orange-900/80 to-black/40 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start text-white">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { id: 'impact', label: 'Impact Stats', icon: BarChart3 },
                { id: 'feed', label: 'Live Feed', icon: Activity },
                { id: 'gps', label: 'Find Nearby', icon: MapPin }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setLandingSection(tab.id)} 
                  className={`flex items-center gap-2 px-4 py-2 text-xs rounded-full border transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95
                    ${landingSection === tab.id 
                      ? 'bg-white text-orange-900 font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] border-white' 
                      : 'bg-black/20 border-white/20 text-white hover:bg-white/20'}`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {landingSection === 'impact' && (
                <div className="animate-slideUp space-y-6">
                  <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight drop-shadow-lg">
                    Turn <span className="font-bold text-orange-400">Surplus</span> into <br/>
                    <span className="font-bold text-yellow-400">Smiles</span>.
                  </h2>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition duration-300 hover:-translate-y-1">
                    <h3 className="text-orange-300 font-bold uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                      <Globe size={14} /> The Global & Local Challenge
                    </h3>
                    <p className="text-sm text-gray-200 mb-6 font-light leading-relaxed">
                      Current food donation systems suffer from inconsistent safety checks and logistical mismatches. While millions face hunger, edible surplus ends up in landfills, producing harmful methane emissions. SharePlate directly addresses this gap through multimodal verification.
                    </p>
                    <div className="grid grid-cols-2 gap-8 relative mb-6">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
                      <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md group-hover:scale-110 transition-transform">40%</div>
                        <div className="text-xs text-orange-100 font-medium uppercase tracking-wide">Food Wasted in India</div>
                      </div>
                      <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform">₹92k</div>
                        <div className="text-xs text-orange-100 font-medium uppercase tracking-wide">Crore Lost Annually</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="text-orange-300 font-bold text-[10px] uppercase tracking-wider mb-1">Environmental Toll</h4>
                        <p className="text-xs text-gray-300 leading-snug">Food waste accounts for nearly 10% of global greenhouse gas emissions. Redirecting it helps reduce our carbon footprint.</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="text-orange-300 font-bold text-[10px] uppercase tracking-wider mb-1">Social Deficit</h4>
                        <p className="text-xs text-gray-300 leading-snug">Manual safety inspections are subjective and slow, preventing tons of good food from reaching the hungry in time.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {landingSection === 'feed' && (
                <div className="animate-slideUp space-y-6">
                  <div className="flex justify-between items-end mb-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="animate-pulse text-red-400" /> Live Network Feed
                    </h2>
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-md animate-pulse">● Live</span>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { u: 'Bistro 55', a: 'Donated 15kg Rice', t: 'Just now' },
                      { u: 'Rahul (Vol)', a: 'Picked up Order #104', t: '2m ago' },
                      { u: 'Hope Foundation', a: 'Received 50 Meals', t: '5m ago' },
                      { u: 'Weddings Inc', a: 'Verified 200kg Food', t: '12m ago' },
                      { u: 'Fresh Bakery', a: 'Donated 10kg Bread', t: '25m ago' },
                      { u: 'City Care Trust', a: 'Completed Delivery', t: '40m ago' },
                    ].map((item, index) => (
                      <div key={index} className="bg-orange-900/40 backdrop-blur-sm border border-orange-500/30 p-4 rounded-lg flex items-center gap-4 hover:translate-x-2 transition-transform duration-300 hover:bg-orange-900/60">
                        <div className="bg-orange-500/20 p-2 rounded-full"><Heart size={18} className="text-orange-300 fill-orange-300/20" /></div>
                        <div>
                          <p className="font-medium text-sm text-white">{item.u} <span className="text-gray-300 font-normal">{item.a}</span></p>
                          <p className="text-xs text-orange-400 flex items-center gap-1 mt-1"><Clock size={10} /> {item.t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {landingSection === 'gps' && (
                <div className="animate-slideUp space-y-4">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MapPin className="text-orange-400" /> Nearby Help</h2>
                  <p className="text-sm text-orange-200 mb-4">Locating registered NGOs active in your area using device GPS.</p>
                  
                  <div className="bg-white/90 backdrop-blur-xl text-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {locStatus === 'loading' && (
                      <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        Scanning GPS coordinates...
                      </div>
                    )}
                    {locStatus === 'success' && nearbyNGOs.length > 0 && (
                      <div className="divide-y divide-gray-200">
                        {nearbyNGOs.map(ngo => (
                          <div key={ngo.id} className="p-4 hover:bg-orange-50 transition cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-bold text-base text-gray-900 group-hover:text-orange-700 transition-colors">{ngo.name}</div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm ${
                                ngo.demand === 'Critical' ? 'bg-red-100 text-red-600' :
                                ngo.demand === 'High' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {ngo.demand} Demand
                              </span>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-xs text-gray-500">Capacity: {ngo.capacity} meals (C: {ngo.capacityChildren} | A: {ngo.capacityAdults})</div>
                                <div className="text-xs flex items-center gap-1 text-emerald-600 mt-1 font-medium">
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {ngo.status || "Active Now"}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-800">{ngo.distance} <span className="text-xs font-normal text-gray-500">km</span></div>
                                <div className="text-[10px] text-gray-400">Away</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {(locStatus === 'error' || (locStatus === 'success' && nearbyNGOs.length === 0)) && (
                      <div className="p-8 text-center text-sm text-red-500 bg-red-50">
                        <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        {locationError || "No NGOs found nearby."}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center h-full">
             <div className="relative w-full max-w-md aspect-square bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center shadow-2xl animate-pulse-soft">
                <Globe size={150} className="text-orange-500/50" />
                <div className="absolute top-1/4 left-1/4 bg-white p-3 rounded-xl shadow-xl animate-slideUp" style={{animationDelay: '0.2s'}}>
                  <MapPin className="text-orange-500"/>
                </div>
                <div className="absolute bottom-1/4 right-1/4 bg-white p-3 rounded-xl shadow-xl animate-slideUp" style={{animationDelay: '0.4s'}}>
                  <Truck className="text-blue-500"/>
                </div>
                <div className="absolute top-1/2 right-10 bg-white p-3 rounded-xl shadow-xl animate-slideUp" style={{animationDelay: '0.6s'}}>
                  <ShieldCheck className="text-green-500"/>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksPage = ({ onGetStarted }) => {
  const steps = [
    { step: 1, title: '1. Data Acquisition Module', desc: 'The donor uploads a real-time photo or video of the surplus food through the app. Alongside the visual input, the donor provides critical contextual metadata, including food type, preparation time, storage condition (e.g., room temperature or chilled), packaging integrity, and estimated serving capacity.', icon: Camera },
    { step: 2, title: '2. Image & Metadata Processing', desc: 'The system pre-processes the inputs. It evaluates the image for visual freshness cues—such as color consistency, surface condition, and visible contamination. Simultaneously, the metadata is processed to establish contextual risk factors, like elapsed time since preparation and storage vulnerability.', icon: FileText },
    { step: 3, title: '3. Multimodal Fusion Engine', desc: 'The system does not rely on just one input. The multimodal fusion engine intelligently integrates the extracted visual features with the contextual metadata, creating a unified representation of the food\'s overall condition and risk profile.', icon: Activity },
    { step: 4, title: '4. Deduction-Based Risk Scoring', desc: 'Starting with a perfect safety score of 100, the system applies specific deductions based on identified risk factors (e.g., deducting points for prolonged room temperature storage). A Contamination Override Mechanism ensures that if severe spoilage like mold is detected, the score instantly drops to zero.', icon: ShieldCheck },
    { step: 5, title: '5. Safety Classification', desc: 'Based on the final computed score, the food is categorized into three strict classes: Safe to Donate (Score ≥ 70), Needs Manual Check (Score 40-69), or Unsafe for Redistribution (Score < 40). Only safe food moves forward in the redistribution cycle.', icon: CheckCircle },
    { step: 6, title: '6. Intelligent NGO Allocation', desc: 'Once verified as safe, the matching engine cross-references the donated food\'s quantity with the real-time capacities and geolocations of registered NGOs. It instantly alerts the nearest NGO that has the exact capacity requirement to avoid secondary wastage.', icon: MapPin },
    { step: 7, title: '7. Volunteer Dispatch', desc: 'Upon NGO acceptance, the system automatically assigns and routes a registered volunteer via GPS. The volunteer picks up the verified food and safely delivers it, tracking progress in real-time to complete the zero-waste lifecycle.', icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-orange-50/50 pt-32 pb-16 px-4 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            How SharePlate <span className="text-orange-600">Works</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our patent-aligned <span className="font-semibold text-orange-600">Context-Aware Multimodal Food Safety Verification System</span> uses deduction-based risk scoring to ensure food safety while seamlessly matching donations with those in need.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-orange-100 before:via-orange-500 before:to-orange-100">
          {steps.map((item, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-slideUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-orange-500 text-white shadow-xl flex-shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={24} />
              </div>
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-orange-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center animate-fadeIn" style={{animationDelay: '0.8s'}}>
          <button onClick={onGetStarted} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 inline-flex items-center gap-2">
            Start Donating Now <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutUsPage = () => {
  const founders = [
    { name: "Ronak Reddy", role: "Founder (Shareplate)", desc: "The visionary behind the SharePlate platform. Passionate about leveraging technology to achieve zero hunger, Ronak leads our core mission to bridge the gap between surplus food and scarcity.", img: "https://i.ibb.co/ZzXVxgwF/Ronak.jpg" },
    { name: "Sairi Sathvik", role: "CEO", desc: "Sairi leads the strategic execution and overall operations of SharePlate. He ensures seamless connectivity, trust, and logistical efficiency between food donors, volunteers, and receiving NGOs.", img: "https://i.ibb.co/LhSjRQvs/Hero.jpg" },
    { name: "Sasi Kapoor", role: "Managing Director (Information Service)", desc: "The technical architect of our multimodal data systems and intelligent NGO-matching engine. Sasi manages real-time data flows, platform stability, and the complex routing algorithms.", img: "https://i.ibb.co/My7bzB5t/Sasi.jpg" },
    { name: "Tharak Reddy", role: "Managing Director (Food Quality)", desc: "Oversees the Context-Aware Risk Scoring models. Tharak defines strict food safety parameters to guarantee that only verifiably safe, quality food is approved for community redistribution.", img: "https://i.ibb.co/v64MMWRz/Tharak.jpg" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 border border-orange-100 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-8 md:p-12 space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Lightbulb size={16} /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Solving the missing link in <br/><span className="text-orange-600">food redistribution.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We realized that while many people want to donate surplus food from events or restaurants, NGOs hesitate to accept it because they cannot verify its safety. Manual inspections were slow and unreliable. 
            </p>
            <p className="text-gray-600 leading-relaxed">
              This inspired us to invent a <strong>Multimodal Verification System</strong>. By combining visual freshness cues with specific donor metadata, we created a patent-aligned framework that scores food safety instantly. SharePlate was born to make zero-waste possible, safe, and efficient.
            </p>
          </div>
          <div className="md:w-1/2 h-full min-h-[300px] md:min-h-[450px] relative bg-orange-100">
             <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1000&auto=format&fit=crop')` }} />
             <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/90 md:to-transparent" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Meet the Innovators</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">The minds behind the Context-Aware Multimodal Food Safety Verification System.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {founders.map((founder, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 group animate-slideUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="h-64 overflow-hidden relative bg-gray-200">
                <img src={founder.img} alt={founder.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 relative bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-4">{founder.role}</p>
                <div className="w-8 h-1 bg-orange-200 mb-4 rounded-full group-hover:w-16 transition-all duration-300"></div>
                <p className="text-sm text-gray-600 leading-relaxed">{founder.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthScreen = ({ onLogin, onRegister, onPasswordReset, availableUsers, showToast }) => {
  const [activeTab, setActiveTab] = useState('login'); 
  const [role, setRole] = useState(USER_ROLES.DONOR);
  const [formData, setFormData] = useState({ email: '', name: '', password: '', phone: '', isNgo: false, ngoName: '', capacityChildren: '', capacityAdults: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [locStatus, setLocStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  
  // Forgot Password specific states
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  const SERVER_URL = 'http://3.106.48.8:5000'; 

  useEffect(() => {
    let interval;
    if (resendTimer > 0) interval = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    // Reset all states when switching tabs
    setOtpSent(false); 
    setEnteredOtp(''); 
    setResendTimer(0);
    setResetIdentifier('');
    setNewResetPassword('');
    setFormData({ email: '', name: '', password: '', phone: '', isNgo: false, ngoName: '', capacityChildren: '', capacityAdults: '' });
    
    if (activeTab === 'register') {
      setLocStatus('fetching');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setLocStatus('success');
          },
          (err) => {
            setLocStatus('error');
            setUserLocation({ lat: 31.255, lng: 75.705 }); 
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setLocStatus('error');
        setUserLocation({ lat: 31.255, lng: 75.705 }); 
      }
    }
  }, [activeTab]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const foundUser = availableUsers.find(u => u.email === formData.email && u.password === formData.password);
    if (foundUser) {
      if(foundUser.suspended) return showToast("Your account has been suspended by an Admin.", "error");
      onLogin(foundUser);
    } else showToast("Invalid email or password", "error");
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const targetEmail = activeTab === 'forgot' ? resetIdentifier : formData.email;
    
    fetch(`${SERVER_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) { showToast(data.error, "error"); setResendTimer(0); }
      else { showToast("A new verification code has been sent!", "success"); }
    })
    .catch(() => { showToast("Network error. Could not resend OTP.", "error"); setResendTimer(0); });
  };

  const handleRegisterFlow = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!formData.name || !formData.password || !formData.phone || !formData.email) return showToast("All base fields required", "error");
      if (role === USER_ROLES.RECEIVER && formData.isNgo && (!formData.ngoName || formData.capacityChildren === '' || formData.capacityAdults === '')) return showToast("Please fill out the NGO details", "error");

      setIsVerifying(true); 
      fetch(`${SERVER_URL}/api/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email }) })
      .then(res => res.json())
      .then(data => {
        if (data.error) { showToast(data.error, "error"); setIsVerifying(false); return; }
        setOtpSent(true); setResendTimer(30); setIsVerifying(false); 
      }).catch(() => { showToast("Backend offline for demo. Please ensure server is running.", "error"); setIsVerifying(false); });
    } else {
      fetch(`${SERVER_URL}/api/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, otp: enteredOtp }) })
      .then(res => res.json())
      .then(data => {
        if (data.error) return showToast("Incorrect Verification Code", "error");
        
        const newUser = { 
          id: Date.now(), 
          ...formData, 
          name: (role === USER_ROLES.RECEIVER && formData.isNgo) ? formData.ngoName : formData.name,
          contactName: formData.name,
          capacityChildren: (role === USER_ROLES.RECEIVER && formData.isNgo) ? parseInt(formData.capacityChildren) || 0 : 0,
          capacityAdults: (role === USER_ROLES.RECEIVER && formData.isNgo) ? parseInt(formData.capacityAdults) || 0 : 0,
          capacity: (role === USER_ROLES.RECEIVER && formData.isNgo) ? (parseInt(formData.capacityChildren) || 0) + (parseInt(formData.capacityAdults) || 0) : 5,
          role, 
          location: userLocation || { lat: 31.255, lng: 75.705 }, 
          joinedAt: new Date().toISOString(),
          verified: true,
          suspended: false 
        };
        onRegister(newUser);
        showToast("Account Created Successfully!", "success");
        setOtpSent(false);
        setActiveTab('login');
      });
    }
  };

  const handleForgotFlow = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!availableUsers.find(u => u.email === resetIdentifier || u.phone === resetIdentifier)) return showToast("Account not found", "error");
      setIsVerifying(true); 
      
      fetch(`${SERVER_URL}/api/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resetIdentifier }) })
      .then(res => res.json())
      .then(data => {
        if (data.error) { showToast(data.error, "error"); } 
        else { setOtpSent(true); setResendTimer(30); }
        setIsVerifying(false); 
      }).catch(() => { showToast("Error connecting to server to send OTP.", "error"); setIsVerifying(false); });
    } else {
      if (!newResetPassword) return showToast("Please enter a new password", "error");
      
      fetch(`${SERVER_URL}/api/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resetIdentifier, otp: enteredOtp }) })
      .then(res => res.json())
      .then(data => {
        if (data.error) return showToast("Incorrect Verification Code", "error");
        onPasswordReset(resetIdentifier, newResetPassword); 
        showToast("Password updated securely!", "success"); 
        setOtpSent(false);
        setActiveTab('login'); 
      }).catch(() => showToast("Error verifying OTP.", "error"));
    }
  };

  return (
    <div className="w-full">
      {activeTab !== 'forgot' && !otpSent && (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('login')}>Login</button>
          <button className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('register')}>Register</button>
        </div>
      )}

      {otpSent ? (
         <div className="animate-fadeIn space-y-5">
           <button onClick={() => setOtpSent(false)} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800"><ArrowLeft size={16}/> Back</button>
           
           <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
             <p className="text-sm text-blue-800">We sent a secure code to <strong>{activeTab === 'forgot' ? resetIdentifier : formData.email}</strong></p>
           </div>
           
           <input type="text" className="w-full border-2 border-gray-200 p-3 rounded-xl text-center text-2xl tracking-widest font-mono focus:border-orange-500 outline-none" placeholder="0000" maxLength={4} onChange={e => setEnteredOtp(e.target.value)} />
           
           {activeTab === 'forgot' && <input type="password" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 outline-none" placeholder="New Password" value={newResetPassword} onChange={e => setNewResetPassword(e.target.value)} />}
           
           <button onClick={activeTab === 'forgot' ? handleForgotFlow : handleRegisterFlow} className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition-all">Verify & Continue</button>

           <div className="text-center mt-4 pt-2">
             <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0} className={`text-sm transition-colors font-bold ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:text-orange-800 underline'}`}>
               {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Didn't receive a code? Resend"}
             </button>
           </div>
         </div>
      ) : (
        <form onSubmit={activeTab === 'login' ? handleLoginSubmit : activeTab === 'forgot' ? handleForgotFlow : handleRegisterFlow} className="space-y-4">
          
          {activeTab === 'login' && (
             <div className="space-y-3 animate-slideUp">
               <div className="relative group">
                 <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                 <input type="email" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                 <input type="password" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
               </div>
               <div className="text-right mt-1"><button type="button" onClick={() => setActiveTab('forgot')} className="text-sm text-orange-600 font-bold hover:underline">Forgot Password?</button></div>
             </div>
          )}

          {activeTab === 'register' && (
            <div className="space-y-3 animate-slideUp">
              <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <div>
                <input type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Create Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                {formData.password && (
                  <div className="mt-2 px-1">
                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} className={`h-full flex-1 transition-all duration-300 ${
                          calculatePasswordStrength(formData.password) >= level 
                            ? (calculatePasswordStrength(formData.password) <= 2 ? 'bg-orange-400' : 'bg-green-500') 
                            : 'bg-transparent'
                        }`}></div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {calculatePasswordStrength(formData.password) <= 2 ? 'Weak - Add numbers & symbols' : 'Strong Password'}
                    </p>
                  </div>
                )}
              </div>
              
              <label className="block text-xs font-bold text-gray-500 uppercase mt-2">I want to...</label>
              <div className="grid grid-cols-3 gap-2">
                {[USER_ROLES.DONOR, USER_ROLES.RECEIVER, USER_ROLES.VOLUNTEER].map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={`p-2 text-xs border rounded-lg capitalize font-bold transition-all ${role === r ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white hover:bg-gray-50 text-gray-500'}`}>{r}</button>
                ))}
              </div>

              {role === USER_ROLES.RECEIVER && (
                <div className="animate-fadeIn mt-3 p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Are you an NGO?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isNgo" checked={formData.isNgo} onChange={() => setFormData({...formData, isNgo: true})} className="text-orange-600 focus:ring-orange-500 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isNgo" checked={!formData.isNgo} onChange={() => setFormData({...formData, isNgo: false})} className="text-orange-600 focus:ring-orange-500 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">No, Individual</span>
                    </label>
                  </div>
                  
                  {formData.isNgo && (
                    <div className="space-y-4 animate-slideUp pt-2">
                      <input type="text" required className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:border-orange-500 outline-none bg-white" placeholder="Name of NGO" value={formData.ngoName} onChange={e => setFormData({...formData, ngoName: e.target.value})} />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Children (1-17)</label>
                          <input type="number" required min="0" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:border-orange-500 outline-none bg-white" placeholder="e.g. 50" value={formData.capacityChildren} onChange={e => setFormData({...formData, capacityChildren: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Adults (18+)</label>
                          <input type="number" required min="0" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:border-orange-500 outline-none bg-white" placeholder="e.g. 100" value={formData.capacityAdults} onChange={e => setFormData({...formData, capacityAdults: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {locStatus === 'fetching' && <><Activity size={16} className="animate-spin text-orange-500"/> <span className="text-sm text-gray-600">Acquiring GPS location...</span></>}
                {locStatus === 'success' && <><MapPin size={16} className="text-green-500"/> <span className="text-sm text-green-700 font-bold">Live GPS Attached</span></>}
                {locStatus === 'error' && <><AlertTriangle size={16} className="text-orange-500"/> <span className="text-sm text-orange-700 font-bold">GPS Denied. Default location set.</span></>}
              </div>

            </div>
          )}

          {activeTab === 'forgot' && (
             <div className="space-y-4 animate-slideUp">
               <h3 className="text-center font-bold text-gray-800 text-lg">Reset Password</h3>
               <p className="text-center text-gray-500 text-sm">Enter your registered email to receive a secure reset code.</p>
               <input type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Registered Email Address" value={resetIdentifier} onChange={e => setResetIdentifier(e.target.value)} />
               <button type="button" onClick={() => setActiveTab('login')} className="block mx-auto text-sm font-bold text-gray-500 hover:text-gray-800">Back to Login</button>
             </div>
          )}

          <button disabled={isVerifying} type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isVerifying ? 'Connecting to Server...' : (activeTab === 'login' ? 'Sign In' : activeTab === 'forgot' ? 'Send Reset Code' : 'Create Account')}
          </button>
        </form>
      )}
    </div>
  );
};

const AuthPage = ({ onLogin, onRegister, onPasswordReset, availableUsers, onBack, showToast }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 animate-fadeIn">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">SharePlate Portal</h2>
      <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
        <AuthScreen onLogin={onLogin} onRegister={onRegister} onPasswordReset={onPasswordReset} availableUsers={availableUsers} showToast={showToast} />
      </div>
    </div>
  </div>
);

// --- APP CORE COMPONENTS ---

const FoodUpload = ({ user, onUploadComplete, onBack, showToast }) => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [batchItems, setBatchItems] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  const [metadata, setMetadata] = useState({ type: FOOD_TYPES[0], quantity: 0, prepTime: 0, packaging: 'open', storage: 'room' });

  const servingsAdults = metadata.quantity ? Math.floor(metadata.quantity * FOOD_SERVING_RATIOS[metadata.type].adult) : 0;
  const servingsChildren = metadata.quantity ? Math.floor(metadata.quantity * FOOD_SERVING_RATIOS[metadata.type].child) : 0;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }), (err) => console.log("Loc error", err));
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => { setImage(reader.result); setVideo(null); setStep(2); }; reader.readAsDataURL(file); }
  };
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => { setVideo(reader.result); setImage(null); setStep(2); }; reader.readAsDataURL(file); }
  };
  const startCamera = async (mode) => {
    setCameraMode(mode); setIsCameraOpen(true);
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: mode === 'video' }); if (videoRef.current) videoRef.current.srcObject = stream; } 
    catch (err) { alert("Camera access denied. Please use the file upload."); setIsCameraOpen(false); }
  };
  const stopCameraStream = () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); setIsCameraOpen(false); setIsRecording(false); };
  const capturePhoto = () => {
    const videoEl = videoRef.current; const canvasEl = canvasRef.current;
    if (videoEl && canvasEl) {
      const ctx = canvasEl.getContext('2d'); canvasEl.width = videoEl.videoWidth; canvasEl.height = videoEl.videoHeight;
      ctx.drawImage(videoEl, 0, 0); setImage(canvasEl.toDataURL('image/png')); setVideo(null); stopCameraStream(); setStep(2);
    }
  };
  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const mr = new MediaRecorder(videoRef.current.srcObject); mediaRecorderRef.current = mr; chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { const blob = new Blob(chunksRef.current, {type:'video/webm'}); const reader = new FileReader(); reader.onloadend = () => { setVideo(reader.result); setImage(null); stopCameraStream(); setStep(2); }; reader.readAsDataURL(blob); };
      mr.start(); setIsRecording(true);
    }
  };
  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop(); setIsRecording(false); };

  const runAIVerification = (e) => {
    e.preventDefault();
    if (!metadata.quantity || metadata.quantity <= 0) return showToast("Please enter a valid quantity.", "error");
    setLoading(true);
    setTimeout(() => {
      let score = 100; let status = 'Safe to Donate'; let reasons = [];
      if (metadata.prepTime > 12) { score -= 40; reasons.push('Prepared > 12 hours ago'); }
      if (metadata.storage === 'room' && metadata.prepTime > 4) { score -= 50; reasons.push('Room temp > 4h'); }
      if (score >= 80) status = 'Safe to Donate'; else if (score >= 50) status = 'Needs Manual Verification'; else status = 'Unsafe for Redistribution';
      setAnalysis({ score, status, reasons }); setLoading(false); setStep(3);
      showToast("AI Verification Complete", "success");
    }, 2000);
  };

  const handleAddToBatch = () => {
    setBatchItems([...batchItems, { 
      id: Date.now(), donorId: user.id, ...metadata, servingsAdults, servingsChildren, image, video, mediaType: video?'video':'image', ...analysis, location: location||user.location, timestamp: new Date().toISOString() 
    }]);
    setStep(1); setImage(null); setVideo(null); setAnalysis(null); setShowSummary(true);
    setMetadata({ type: FOOD_TYPES[0], quantity: 0, prepTime: 0, packaging: 'open', storage: 'room' });
  };

  if (showSummary) return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 max-w-2xl mx-auto animate-slideUp mt-8">
      <h2 className="font-bold text-xl mb-6 text-gray-800">Review Batch ({batchItems.length})</h2>
      <div className="space-y-3 mb-6 max-h-96 overflow-auto custom-scrollbar">
        {batchItems.map(i => (
          <div key={i.id} className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {i.mediaType==='image' ? <img src={i.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Video size={20} className="text-gray-400"/></div>}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{i.foodType}</h4>
              <p className="text-xs text-gray-500">{i.quantity}kg • ~{i.servingsAdults} Adults</p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${i.status.includes('Safe') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.score}/100</div>
            <button onClick={()=>setBatchItems(b=>b.filter(x=>x.id!==i.id))} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setShowSummary(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">Add More</button>
        <button onClick={() => { onUploadComplete(batchItems); showToast("Food Listed Successfully!", "success"); }} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30">Donate All</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto animate-fadeIn border border-gray-100 mt-8">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20} className="text-gray-600"/></button>
          <h3 className="font-bold text-lg text-gray-800">Donate Food</h3>
        </div>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Step {step}/3</span>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fadeIn">
          <div className="flex justify-between p-6 text-white"><span className="font-bold text-lg">Camera</span><button onClick={stopCameraStream} className="p-2 bg-white/20 rounded-full"><X size={20}/></button></div>
          <div className="flex-1 relative flex items-center justify-center bg-black"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/><canvas ref={canvasRef} className="hidden"/></div>
          <div className="p-10 flex justify-center bg-black/90 backdrop-blur-sm">
            {cameraMode === 'photo' ? (
              <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-[0_0_20px_rgba(255,255,255,0.5)] transform active:scale-95 transition-all"/>
            ) : (
              !isRecording ? <button onClick={startRecording} className="w-20 h-20 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"><div className="w-8 h-8 bg-white rounded-sm"></div></button> 
              : <button onClick={stopRecording} className="w-20 h-20 bg-white rounded-full border-4 border-red-600 flex items-center justify-center animate-pulse"><StopCircle size={40} className="text-red-600"/></button>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4 animate-slideUp">
            {batchItems.length > 0 && <button onClick={() => setShowSummary(true)} className="w-full bg-orange-50 text-orange-700 py-3 rounded-xl border border-orange-200 font-bold flex items-center justify-center gap-2 mb-4 hover:bg-orange-100 transition-colors"><List size={18}/> View Batch ({batchItems.length})</button>}
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => startCamera('photo')} className="border-2 border-dashed border-gray-200 p-8 text-center rounded-2xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-orange-600"/></div>
                <p className="font-bold text-gray-700">Take Photo</p>
              </div>
              <div onClick={() => startCamera('video')} className="border-2 border-dashed border-gray-200 p-8 text-center rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"><Video size={24} className="text-blue-600"/></div>
                <p className="font-bold text-gray-700">Record Video</p>
              </div>
            </div>
            <div className="text-center pt-2">
              <label className="text-sm text-gray-400 cursor-pointer hover:text-orange-600 transition-colors font-medium">
                Or upload from gallery
                <input type="file" className="hidden" accept="image/*,video/*" onChange={e => e.target.files[0]?.type.startsWith('video') ? handleVideoUpload(e) : handleImageUpload(e)}/>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={runAIVerification} className="space-y-6 animate-slideUp">
             <div className="h-48 bg-gray-100 rounded-xl overflow-hidden shadow-inner relative group">
                {video ? <video src={video} controls className="w-full h-full object-cover"/> : <img src={image} className="w-full h-full object-cover"/>}
                <button type="button" onClick={()=>setStep(1)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Food Type</label>
                 <select className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" onChange={e=>setMetadata({...metadata, type:e.target.value})}>{FOOD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prep Time (hrs)</label>
                 <input type="number" required className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 2" onChange={e=>setMetadata({...metadata, prepTime:e.target.value})}/>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity (kg/L/pieces)</label>
                 <input type="number" required step="0.5" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 5" onChange={e=>setMetadata({...metadata, quantity: parseFloat(e.target.value) || 0})}/>
               </div>
               <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex flex-col justify-center shadow-sm">
                 <span className="text-[10px] font-bold text-orange-800 uppercase mb-1">Auto-Calculated Servings</span>
                 <span className="text-sm text-orange-600 font-bold flex items-center gap-2">
                   🧑 ~{servingsAdults} Adults | 👧 ~{servingsChildren} Children
                 </span>
               </div>
             </div>
             <div className="flex gap-2">
               {['hot', 'chilled', 'room'].map(s => <button type="button" key={s} onClick={()=>setMetadata({...metadata, storage:s})} className={`flex-1 py-2 text-xs font-bold rounded-lg border uppercase ${metadata.storage===s ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white text-gray-500'}`}>{s}</button>)}
             </div>
             <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-black transition-colors shadow-lg">
               {loading ? <Activity size={20} className="animate-spin text-orange-500"/> : <ShieldCheck size={20} className="text-orange-400"/>} 
               {loading ? 'Analyzing...' : 'Run Safety Check'}
             </button>
          </form>
        )}

        {step === 3 && analysis && (
          <div className="text-center space-y-6 animate-slideUp">
            <div className={`inline-flex p-6 rounded-full shadow-inner ${analysis.status.includes('Safe')?'bg-green-100 text-green-600':'bg-red-100 text-red-600'}`}>
              {analysis.status.includes('Safe')?<CheckCircle size={64} className="animate-bounce"/>:<XCircle size={64}/>}
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">{analysis.score}<span className="text-lg text-gray-400">/100</span></h2>
              <p className="text-lg font-bold text-gray-700 mt-1">{analysis.status}</p>
              {analysis.reasons.length > 0 && <ul className="mt-4 text-left bg-red-50 p-4 rounded-lg text-sm text-red-700 list-disc pl-5">{analysis.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul>}
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Discard</button>
              <button onClick={handleAddToBatch} disabled={!analysis.status.includes('Safe')} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">Add to Batch</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DonorDashboard = ({ user, donations, setView }) => {
  const myDonations = donations.filter(d => d.donorId === user.id);
  const totalKg = myDonations.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0);
  const co2Saved = (totalKg * 2.5).toFixed(1); 
  const waterSaved = (totalKg * 800).toLocaleString(); 

  return (
    <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto px-4 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Hello, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1 font-medium">You've successfully verified {myDonations.length} donations.</p>
        </div>
        <button onClick={() => setView('upload')} className="bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all font-bold">
          <Plus size={20} /> New Donation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-full"><Leaf className="text-white" size={24}/></div>
          <div><p className="text-xs font-bold text-green-700 uppercase">CO₂ Prevented</p><p className="text-2xl font-black text-green-900">{co2Saved} <span className="text-sm font-medium">kg</span></p></div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200 flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-full"><Droplets className="text-white" size={24}/></div>
          <div><p className="text-xs font-bold text-blue-700 uppercase">Water Saved</p><p className="text-2xl font-black text-blue-900">{waterSaved} <span className="text-sm font-medium">Liters</span></p></div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-100 p-6 rounded-2xl border border-orange-200 flex items-center gap-4">
          <div className="bg-orange-500 p-3 rounded-full"><Package className="text-white" size={24}/></div>
          <div><p className="text-xs font-bold text-orange-700 uppercase">Food Rescued</p><p className="text-2xl font-black text-orange-900">{totalKg} <span className="text-sm font-medium">kg</span></p></div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-orange-500"/> Activity Log</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myDonations.map(d => (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{d.status}</span>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><ShieldCheck size={12}/> Score: {d.score}</span>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-900 mb-1">{d.foodType}</h4>
                <p className="text-xs font-medium text-gray-500 mb-4">{d.quantity}kg • Serves ~{d.servingsAdults} Adults</p>
                <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {new Date(d.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReceiverDashboard = ({ user, donations, onAcceptPickup, users }) => {
  const [tab, setTab] = useState('available');
  const available = donations.filter(d => !d.receiverId && d.status.includes('Safe'));
  const history = donations.filter(d => d.receiverId === user.id);

  return (
    <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold">{user.name}</h1>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/30 shadow-sm"><ShieldCheck size={14}/> Verified Partner</span>
          </div>
          <p className="opacity-90 mt-2 font-medium">Daily Target: {user.capacity} Meals (Children: {user.capacityChildren || 0}, Adults: {user.capacityAdults || 0})</p>
        </div>
        <Globe className="absolute -right-4 -bottom-4 text-white/10" size={150} />
      </div>

      <div className="flex bg-gray-200 p-1 rounded-xl mb-6 inline-flex w-full md:w-auto">
        <button className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === 'available' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setTab('available')}>Available Needs ({available.length})</button>
        <button className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === 'history' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setTab('history')}>My Received History</button>
      </div>

      {tab === 'available' && (
        <div className="grid gap-4 md:grid-cols-2 animate-slideUp">
          {available.map(d => {
            const donor = users.find(u => u.id === d.donorId);
            return (
              <div key={d.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-bold text-gray-800">{donor?.name}</span><span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">{donor?.type}</span></div>
                  <h4 className="font-extrabold text-gray-900 text-xl">{d.foodType}</h4>
                  <p className="text-sm font-medium text-gray-500 mt-1">{d.quantity}kg • Verified Safe Score: {d.score}</p>
                </div>
                <button onClick={() => onAcceptPickup(d.id)} className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-md">Request Volunteer Delivery</button>
              </div>
            );
          })}
          {available.length === 0 && <div className="col-span-full text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-2xl">No active donations currently match your criteria.</div>}
        </div>
      )}

      {tab === 'history' && (
        <div className="grid gap-4 md:grid-cols-2 animate-slideUp">
          {history.map(d => (
            <div key={d.id} className="bg-gray-50 border border-gray-200 p-5 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900">{d.foodType} <span className="text-sm font-normal text-gray-500">({d.quantity}kg)</span></h4>
                <p className="text-xs font-medium text-gray-500 mt-1">From: {users.find(u=>u.id === d.donorId)?.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${d.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
            </div>
          ))}
          {history.length === 0 && <div className="col-span-full text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-2xl">You have not claimed any donations yet.</div>}
        </div>
      )}
    </div>
  );
};

const VolunteerDashboard = ({ user, donations, users, onAcceptTask, onVolunteerAction }) => {
  const [activeTab, setActiveTab] = useState('available');
  
  const availableTasks = donations.filter(d => d.receiverId && !d.volunteerId && !d.delivered && d.status !== 'Removed by Admin');
  const myActiveTasks = donations.filter(d => d.volunteerId === user.id && !d.delivered);
  const completedTasks = donations.filter(d => d.volunteerId === user.id && d.delivered).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 mt-8 pb-20">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full"><Award className="text-blue-600" size={24}/></div>
          <div><p className="text-xs font-bold text-gray-500 uppercase">Deliveries</p><p className="text-2xl font-black text-gray-900">{completedTasks}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full"><Activity className="text-green-600" size={24}/></div>
          <div><p className="text-xs font-bold text-gray-500 uppercase">Impact Rating</p><p className="text-2xl font-black text-gray-900">{completedTasks * 50}</p></div>
        </div>
      </div>

      <div className="flex bg-gray-200 p-1 rounded-xl mb-6 inline-flex w-full md:w-auto">
        <button className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'available' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setActiveTab('available')}>Job Board ({availableTasks.length})</button>
        <button className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setActiveTab('active')}>Active Routes ({myActiveTasks.length})</button>
      </div>

      {activeTab === 'available' && (
        <div className="grid gap-4 md:grid-cols-2 animate-slideUp">
          {availableTasks.map(t => (
            <div key={t.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
              <h3 className="font-bold text-lg text-gray-900 mb-3 mt-2">{t.foodType} <span className="text-sm font-normal text-gray-500">({t.quantity}kg)</span></h3>
              <div className="flex flex-col gap-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-orange-500 min-w-max"/> 
                  <span className="font-bold text-gray-900 w-16">Pickup:</span> <span className="truncate">{users.find(u=>u.id===t.donorId)?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Truck size={16} className="text-green-500 min-w-max"/> 
                  <span className="font-bold text-gray-900 w-16">Dropoff:</span> <span className="truncate">{users.find(u=>u.id===t.receiverId)?.name}</span>
                </div>
              </div>
              <button onClick={() => onAcceptTask(t.id)} className="w-full bg-gray-900 text-white px-5 py-3 rounded-lg font-bold shadow hover:bg-black transition-colors">Accept Delivery Route</button>
            </div>
          ))}
          {availableTasks.length === 0 && <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 font-medium">No delivery requests currently open.</div>}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="grid gap-4 md:grid-cols-2 animate-slideUp">
          {myActiveTasks.map(t => (
            <div key={t.id} className="bg-orange-50 border border-orange-200 p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{t.foodType}</h3>
                  <p className="text-xs text-orange-800 font-bold mt-1 uppercase tracking-wide">Status: {t.status}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-orange-100 flex items-center gap-2 shadow-sm text-xs font-bold text-gray-600">
                  <span className={t.pickedUp ? "text-green-500" : "text-gray-300"}><CheckCircle size={14}/></span> Picked Up
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-5">
                <div className={`flex items-center gap-2 text-sm ${!t.pickedUp ? 'text-gray-900 font-bold' : 'text-gray-400 line-through'}`}>
                   1. {users.find(u=>u.id===t.donorId)?.name}
                </div>
                <div className={`flex items-center gap-2 text-sm ${t.pickedUp ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                   2. {users.find(u=>u.id===t.receiverId)?.name}
                </div>
              </div>

              {!t.pickedUp ? (
                <button onClick={() => onVolunteerAction(t.id, 'pickup')} className="w-full bg-orange-600 text-white px-5 py-3 rounded-lg font-bold shadow hover:bg-orange-700 transition-colors">Confirm Pickup at Donor</button>
              ) : (
                <button onClick={() => onVolunteerAction(t.id, 'deliver')} className="w-full bg-green-600 text-white px-5 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition-colors">Confirm Dropoff at NGO</button>
              )}
            </div>
          ))}
          {myActiveTasks.length === 0 && <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 font-medium">You have no active deliveries. Head to the Job Board!</div>}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ users, donations, onAdminAction }) => {
  const [adminTab, setAdminTab] = useState('overview'); 

  const stats = {
    totalFood: donations.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0),
    safeRate: donations.length ? Math.round((donations.filter(d => d.status.includes('Safe') || d.score >= 70).length / donations.length) * 100) : 0,
    activeUsers: users.length,
    completedDeliveries: donations.filter(d => d.delivered).length
  };

  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 mt-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2"><ShieldCheck className="text-orange-600"/> Master Admin Control</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Full visibility and enforcement over platform operations.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'donations', label: 'Network Donations', icon: Database },
          ].map(tab => (
            <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${adminTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {adminTab === 'overview' && (
        <div className="animate-slideUp space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
              <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wide">Total Rescued</h3>
              <p className="text-4xl font-black text-gray-900">{stats.totalFood} <span className="text-lg font-bold text-gray-400">kg</span></p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
              <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wide">Network Size</h3>
              <p className="text-4xl font-black text-gray-900">{stats.activeUsers} <span className="text-lg font-bold text-gray-400">Users</span></p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-green-500">
              <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wide">Safety Pass Rate</h3>
              <p className="text-4xl font-black text-gray-900">{stats.safeRate}%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-purple-500">
              <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wide">Deliveries Done</h3>
              <p className="text-4xl font-black text-gray-900">{stats.completedDeliveries}</p>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">User / Role</th>
                  <th className="p-4 font-bold">Contact Info</th>
                  <th className="p-4 font-bold">Joined Date</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold w-max mt-1">{u.role}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600"><div>{u.email}</div><div className="text-xs text-gray-400">{u.phone}</div></td>
                    <td className="p-4 text-sm text-gray-600"><div>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'}</div></td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.suspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== USER_ROLES.ADMIN && (
                        <button onClick={() => onAdminAction('toggleSuspend', u.id)} className={`text-xs font-bold px-3 py-1.5 rounded border transition-colors ${u.suspended ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-red-600 border-red-200 hover:bg-red-50'}`}>
                          {u.suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'donations' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">Donation Details</th>
                  <th className="p-4 font-bold">Donor</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{d.foodType} <span className="text-sm font-normal text-gray-500">({d.quantity}kg)</span></div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${d.score >= 80 ? 'bg-green-500' : d.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${d.score}%`}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">Score: {d.score}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">{getUserName(d.donorId)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.status.includes('Safe') || d.status === 'Delivered' ? 'bg-green-100 text-green-700' : d.status === 'Removed by Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {d.status !== 'Removed by Admin' && d.status !== 'Delivered' && (
                        <button onClick={() => onAdminAction('removeDonation', d.id)} className="text-xs font-bold px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                          Force Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP CONTAINER ---
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); 
  const [donations, setDonations] = useState([]); 
  const [toast, setToast] = useState(null);

  const [users, setUsers] = useState(() => INITIAL_USERS.map((u, index) => ({
    ...u, joinedAt: new Date(Date.now() - index * 86400000 * 2).toISOString() 
  })));

  // Your AWS Cloud IP
  const SERVER_URL = 'http://3.106.48.8:5000';

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    fetch(`${SERVER_URL}/api/donations`).then(res => res.json())
      .then(data => setDonations(data.length > 0 ? data : INITIAL_DONATIONS))
      .catch(() => setDonations(INITIAL_DONATIONS));
    fetch(`${SERVER_URL}/api/users`).then(res => res.json())
      .then(data => { if (data.length > 0) setUsers(prev => [...prev, ...data]); })
      .catch(() => console.log("Backend offline, using local users."));
  }, []);

  const handleLogin = (u) => { setUser(u); setView('dashboard'); showToast(`Welcome back, ${u.name}!`, "success"); };
  
  const handleRegister = (u) => { 
    fetch(`${SERVER_URL}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) })
    .then(res => res.json()).then(savedUser => setUsers([...users, savedUser])).catch(() => setUsers([...users, u]));
  };
  
  const handleUpload = (items) => { 
    const arr = Array.isArray(items) ? items : [items]; 
    arr.forEach(item => {
      fetch(`${SERVER_URL}/api/donations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
      .then(res => res.json()).then(savedItem => setDonations(prev => [savedItem, ...prev]))
      .catch(() => setDonations(prev => [{...item, id: Date.now()}, ...prev]));
    });
    setView('dashboard'); 
  };

  const updateDonationInCloud = (id, updates) => {
    fetch(`${SERVER_URL}/api/donations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
    .catch(() => console.log("Demo mode, cloud sync skipped"));
  };

  const handleAcceptPickup = (id) => {
    setDonations(d => d.map(i => i.id === id ? { ...i, claimedBy: user.id, receiverId: user.id, status: 'Awaiting Volunteer' } : i));
    updateDonationInCloud(id, { claimedBy: user.id, receiverId: user.id, status: 'Awaiting Volunteer' });
    showToast("Donation Claimed! Alert sent to volunteers.", "success");
  };

  const handleAcceptTask = (id) => {
    setDonations(d => d.map(i => i.id === id ? { ...i, volunteerId: user.id, status: 'Driver Assigned' } : i));
    updateDonationInCloud(id, { volunteerId: user.id, status: 'Driver Assigned' });
    showToast("Route Accepted! Drive safely.", "success");
  };

  const handleVolunteerAction = (id, action) => {
    if (action === 'pickup') {
      setDonations(d => d.map(i => i.id === id ? { ...i, pickedUp: true, status: 'In Transit' } : i));
      updateDonationInCloud(id, { pickedUp: true, status: 'In Transit' });
      showToast("Picked up from Donor!", "success");
    } else if (action === 'deliver') {
      setDonations(d => d.map(i => i.id === id ? { ...i, delivered: true, status: 'Delivered' } : i));
      updateDonationInCloud(id, { delivered: true, status: 'Delivered' });
      showToast("Delivery complete. Impact added!", "success");
    }
  };

  const handleAdminAction = (action, id) => {
    if (action === 'toggleSuspend') {
      setUsers(u => u.map(x => x.id === id ? { ...x, suspended: !x.suspended } : x));
      showToast("User account status updated.", "success");
    } else if (action === 'removeDonation') {
      setDonations(d => d.map(i => i.id === id ? { ...i, status: 'Removed by Admin' } : i));
      updateDonationInCloud(id, { status: 'Removed by Admin' });
      showToast("Donation forcefully removed from network.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <GlobalStyles />
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
      <Navbar user={user} onLogout={()=>{setUser(null); setView('landing'); showToast("Logged out successfully.", "success");}} setView={setView} onLoginClick={() => setView('auth')} />
      <main className="flex-grow pt-16">
        {view === 'landing' && <LandingPage onGetStarted={() => setView('auth')} onLearnMore={() => setView('howItWorks')} availableUsers={users} />}
        {view === 'howItWorks' && <HowItWorksPage onGetStarted={() => setView('auth')} />}
        {view === 'aboutUs' && <AboutUsPage />}
        {view === 'auth' && <AuthPage onLogin={handleLogin} onRegister={handleRegister} onPasswordReset={()=>{}} availableUsers={users} onBack={() => setView('landing')} showToast={showToast} />}
        
        {view === 'dashboard' && user?.role === USER_ROLES.DONOR && <DonorDashboard user={user} donations={donations} setView={setView} />}
        {view === 'upload' && user?.role === USER_ROLES.DONOR && <FoodUpload user={user} onUploadComplete={handleUpload} onBack={() => setView('dashboard')} showToast={showToast} />}
        
        {view === 'dashboard' && user?.role === USER_ROLES.RECEIVER && <ReceiverDashboard user={user} donations={donations} onAcceptPickup={handleAcceptPickup} users={users} showToast={showToast} />}
        
        {view === 'dashboard' && user?.role === USER_ROLES.VOLUNTEER && <VolunteerDashboard user={user} donations={donations} users={users} onAcceptTask={handleAcceptTask} onVolunteerAction={handleVolunteerAction} />}
        
        {view === 'dashboard' && user?.role === USER_ROLES.ADMIN && <AdminDashboard users={users} donations={donations} onAdminAction={handleAdminAction} showToast={showToast} />}
      </main>
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto text-center text-sm text-gray-400 font-medium">
        <p>© 2026 SharePlate Enterprise Capstone. All rights reserved.</p>
      </footer>
    </div>
  );
}