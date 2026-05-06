import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, MapPin, Upload, CheckCircle, AlertTriangle, XCircle, User, LogOut, 
  Menu, Search, Clock, Package, Users, Navigation, ShieldCheck, Activity, 
  FileText, Globe, Info, Heart, Truck, Zap, BarChart3, ChevronRight, 
  Smartphone, Mail, Lock, ArrowLeft, RefreshCw, Check, KeyRound, Video, 
  X, StopCircle, PlayCircle, Plus, Trash2, List, UtensilsCrossed, Bike, ArrowRight,
  Lightbulb, Database, ClipboardList
} from 'lucide-react';

// --- GLOBAL STYLES FOR ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
    
    @keyframes pulse-soft {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    .animate-pulse-soft { animation: pulse-soft 2s infinite; }

    .glass-panel {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 10px;
    }
  `}</style>
);

// --- MOCK DATA & CONFIG ---

const USER_ROLES = {
  DONOR: 'donor',
  RECEIVER: 'receiver',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin'
};

const FOOD_TYPES = [
  'Rice / Grains', 'Curry / Gravy', 'Roti / Bread', 'Dessert', 'Snacks', 'Raw Vegetables', 'Mixed Meal'
];

// Calculation mapping: How many servings per 1 kg/liter for Adults vs Children
const FOOD_SERVING_RATIOS = {
  'Rice / Grains': { adult: 6, child: 8 },      
  'Curry / Gravy': { adult: 4, child: 6 },      
  'Roti / Bread': { adult: 8, child: 12 },      
  'Dessert': { adult: 10, child: 15 },          
  'Snacks': { adult: 10, child: 15 },           
  'Raw Vegetables': { adult: 5, child: 7 },     
  'Mixed Meal': { adult: 2.5, child: 4 }        
};

const PACKAGING_TYPES = [
  { id: 'sealed', label: 'Sealed / Unopened', risk: 0 },
  { id: 'secure', label: 'Securely Packed (Home)', risk: 10 },
  { id: 'open', label: 'Open / Loose', risk: 40 }
];

const STORAGE_CONDITIONS = [
  { id: 'hot', label: 'Hot (> 60°C)', risk: 0 },
  { id: 'chilled', label: 'Chilled / Refrigerated', risk: 5 },
  { id: 'room', label: 'Room Temperature', risk: 20 }
];

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop'  
];

const INITIAL_USERS = [
  { id: 1, name: 'Sasi Kapoor', role: USER_ROLES.DONOR, type: 'Individual', email: 'sasi@lpu.in', phone: '9347556855', password: 'password', location: { lat: 31.255, lng: 75.705 } }, 
  { id: 2, name: 'Hope Foundation', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 200, capacityChildren: 100, capacityAdults: 100, email: 'help@hope.org', phone: '7032374400', password: 'password', location: { lat: 31.260, lng: 75.710 }, status: 'Active Now', demand: 'High' },
  { id: 3, name: 'Safe Admin', role: USER_ROLES.ADMIN, email: 'admin@shareplate.org', phone: '0000000000', password: 'password' },
  { id: 4, name: 'City Care Trust', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 50, capacityChildren: 0, capacityAdults: 50, email: 'care@city.org', phone: '9876543210', password: 'password', location: { lat: 31.250, lng: 75.700 }, status: 'Last active 5m ago', demand: 'Moderate' },
  { id: 5, name: 'Global Feed Initiative', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 500, capacityChildren: 200, capacityAdults: 300, email: 'contact@globalfeed.org', phone: '1122334455', password: 'password', location: { lat: 31.270, lng: 75.720 }, status: 'Active Now', demand: 'Critical' },
  { id: 6, name: 'Rahul Verma', role: USER_ROLES.VOLUNTEER, type: 'Individual', email: 'volunteer@shareplate.org', phone: '9988776655', password: 'password', location: { lat: 31.258, lng: 75.708 } },
  { id: 7, name: 'Green Leaf Restaurant', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'greenleaf@demo.com', phone: '9876543211', password: 'password', location: { lat: 31.258, lng: 75.712 } },
  { id: 8, name: 'Ravi Sharma', role: USER_ROLES.DONOR, type: 'Individual', email: 'ravi@demo.com', phone: '9876543212', password: 'password', location: { lat: 31.250, lng: 75.700 } },
  { id: 9, name: 'Grand Wedding Hall', role: USER_ROLES.DONOR, type: 'Event', email: 'grandwed@demo.com', phone: '9876543213', password: 'password', location: { lat: 31.265, lng: 75.725 } },
  { id: 10, name: 'Smile Kids Orphanage', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 130, capacityChildren: 120, capacityAdults: 10, email: 'smile@demo.org', phone: '9876500001', password: 'password', location: { lat: 31.240, lng: 75.720 }, status: 'Active Now', demand: 'High' },
  { id: 11, name: 'Asha Old Age Home', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 60, capacityChildren: 0, capacityAdults: 60, email: 'asha@demo.org', phone: '9876500002', password: 'password', location: { lat: 31.250, lng: 75.690 }, status: 'Active Now', demand: 'Moderate' },
  { id: 12, name: 'Jalandhar Slum Relief', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 350, capacityChildren: 200, capacityAdults: 150, email: 'jsrelief@demo.org', phone: '9876500003', password: 'password', location: { lat: 31.265, lng: 75.730 }, status: 'Last active 1h ago', demand: 'Critical' },
  { id: 13, name: 'Helping Hands Trust', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 80, capacityChildren: 40, capacityAdults: 40, email: 'hands@demo.org', phone: '9876500004', password: 'password', location: { lat: 31.245, lng: 75.705 }, status: 'Active Now', demand: 'High' },
  { id: 14, name: 'Food For All Foundation', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 400, capacityChildren: 100, capacityAdults: 300, email: 'ffa@demo.org', phone: '9876500005', password: 'password', location: { lat: 31.275, lng: 75.715 }, status: 'Active Now', demand: 'Critical' },
  { id: 15, name: 'Sewa Society', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 200, capacityChildren: 80, capacityAdults: 120, email: 'sewa@demo.org', phone: '9876500006', password: 'password', location: { lat: 31.235, lng: 75.685 }, status: 'Active Now', demand: 'Moderate' },
  { id: 16, name: 'Navjeevan Shelter', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 70, capacityChildren: 50, capacityAdults: 20, email: 'navjeevan@demo.org', phone: '9876500007', password: 'password', location: { lat: 31.280, lng: 75.700 }, status: 'Active Now', demand: 'High' },
  { id: 17, name: 'Umeed Care Center', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 100, capacityChildren: 30, capacityAdults: 70, email: 'umeed@demo.org', phone: '9876500008', password: 'password', location: { lat: 31.260, lng: 75.680 }, status: 'Last active 2h ago', demand: 'Moderate' },
  { id: 18, name: 'Bright Future Home', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 165, capacityChildren: 150, capacityAdults: 15, email: 'bright@demo.org', phone: '9876500009', password: 'password', location: { lat: 31.290, lng: 75.740 }, status: 'Active Now', demand: 'High' },
  { id: 19, name: 'Community Kitchen Jal.', role: USER_ROLES.RECEIVER, type: 'NGO', capacity: 650, capacityChildren: 250, capacityAdults: 400, email: 'ckj@demo.org', phone: '9876500010', password: 'password', location: { lat: 31.255, lng: 75.750 }, status: 'Active Now', demand: 'Critical' },
  { id: 20, name: 'Sunrise Cafe', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'sunrise@demo.com', phone: '9876500020', password: 'password', location: { lat: 31.252, lng: 75.702 } },
  { id: 21, name: 'Urban Harvest', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'urban@demo.com', phone: '9876500021', password: 'password', location: { lat: 31.261, lng: 75.718 } },
  { id: 22, name: 'Priya Singh', role: USER_ROLES.DONOR, type: 'Individual', email: 'priya@demo.com', phone: '9876500022', password: 'password', location: { lat: 31.245, lng: 75.695 } },
  { id: 23, name: 'Bakers Point', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'bakers@demo.com', phone: '9876500023', password: 'password', location: { lat: 31.275, lng: 75.725 } },
  { id: 24, name: 'Tandoori Nights', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'tandoori@demo.com', phone: '9876500024', password: 'password', location: { lat: 31.259, lng: 75.710 } },
  { id: 25, name: 'Corporate Event Plaza', role: USER_ROLES.DONOR, type: 'Event', email: 'plaza@demo.com', phone: '9876500025', password: 'password', location: { lat: 31.280, lng: 75.730 } },
  { id: 26, name: 'Amrit Sweets', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'amrit@demo.com', phone: '9876500026', password: 'password', location: { lat: 31.240, lng: 75.685 } },
  { id: 27, name: 'Vikram Mehta', role: USER_ROLES.DONOR, type: 'Individual', email: 'vikram@demo.com', phone: '9876500027', password: 'password', location: { lat: 31.265, lng: 75.700 } },
  { id: 28, name: 'Hotel Grand', role: USER_ROLES.DONOR, type: 'Event', email: 'grand@demo.com', phone: '9876500028', password: 'password', location: { lat: 31.255, lng: 75.740 } },
  { id: 29, name: 'Spice Route', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'spice@demo.com', phone: '9876500029', password: 'password', location: { lat: 31.248, lng: 75.715 } },
  { id: 30, name: 'Fresh Farms', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'fresh@demo.com', phone: '9876500030', password: 'password', location: { lat: 31.270, lng: 75.690 } },
  { id: 31, name: 'Neha Sharma', role: USER_ROLES.DONOR, type: 'Individual', email: 'neha@demo.com', phone: '9876500031', password: 'password', location: { lat: 31.250, lng: 75.720 } },
  { id: 32, name: 'Royal Banquet', role: USER_ROLES.DONOR, type: 'Event', email: 'royal@demo.com', phone: '9876500032', password: 'password', location: { lat: 31.285, lng: 75.705 } },
  { id: 33, name: 'Little Italy', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'italy@demo.com', phone: '9876500033', password: 'password', location: { lat: 31.262, lng: 75.735 } },
  { id: 34, name: 'Healthy Bites', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'healthy@demo.com', phone: '9876500034', password: 'password', location: { lat: 31.242, lng: 75.700 } },
  { id: 35, name: 'Mega Mart Deli', role: USER_ROLES.DONOR, type: 'Restaurant', email: 'megamart@demo.com', phone: '9876500035', password: 'password', location: { lat: 31.258, lng: 75.680 } }
];

const INITIAL_DONATIONS = [
  { id: 101, donorId: 1, foodType: 'Rice / Grains', quantity: 5, servingsAdults: 30, servingsChildren: 40, prepTime: '2 hours ago', packaging: 'secure', storage: 'hot', status: 'Safe to Donate', score: 95, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=400', mediaType: 'image', timestamp: new Date().toISOString(), location: { lat: 31.255, lng: 75.705 }, claimedBy: 2, pickedUp: false, delivered: true },
  { id: 102, donorId: 1, foodType: 'Mixed Meal', quantity: 2, servingsAdults: 5, servingsChildren: 8, prepTime: '8 hours ago', packaging: 'open', storage: 'room', status: 'Unsafe for Redistribution', score: 30, image: 'https://images.unsplash.com/photo-1584844308364-7c9802766867?auto=format&fit=crop&q=80&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString(), location: { lat: 31.255, lng: 75.705 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 103, donorId: 1, foodType: 'Raw Vegetables', quantity: 15, servingsAdults: 75, servingsChildren: 105, prepTime: '1 hour ago', packaging: 'sealed', storage: 'chilled', status: 'Safe to Donate', score: 100, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 1800000).toISOString(), location: { lat: 31.255, lng: 75.705 }, claimedBy: 4, pickedUp: true, delivered: false },
  { id: 104, donorId: 7, foodType: 'Curry / Gravy', quantity: 10, servingsAdults: 40, servingsChildren: 60, prepTime: '1 hour ago', packaging: 'sealed', storage: 'hot', status: 'Safe to Donate', score: 98, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString(), location: { lat: 31.260, lng: 75.715 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 105, donorId: 8, foodType: 'Roti / Bread', quantity: 4, servingsAdults: 32, servingsChildren: 48, prepTime: '3 hours ago', packaging: 'secure', storage: 'room', status: 'Safe to Donate', score: 85, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 7200000).toISOString(), location: { lat: 31.250, lng: 75.700 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 106, donorId: 9, foodType: 'Dessert', quantity: 8, servingsAdults: 80, servingsChildren: 120, prepTime: '2 hours ago', packaging: 'sealed', storage: 'chilled', status: 'Safe to Donate', score: 99, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 5400000).toISOString(), location: { lat: 31.265, lng: 75.725 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 107, donorId: 7, foodType: 'Snacks', quantity: 5, servingsAdults: 50, servingsChildren: 75, prepTime: '4 hours ago', packaging: 'secure', storage: 'room', status: 'Safe to Donate', score: 88, image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 10800000).toISOString(), location: { lat: 31.255, lng: 75.695 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 108, donorId: 8, foodType: 'Raw Vegetables', quantity: 12, servingsAdults: 60, servingsChildren: 84, prepTime: '10 hours ago', packaging: 'open', storage: 'room', status: 'Safe to Donate', score: 82, image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 43200000).toISOString(), location: { lat: 31.245, lng: 75.710 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 109, donorId: 9, foodType: 'Mixed Meal', quantity: 20, servingsAdults: 50, servingsChildren: 80, prepTime: '1.5 hours ago', packaging: 'secure', storage: 'hot', status: 'Safe to Donate', score: 94, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 4500000).toISOString(), location: { lat: 31.270, lng: 75.705 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 110, donorId: 7, foodType: 'Rice / Grains', quantity: 15, servingsAdults: 90, servingsChildren: 120, prepTime: '3.5 hours ago', packaging: 'sealed', storage: 'room', status: 'Safe to Donate', score: 89, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 12600000).toISOString(), location: { lat: 31.260, lng: 75.690 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 111, donorId: 8, foodType: 'Curry / Gravy', quantity: 6, servingsAdults: 24, servingsChildren: 36, prepTime: '2.5 hours ago', packaging: 'secure', storage: 'hot', status: 'Safe to Donate', score: 91, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 9000000).toISOString(), location: { lat: 31.258, lng: 75.712 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 112, donorId: 1, foodType: 'Snacks', quantity: 3, servingsAdults: 30, servingsChildren: 45, prepTime: '5 hours ago', packaging: 'sealed', storage: 'room', status: 'Safe to Donate', score: 86, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 18000000).toISOString(), location: { lat: 31.248, lng: 75.708 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 113, donorId: 9, foodType: 'Dessert', quantity: 10, servingsAdults: 100, servingsChildren: 150, prepTime: '1 hour ago', packaging: 'secure', storage: 'chilled', status: 'Safe to Donate', score: 97, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString(), location: { lat: 31.252, lng: 75.720 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 114, donorId: 20, foodType: 'Roti / Bread', quantity: 5, servingsAdults: 40, servingsChildren: 60, prepTime: '1.5 hours ago', packaging: 'secure', storage: 'hot', status: 'Safe to Donate', score: 92, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 5400000).toISOString(), location: { lat: 31.252, lng: 75.702 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 115, donorId: 21, foodType: 'Mixed Meal', quantity: 15, servingsAdults: 37, servingsChildren: 60, prepTime: '2 hours ago', packaging: 'sealed', storage: 'chilled', status: 'Safe to Donate', score: 98, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 7200000).toISOString(), location: { lat: 31.261, lng: 75.718 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 116, donorId: 23, foodType: 'Dessert', quantity: 6, servingsAdults: 60, servingsChildren: 90, prepTime: '4 hours ago', packaging: 'secure', storage: 'chilled', status: 'Safe to Donate', score: 89, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 14400000).toISOString(), location: { lat: 31.275, lng: 75.725 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 117, donorId: 24, foodType: 'Curry / Gravy', quantity: 8, servingsAdults: 32, servingsChildren: 48, prepTime: '3 hours ago', packaging: 'sealed', storage: 'hot', status: 'Safe to Donate', score: 94, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 10800000).toISOString(), location: { lat: 31.259, lng: 75.710 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 118, donorId: 26, foodType: 'Snacks', quantity: 4, servingsAdults: 40, servingsChildren: 60, prepTime: '5 hours ago', packaging: 'secure', storage: 'room', status: 'Safe to Donate', score: 84, image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 18000000).toISOString(), location: { lat: 31.240, lng: 75.685 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 119, donorId: 28, foodType: 'Rice / Grains', quantity: 25, servingsAdults: 150, servingsChildren: 200, prepTime: '1 hour ago', packaging: 'sealed', storage: 'hot', status: 'Safe to Donate', score: 99, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString(), location: { lat: 31.255, lng: 75.740 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 120, donorId: 30, foodType: 'Raw Vegetables', quantity: 18, servingsAdults: 90, servingsChildren: 126, prepTime: '12 hours ago', packaging: 'open', storage: 'room', status: 'Safe to Donate', score: 75, image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 43200000).toISOString(), location: { lat: 31.270, lng: 75.690 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 121, donorId: 32, foodType: 'Mixed Meal', quantity: 30, servingsAdults: 75, servingsChildren: 120, prepTime: '2.5 hours ago', packaging: 'secure', storage: 'hot', status: 'Safe to Donate', score: 91, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 9000000).toISOString(), location: { lat: 31.285, lng: 75.705 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 122, donorId: 33, foodType: 'Roti / Bread', quantity: 7, servingsAdults: 56, servingsChildren: 84, prepTime: '3.5 hours ago', packaging: 'sealed', storage: 'room', status: 'Safe to Donate', score: 87, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 12600000).toISOString(), location: { lat: 31.262, lng: 75.735 }, claimedBy: null, pickedUp: false, delivered: false },
  { id: 123, donorId: 35, foodType: 'Dessert', quantity: 12, servingsAdults: 120, servingsChildren: 180, prepTime: '6 hours ago', packaging: 'secure', storage: 'chilled', status: 'Safe to Donate', score: 88, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400', mediaType: 'image', timestamp: new Date(Date.now() - 21600000).toISOString(), location: { lat: 31.258, lng: 75.680 }, claimedBy: null, pickedUp: false, delivered: false }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return (R * c).toFixed(1);
};

// --- COMPONENTS ---

const Navbar = ({ user, onLogout, setView, onLoginClick }) => (
  <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 relative">
        <div className="flex items-center cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-orange-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 shadow-md">
            <UtensilsCrossed size={20} className="text-white" />
          </div>
          <span className="ml-2 font-bold text-xl tracking-tight text-gray-800 group-hover:text-orange-600 transition-colors">SharePlate</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <button onClick={() => setView('landing')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">Home</button>
          <button onClick={() => setView('howItWorks')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">How it Works</button>
          <button onClick={() => setView('aboutUs')} className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">About Us</button>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('dashboard')} className="hidden md:block text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Dashboard</button>
            <span className="hidden md:block text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200 uppercase">{user.role}</span>
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-300" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Login / Join
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
          const nearby = availableUsers
            .filter(u => u.role === USER_ROLES.RECEIVER)
            .map(ngo => ({ ...ngo, distance: calculateDistance(latitude, longitude, ngo.location.lat, ngo.location.lng) }))
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .slice(0, 3);
          setNearbyNGOs(nearby);
          setLocStatus("success");
        },
        (err) => {
          setLocStatus("error");
          setLocationError("Location access denied. Enable GPS to see data.");
        }
      );
    } else {
      setLocStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (landingSection === 'gps') {
      handleLocateNGOs();
    }
  }, [landingSection, availableUsers]);

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
            <span className="text-sm font-medium tracking-wide">Verified Food Safety Standard</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Stop Waste. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Feed Hope.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">
            Connect surplus food with local communities in real-time. Verified safe by the system, delivered by volunteers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button onClick={onGetStarted} className="group relative inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center">
              Start Donating <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onLearnMore} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Info size={20} /> Discover How
            </button>
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
                      <div 
                        key={index} 
                        className="bg-orange-900/40 backdrop-blur-sm border border-orange-500/30 p-4 rounded-lg flex items-center gap-4 hover:translate-x-2 transition-transform duration-300 hover:bg-orange-900/60"
                      >
                        <div className="bg-orange-500/20 p-2 rounded-full">
                          <Heart size={18} className="text-orange-300 fill-orange-300/20" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{item.u} <span className="text-gray-300 font-normal">{item.a}</span></p>
                          <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                            <Clock size={10} /> {item.t}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {landingSection === 'gps' && (
                <div className="animate-slideUp space-y-4">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <MapPin className="text-orange-400" /> Nearby Help
                  </h2>
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
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                  {ngo.status || "Active Now"}
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
                <Globe className="w-64 h-64 text-orange-500/50" />
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

const HowItWorksPage = ({ onGetStarted }) => (
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
        {[
          { step: 1, title: '1. Data Acquisition Module', desc: 'The donor uploads a real-time photo or video of the surplus food through the app. Alongside the visual input, the donor provides critical contextual metadata, including food type, preparation time, storage condition (e.g., room temperature or chilled), packaging integrity, and estimated serving capacity.', icon: Camera },
          { step: 2, title: '2. Image & Metadata Processing', desc: 'The system pre-processes the inputs. It evaluates the image for visual freshness cues—such as color consistency, surface condition, and visible contamination. Simultaneously, the metadata is processed to establish contextual risk factors, like elapsed time since preparation and storage vulnerability.', icon: FileText },
          { step: 3, title: '3. Multimodal Fusion Engine', desc: 'The system does not rely on just one input. The multimodal fusion engine intelligently integrates the extracted visual features with the contextual metadata, creating a unified representation of the food\'s overall condition and risk profile.', icon: Activity },
          { step: 4, title: '4. Deduction-Based Risk Scoring', desc: 'Starting with a perfect safety score of 100, the system applies specific deductions based on identified risk factors (e.g., deducting points for prolonged room temperature storage). A Contamination Override Mechanism ensures that if severe spoilage like mold is detected, the score instantly drops to zero.', icon: ShieldCheck },
          { step: 5, title: '5. Safety Classification', desc: 'Based on the final computed score, the food is categorized into three strict classes: Safe to Donate (Score ≥ 70), Needs Manual Check (Score 40-69), or Unsafe for Redistribution (Score < 40). Only safe food moves forward in the redistribution cycle.', icon: CheckCircle },
          { step: 6, title: '6. Intelligent NGO Allocation', desc: 'Once verified as safe, the matching engine cross-references the donated food\'s quantity with the real-time capacities and geolocations of registered NGOs. It instantly alerts the nearest NGO that has the exact capacity requirement to avoid secondary wastage.', icon: MapPin },
          { step: 7, title: '7. Volunteer Dispatch', desc: 'Upon NGO acceptance, the system automatically assigns and routes a registered volunteer via GPS. The volunteer picks up the verified food and safely delivers it, tracking progress in real-time to complete the zero-waste lifecycle.', icon: Truck }
        ].map((item, idx) => (
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
        <button onClick={onGetStarted} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 inline-flex items-center gap-2">
          Start Donating Now <ChevronRight size={20} />
        </button>
      </div>
    </div>
  </div>
);

const AboutUsPage = () => {
  const founders = [
    { 
      name: "Ronak Reddy", 
      role: "Founder (Shareplate)", 
      desc: "The visionary behind the SharePlate platform. Passionate about leveraging technology to achieve zero hunger, Ronak leads our core mission to bridge the gap between surplus food and scarcity.", 
      img: "https://i.ibb.co/ZzXVxgwF/Ronak.jpg" 
    },
    { 
      name: "Sairi Sathvik", 
      role: "CEO", 
      desc: "Sairi leads the strategic execution and overall operations of SharePlate. He ensures seamless connectivity, trust, and logistical efficiency between food donors, volunteers, and receiving NGOs.", 
      img: "https://i.ibb.co/LhSjRQvs/Hero.jpg" 
    },
    { 
      name: "Sasi Kapoor", 
      role: "Managing Director (Information Service)", 
      desc: "The technical architect of our multimodal data systems and intelligent NGO-matching engine. Sasi manages real-time data flows, platform stability, and the complex routing algorithms.", 
      img: "https://i.ibb.co/My7bzB5t/Sasi.jpg" 
    },
    { 
      name: "Tharak Reddy", 
      role: "Managing Director (Food Quality)", 
      desc: "Oversees the Context-Aware Risk Scoring models. Tharak defines strict food safety parameters to guarantee that only verifiably safe, quality food is approved for community redistribution.", 
      img: "https://i.ibb.co/v64MMWRz/Tharak.jpg" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        
        {/* Story Section */}
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

        {/* Founders Grid */}
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

// --- AUTH COMPONENTS ---

const AuthScreen = ({ onLogin, onRegister, onPasswordReset, availableUsers }) => {
  const [activeTab, setActiveTab] = useState('login'); 
  const [role, setRole] = useState(USER_ROLES.DONOR);
  const [formData, setFormData] = useState({ 
    email: '', name: '', password: '', phone: '', 
    isNgo: false, ngoName: '', capacityChildren: '', capacityAdults: '' 
  });
  const [loginError, setLoginError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  const [userLocation, setUserLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('idle'); 

  useEffect(() => { 
    setOtpSent(false); setEnteredOtp(''); setLoginError(''); setRegSuccess(''); 
    setResetIdentifier(''); setNewResetPassword(''); 
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
            console.log("GPS error", err);
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
    e.preventDefault(); setLoginError('');
    const foundUser = availableUsers.find(u => (u.email === formData.email || u.phone === formData.email) && u.password === formData.password);
    if (foundUser) onLogin(foundUser); else setLoginError("Invalid credentials.");
  };

  const handleRegisterFlow = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!formData.name || !formData.password || !formData.phone || !formData.email) return alert("All base fields required");
      if (role === USER_ROLES.RECEIVER && formData.isNgo && (!formData.ngoName || formData.capacityChildren === '' || formData.capacityAdults === '')) return alert("Please fill out the NGO details");

      setIsVerifying(true); 
      setTimeout(() => { 
        setGeneratedOtp(Math.floor(1000 + Math.random() * 9000).toString()); 
        setOtpSent(true); 
        setIsVerifying(false); 
      }, 1500);
    } else {
      if (enteredOtp === generatedOtp) {
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
          verified: true 
        };
        onRegister(newUser);
        setRegSuccess("Success! Login now."); 
        setOtpSent(false); 
        setActiveTab('login');
      } else alert("Incorrect OTP");
    }
  };

  const handleForgotFlow = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!availableUsers.find(u => u.email === resetIdentifier || u.phone === resetIdentifier)) return setLoginError("Account not found");
      setIsVerifying(true); 
      setTimeout(() => { 
        setGeneratedOtp(Math.floor(1000 + Math.random() * 9000).toString()); 
        setOtpSent(true); 
        setIsVerifying(false); 
      }, 1500);
    } else {
      if (enteredOtp === generatedOtp) { 
        onPasswordReset(resetIdentifier, newResetPassword); 
        setRegSuccess("Password updated!"); 
        setActiveTab('login'); 
      } 
      else alert("Incorrect OTP");
    }
  };

  return (
    <div className="w-full">
      {/* TABS */}
      {activeTab !== 'forgot' && !otpSent && (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('login')}>Login</button>
          <button className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('register')}>Register</button>
        </div>
      )}

      {/* FORMS */}
      {otpSent ? (
         <div className="animate-fadeIn space-y-5">
           <button onClick={() => setOtpSent(false)} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800"><ArrowLeft size={16}/> Back</button>
           <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
             <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Demo Mode</p>
             <p className="text-2xl font-mono font-bold text-yellow-900 tracking-widest">{generatedOtp}</p>
           </div>
           <input type="text" className="w-full border-2 border-gray-200 p-3 rounded-xl text-center text-2xl tracking-widest font-mono focus:border-orange-500 focus:outline-none" placeholder="0000" maxLength={4} value={enteredOtp} onChange={e => setEnteredOtp(e.target.value)} />
           {activeTab === 'forgot' && <input type="password" className="w-full border p-3 rounded-xl focus:border-orange-500 outline-none" placeholder="New Password" value={newResetPassword} onChange={e => setNewResetPassword(e.target.value)} />}
           <button onClick={activeTab === 'forgot' ? handleForgotFlow : handleRegisterFlow} className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5">Verify & Continue</button>
         </div>
      ) : (
        <form onSubmit={activeTab === 'login' ? handleLoginSubmit : activeTab === 'forgot' ? handleForgotFlow : handleRegisterFlow} className="space-y-4">
          {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertTriangle size={16}/> {loginError}</div>}
          {regSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2"><CheckCircle size={16}/> {regSuccess}</div>}

          {activeTab === 'login' && (
             <>
               <div className="relative group">
                 <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                 <input type="text" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" placeholder="Email or Phone" onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                 <input type="password" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
               </div>
               <div className="text-right"><button type="button" onClick={() => setActiveTab('forgot')} className="text-sm text-orange-600 font-semibold hover:underline">Forgot Password?</button></div>
             </>
          )}

          {activeTab === 'register' && (
            <div className="space-y-3 animate-slideUp">
              <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Create Password" onChange={e => setFormData({...formData, password: e.target.value})} />
              
              <label className="block text-xs font-bold text-gray-500 uppercase mt-2">I want to...</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: USER_ROLES.DONOR, label: 'Donor' },
                  { id: USER_ROLES.RECEIVER, label: 'Receiver' },
                  { id: USER_ROLES.VOLUNTEER, label: 'Volunteer' }
                ].map((r) => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`p-2 text-xs border rounded-lg capitalize font-medium transition-all ${role === r.id ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white hover:bg-gray-50'}`}>{r.label}</button>
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
                {locStatus === 'success' && <><MapPin size={16} className="text-green-500"/> <span className="text-sm text-green-700 font-medium">Live GPS Location Attached</span></>}
                {locStatus === 'error' && <><AlertTriangle size={16} className="text-orange-500"/> <span className="text-sm text-orange-700">GPS Denied. Using Default Location.</span></>}
              </div>

            </div>
          )}

          {activeTab === 'forgot' && (
             <div className="space-y-4 animate-slideUp">
               <h3 className="text-center font-bold text-gray-800 text-lg">Reset Password</h3>
               <p className="text-center text-gray-500 text-sm">Enter your registered email or phone to receive a code.</p>
               <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" placeholder="Email or Phone" value={resetIdentifier} onChange={e => setResetIdentifier(e.target.value)} />
               <button type="button" onClick={() => setActiveTab('login')} className="block mx-auto text-sm text-gray-500 hover:text-gray-800">Back to Login</button>
             </div>
          )}

          <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0 mt-4">
            {activeTab === 'login' ? 'Sign In' : activeTab === 'forgot' ? 'Send Reset Code' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
};

const AuthPage = ({ onLogin, onRegister, onPasswordReset, availableUsers, onBack }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center mb-6">
        <div className="bg-orange-600 p-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
          <ShieldCheck size={48} className="text-white" />
        </div>
      </div>
      <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or <button onClick={onBack} className="font-medium text-orange-600 hover:text-orange-500">return to home page</button>
      </p>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
        <AuthScreen onLogin={onLogin} onRegister={onRegister} onPasswordReset={onPasswordReset} availableUsers={availableUsers} />
      </div>
    </div>
  </div>
);

// --- APP CORE COMPONENTS ---

const FoodUpload = ({ user, onUploadComplete, onBack }) => {
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
  
  const [metadata, setMetadata] = useState({ 
    type: FOOD_TYPES[0], 
    quantity: 0, 
    prepTime: 0, 
    packaging: 'open', 
    storage: 'room' 
  });

  // Dynamic Servings Calculation
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
  
  const runAIVerification = () => {
    if (!metadata.quantity || metadata.quantity <= 0) return alert("Please enter a valid quantity.");
    setLoading(true);
    setTimeout(() => {
      let score = 100; let status = 'Safe to Donate'; let reasons = [];
      if (metadata.prepTime > 12) { score -= 40; reasons.push('Prepared > 12 hours ago'); }
      if (metadata.storage === 'room' && metadata.prepTime > 4) { score -= 50; reasons.push('Room temp > 4h'); }
      if (score >= 80) status = 'Safe to Donate'; else if (score >= 50) status = 'Needs Manual Verification'; else status = 'Unsafe for Redistribution';
      setAnalysis({ score, status, reasons }); setLoading(false); setStep(3);
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
            <button onClick={()=>setBatchItems(b=>b.filter(x=>x.id!==i.id))} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setShowSummary(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">Add More</button>
        <button onClick={() => onUploadComplete(batchItems)} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30">Donate All</button>
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
          <div className="flex justify-between p-6 text-white"><span className="font-bold text-lg">Camera</span><button onClick={stopCameraStream} className="p-2 bg-white/20 rounded-full"><X size={20} /></button></div>
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
            {batchItems.length > 0 && <button onClick={() => setShowSummary(true)} className="w-full bg-orange-50 text-orange-700 py-3 rounded-xl border border-orange-200 font-bold flex items-center justify-center gap-2 mb-4 hover:bg-orange-100 transition-colors"><List size={18} /> View Batch ({batchItems.length})</button>}
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
          <div className="space-y-6 animate-slideUp">
             <div className="h-48 bg-gray-100 rounded-xl overflow-hidden shadow-inner relative group">
                {video ? <video src={video} controls className="w-full h-full object-cover"/> : <img src={image} className="w-full h-full object-cover"/>}
                <button onClick={()=>setStep(1)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Food Type</label>
                 <select className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" onChange={e=>setMetadata({...metadata, type:e.target.value})}>{FOOD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prep Time (hrs)</label>
                 <input type="number" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 2" onChange={e=>setMetadata({...metadata, prepTime:e.target.value})}/>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity (kg/L/pieces)</label>
                 <input type="number" step="0.5" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 5" onChange={e=>setMetadata({...metadata, quantity: parseFloat(e.target.value) || 0})}/>
               </div>
               <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex flex-col justify-center shadow-sm">
                 <span className="text-[10px] font-bold text-orange-800 uppercase mb-1">Auto-Calculated Servings</span>
                 <span className="text-sm text-orange-600 font-bold flex items-center gap-2">
                   🧑 ~{servingsAdults} Adults | 👧 ~{servingsChildren} Children
                 </span>
               </div>
             </div>
             <div className="flex gap-2">
               {['hot', 'chilled', 'room'].map(s => <button key={s} onClick={()=>setMetadata({...metadata, storage:s})} className={`flex-1 py-2 text-xs font-bold rounded-lg border uppercase ${metadata.storage===s ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white text-gray-500'}`}>{s}</button>)}
             </div>
             <button onClick={runAIVerification} disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-black transition-colors shadow-lg">
               {loading ? <Activity size={20} className="animate-spin text-orange-500"/> : <ShieldCheck size={20} className="text-orange-400"/>} 
               {loading ? 'Analyzing...' : 'Run Safety Check'}
             </button>
          </div>
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

const DonorDashboard = ({ user, donations, setView }) => (
  <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto px-4 mt-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hello, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">You've saved 24kg of food this month!</p>
      </div>
      <button onClick={() => setView('upload')} className="bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all font-bold">
        <Plus size={20} /> New Donation
      </button>
    </div>

    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-orange-500"/> Recent Activity</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {donations.filter(d => d.donorId === user.id).map(d => (
          <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {d.mediaType==='video' ? <div className="w-full h-full flex items-center justify-center bg-gray-900"><Video size={32} className="text-white opacity-50" /></div> : <img src={d.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">{d.score} Score</div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-gray-900">{d.foodType}</h4>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.claimedBy ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{d.claimedBy ? 'Accepted' : 'Pending'}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">{d.quantity}kg • Serves ~{d.servingsAdults} Adults</p>
              <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {new Date(d.timestamp).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {donations.filter(d => d.donorId === user.id).length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400">No donations yet. Start making a difference today!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ReceiverDashboard = ({ user, donations, onAccept, users }) => {
  const available = donations.filter(d => !d.claimedBy && d.status.includes('Safe'));
  return (
    <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="opacity-90 mt-2">Daily Capacity: {user.capacity} Meals (Children: {user.capacityChildren || 0}, Adults: {user.capacityAdults || 0})</p>
        </div>
        <Globe className="absolute -right-4 -bottom-4 text-white/10" size={150} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Available Donations Nearby</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {available.map(d => {
            const donor = users.find(u => u.id === d.donorId);
            return (
              <div key={d.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  {d.mediaType==='image' && <img src={d.image} className="w-full h-full object-cover"/>}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800">{donor?.name}</span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{donor?.type}</span>
                    </div>
                    <h4 className="font-bold text-gray-900">{d.foodType}</h4>
                    <p className="text-sm text-gray-500">{d.quantity}kg • {d.distance} km</p>
                    <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase">Serves ~{d.servingsAdults} Adults / ~{d.servingsChildren} Children</p>
                  </div>
                  <button onClick={() => onAccept(d.id)} className="self-end bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-md">Accept Pickup</button>
                </div>
              </div>
            );
          })}
          {available.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">No active donations in your area.</div>}
        </div>
      </div>
    </div>
  );
};

const VolunteerDashboard = ({ user, donations, users, onUpdateStatus }) => {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(0);
  const tasks = donations.filter(d => d.claimedBy && !d.delivered);

  useEffect(() => {
    let interval;
    if (active && progress < 100) { interval = setInterval(() => setProgress(p => p+1), 200); }
    return () => clearInterval(interval);
  }, [active, progress]);

  if (active) return (
    <div className="max-w-3xl mx-auto px-4 mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
            <span className="font-bold text-gray-800">Live Navigation</span>
          </div>
          <button onClick={()=>{setActive(null); setProgress(0);}} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="flex justify-between text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
          <span>Pickup</span>
          <span>Dropoff</span>
        </div>
        <div className="relative h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-200 ease-linear" style={{width: `${progress}%`}}/>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase font-bold">From</p>
            <p className="font-bold text-gray-800">{users.find(u=>u.id===active.donorId)?.name}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <p className="text-xs text-orange-400 uppercase font-bold">To</p>
            <p className="font-bold text-orange-800">{users.find(u=>u.id===active.claimedBy)?.name}</p>
          </div>
        </div>

        <button onClick={()=>{onUpdateStatus(active.id, 'delivered'); setActive(null); alert("Delivery Completed!");}} disabled={progress<100} className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
          {progress < 100 ? 'Navigating...' : 'Confirm Delivery'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Bike className="text-orange-600"/> Delivery Tasks</h1>
      <div className="grid gap-4">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{t.foodType}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin size={14} className="text-gray-400"/>
                <span>{users.find(u=>u.id===t.donorId)?.name}</span>
                <ArrowRight size={14} className="text-gray-300"/>
                <span>{users.find(u=>u.id===t.claimedBy)?.name}</span>
              </div>
            </div>
            <button onClick={() => {setActive(t); setProgress(0);}} className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-orange-700 transition-colors">Start</button>
          </div>
        ))}
        {tasks.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed">No pending deliveries.</div>}
      </div>
    </div>
  );
};

const AdminDashboard = ({ users, donations }) => {
  const [adminTab, setAdminTab] = useState('overview'); 

  const stats = {
    totalFood: donations.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0),
    safeRate: donations.length ? Math.round((donations.filter(d => d.status.includes('Safe')).length / donations.length) * 100) : 0,
    activeUsers: users.length,
    completedDeliveries: donations.filter(d => d.delivered).length
  };

  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 mt-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2"><ShieldCheck className="text-orange-600"/> Master Admin Control</h1>
          <p className="text-gray-500 mt-1 text-sm">Full visibility and control over all platform data.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users Mgmt', icon: Users },
            { id: 'donations', label: 'Donations', icon: Database },
            { id: 'deliveries', label: 'Logistics', icon: Truck }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${adminTab === tab.id ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {adminTab === 'overview' && (
        <div className="animate-slideUp space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-orange-500">
              <h3 className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">Total Rescued</h3>
              <p className="text-4xl font-black text-gray-900">{stats.totalFood} <span className="text-lg font-normal text-gray-400">kg</span></p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
              <h3 className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">Network Size</h3>
              <p className="text-4xl font-black text-gray-900">{stats.activeUsers} <span className="text-lg font-normal text-gray-400">Users</span></p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
              <h3 className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">Safety Pass Rate</h3>
              <p className="text-4xl font-black text-gray-900">{stats.safeRate}%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500">
              <h3 className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">Deliveries Done</h3>
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
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b">ID</th>
                  <th className="p-4 font-bold border-b">Name</th>
                  <th className="p-4 font-bold border-b">Role</th>
                  <th className="p-4 font-bold border-b">Contact Info</th>
                  <th className="p-4 font-bold border-b">Joined Date</th>
                  <th className="p-4 font-bold border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-mono">#{u.id.toString().slice(-4)}</td>
                    <td className="p-4 text-sm font-bold text-gray-800">{u.name}</td>
                    <td className="p-4 text-sm"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">{u.role}</span></td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{u.email}</div>
                      <div className="text-xs text-gray-400">{u.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-xs text-gray-400">{u.joinedAt ? new Date(u.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span>
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
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b">Food Item</th>
                  <th className="p-4 font-bold border-b">Donor</th>
                  <th className="p-4 font-bold border-b">Qty & Pack</th>
                  <th className="p-4 font-bold border-b">Score</th>
                  <th className="p-4 font-bold border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map(d => (
                  <tr key={d.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                        {d.mediaType === 'video' ? <Video className="m-2 text-gray-400" size={24} /> : <img src={d.image} className="w-full h-full object-cover"/>}
                      </div>
                      <div>
                        <div>{d.foodType}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Serves ~{d.servingsAdults}A / ~{d.servingsChildren}C</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{getUserName(d.donorId)}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{d.quantity} kg</div>
                      <div className="text-xs text-gray-400 capitalize">{d.packaging}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${d.score >= 80 ? 'bg-green-500' : d.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${d.score}%`}}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{d.score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.status.includes('Safe') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'deliveries' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b">Item</th>
                  <th className="p-4 font-bold border-b">Route (Donor → NGO)</th>
                  <th className="p-4 font-bold border-b">Logistics Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.filter(d => d.claimedBy).length > 0 ? donations.filter(d => d.claimedBy).map(d => (
                  <tr key={d.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">{d.foodType} ({d.quantity}kg)</td>
                    <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-medium">{getUserName(d.donorId)}</span>
                      <ArrowRight size={14} className="text-gray-300"/>
                      <span className="font-medium text-orange-700">{getUserName(d.claimedBy)}</span>
                    </td>
                    <td className="p-4">
                      {d.delivered ? (
                         <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1"><CheckCircle size={12} /> Delivered</span>
                      ) : (
                         <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1"><Truck size={12} /> Pending / Transit</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="p-8 text-center text-gray-400">No active or completed logistics found.</td></tr>
                )}
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
  const [donations, setDonations] = useState([]); // Default to empty array until backend fetches data
  const [users, setUsers] = useState(INITIAL_USERS.map((u, index) => ({
    ...u,
    joinedAt: new Date(Date.now() - index * 86400000 * 2).toISOString() 
  })));

  // NEW: Fetch data from Python when the app loads!
  useEffect(() => {
    // Prevent fetching in cloud environment preview
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      // NOTE: When deploying to AWS, you will change this URL to your actual AWS IP Address 
      // e.g. fetch('http://54.123.45.67:5000/api/donations')
      fetch('http://localhost:5000/api/donations')
        .then(response => response.json())
        .then(data => {
            // If backend connects, use the Python data
            setDonations(data);
        })
        .catch(error => {
            console.log("No local backend detected. Falling back to mock data.");
            // Fallback to local INITIAL_DONATIONS if the Python server is turned off
            setDonations(INITIAL_DONATIONS);
        });
    } else {
       // We are in the Canvas/Cloud preview environment, do not attempt to fetch from localhost
       setDonations(INITIAL_DONATIONS);
    }
  }, []);

  const handleLogin = (u) => { setUser(u); setView('dashboard'); };
  const handleRegister = (u) => { setUsers([...users, u]); };
  
  // Send data to Python when a Donor uploads food
  const handleUpload = (items) => { 
    const arr = Array.isArray(items) ? items : [items]; 
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      arr.forEach(item => {
        // NOTE: When deploying to AWS, you will change this URL to your actual AWS IP Address
        // e.g. fetch('http://54.123.45.67:5000/api/donations', { ... })
        fetch('http://localhost:5000/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(savedItem => {
          setDonations(prev => [savedItem, ...prev]);
        })
        .catch(error => {
          console.log("No local backend detected. Saving locally.");
          // Fallback: save locally if python is not running
          setDonations(prev => [{...item, id: Date.now()}, ...prev]);
        });
      });
    } else {
      // Fallback for Canvas/Cloud preview environment
      const newItems = arr.map((item, idx) => ({...item, id: Date.now() + idx}));
      setDonations(prev => [...newItems, ...prev]);
    }

    setView('dashboard'); 
  };

  const handleUpdate = (id, status) => setDonations(d => d.map(i => i.id===id ? {...i, [status]:true} : i));
  const handleAccept = (id) => setDonations(d => d.map(i => i.id===id ? {...i, claimedBy: user.id} : i));

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <GlobalStyles />
      <Navbar user={user} onLogout={()=>{setUser(null); setView('landing');}} setView={setView} onLoginClick={() => setView('auth')} />
      <main className="flex-grow pt-16">
        {view === 'landing' && <LandingPage onGetStarted={() => setView('auth')} onLearnMore={() => setView('howItWorks')} availableUsers={users} />}
        {view === 'howItWorks' && <HowItWorksPage onGetStarted={() => setView('auth')} />}
        {view === 'aboutUs' && <AboutUsPage />}
        {view === 'auth' && <AuthPage onLogin={handleLogin} onRegister={handleRegister} onPasswordReset={()=>{}} availableUsers={users} onBack={() => setView('landing')} />}
        {view === 'dashboard' && user?.role === USER_ROLES.DONOR && <DonorDashboard user={user} donations={donations} setView={setView} />}
        {view === 'upload' && user?.role === USER_ROLES.DONOR && <FoodUpload user={user} onUploadComplete={handleUpload} onBack={() => setView('dashboard')} />}
        {view === 'dashboard' && user?.role === USER_ROLES.RECEIVER && <ReceiverDashboard user={user} donations={donations} onAccept={handleAccept} users={users} />}
        {view === 'dashboard' && user?.role === USER_ROLES.VOLUNTEER && <VolunteerDashboard user={user} donations={donations} users={users} onUpdateStatus={handleUpdate} />}
        {view === 'dashboard' && user?.role === USER_ROLES.ADMIN && <AdminDashboard users={users} donations={donations} />}
      </main>
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto text-center text-sm text-gray-400">
        <p>© 2026 SharePlate. All rights reserved.</p>
      </footer>
    </div>
  );
}