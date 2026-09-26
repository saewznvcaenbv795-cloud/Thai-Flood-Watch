import React, { useState } from 'react';
import {
  Car,
  Home,
  FileCheck2,
  Waves,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  Search,
  Navigation,
  Info,
  Camera,
  Coins,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { fmt } from '../utils/formatters';
import { RoadClosureTracker } from './RoadClosureTracker';

interface Shelter {
  id: string;
  name: string;
  province: string;
  amphoe: string;
  capacity: number;
  currentOccupancy: number;
  phone: string;
  address: string;
  facilities: string[];
  petFriendly: boolean;
  status: 'open' | 'limited' | 'full';
  lat: number;
  lng: number;
}

const SHELTERS_DATA: Shelter[] = [
  {
    id: 'sh-1',
    name: 'ศูนย์พักพิงเทศบาลนครเชียงใหม่ (สนามกีฬาเทศบาลนครเชียงใหม่)',
    province: 'เชียงใหม่',
    amphoe: 'เมืองเชียงใหม่',
    capacity: 500,
    currentOccupancy: 180,
    phone: '053-259-000',
    address: 'ถ.สนามกีฬา ต.ศรีภูมิ อ.เมืองเชียงใหม่',
    facilities: ['อาหารและน้ำดื่มฟรี 3 มื้อ', 'หน่วยแพทย์สนาม รพ.นครพิงค์', 'จุดชาร์จแบตเตอรี่โทรศัพท์', 'ห้องน้ำแยกชาย-หญิง', 'เต็นท์ส่วนบุคคล'],
    petFriendly: true,
    status: 'open',
    lat: 18.7961,
    lng: 98.9882,
  },
  {
    id: 'sh-2',
    name: 'ศูนย์อพยพชั่วคราว อบจ.เชียงราย (ศูนย์ประชุมและแสดงสินค้านานาชาติฯ)',
    province: 'เชียงราย',
    amphoe: 'เมืองเชียงราย',
    capacity: 800,
    currentOccupancy: 320,
    phone: '053-175-333',
    address: 'ต.ริมกก อ.เมืองเชียงราย',
    facilities: ['โรงครัวพระราชทาน', 'ทีมกู้ภัยและพยาบาล 24 ชม.', 'สัญญาณ Wi-Fi ฉุกเฉิน', 'ลานจอดรถยกสูงน้ำไม่ท่วม'],
    petFriendly: true,
    status: 'open',
    lat: 19.9205,
    lng: 99.8512,
  },
  {
    id: 'sh-3',
    name: 'ศูนย์พักพิงเทศบาลเมืองสุโขทัยธานี (วิทยาลัยอาชีวศึกษาสุโขทัย)',
    province: 'สุโขทัย',
    amphoe: 'เมืองสุโขทัย',
    capacity: 350,
    currentOccupancy: 210,
    phone: '055-611-150',
    address: 'ต.ธานี อ.เมืองสุโขทัย',
    facilities: ['อาหารปรุงสุก', 'ชุดยาและเวชภัณฑ์', 'ถุงยังชีพ', 'จุดบริการเรือรับ-ส่ง'],
    petFriendly: false,
    status: 'open',
    lat: 17.0056,
    lng: 99.8264,
  },
  {
    id: 'sh-4',
    name: 'ศูนย์อพยพผู้ประสบภัยน้ำท่วมพระนครศรีอยุธยา (สนามกีฬาจังหวัดฯ)',
    province: 'พระนครศรีอยุธยา',
    amphoe: 'พระนครศรีอยุธยา',
    capacity: 600,
    currentOccupancy: 420,
    phone: '035-335-555',
    address: 'ถ.โรจนะ ต.ไผ่ลิง อ.พระนครศรีอยุธยา',
    facilities: ['ที่พักพร้อมพัดลม', 'จุดแจกน้ำดื่มบรรจุขวด', 'ห้องปฐมพยาบาล', 'บริการรับฝากสัตว์เลี้ยงพร้อมกรง'],
    petFriendly: true,
    status: 'open',
    lat: 14.3532,
    lng: 100.5828,
  },
  {
    id: 'sh-5',
    name: 'ศูนย์พักพิงชั่วคราว อ.วารินชำราบ (วัดเสนาวงศ์)',
    province: 'อุบลราชธานี',
    amphoe: 'วารินชำราบ',
    capacity: 400,
    currentOccupancy: 360,
    phone: '045-321-211',
    address: 'ต.วารินชำราบ อ.วารินชำราบ จ.อุบลราชธานี',
    facilities: ['ครัวจิตอาสาแจกข้าวกล่อง', 'แพทย์เคลื่อนที่ สธ.', 'สุขาเคลื่อนที่ ปภ.'],
    petFriendly: false,
    status: 'limited',
    lat: 15.1952,
    lng: 104.8614,
  },
  {
    id: 'sh-6',
    name: 'ศูนย์พักพิงชั่วคราว อ.บางบาล (โรงเรียนบางบาล)',
    province: 'พระนครศรีอยุธยา',
    amphoe: 'บางบาล',
    capacity: 250,
    currentOccupancy: 240,
    phone: '035-307-111',
    address: 'ต.มหาพราหมณ์ อ.บางบาล',
    facilities: ['ที่นอนปิกนิกและมุ้ง', 'จุดแจกน้ำดื่ม', 'เรือรับส่งผู้ป่วยติดเตียง'],
    petFriendly: true,
    status: 'limited',
    lat: 14.3791,
    lng: 100.4932,
  },
  {
    id: 'sh-7',
    name: 'ศูนย์ประสานงานช่วยเหลือผู้ประสบอุทกภัยเทศบาลนครนนทบุรี',
    province: 'นนทบุรี',
    amphoe: 'เมืองนนทบุรี',
    capacity: 300,
    currentOccupancy: 85,
    phone: '02-589-0500',
    address: 'อาคาร 2 ชั้น 1 สำนักงานเทศบาลนครนนทบุรี',
    facilities: ['จุดลงทะเบียนรับกระสอบทราย', 'หน่วยแจกเรือพาย', 'ที่พักชั่วคราวผู้สูงอายุ'],
    petFriendly: false,
    status: 'open',
    lat: 13.8621,
    lng: 100.5134,
  },
];

// Tide data for Lower Chao Phraya (Fort Chula / Bangkok Bar)
const TIDE_FORECAST = [
  { time: '05:45 น.', heightMsl: 1.15, type: 'low', text: 'น้ำลงต่ำสุด' },
  { time: '09:20 น.', heightMsl: 1.85, type: 'mid', text: 'น้ำเริ่มขึ้น' },
  { time: '13:10 น.', heightMsl: 2.15, type: 'high', text: '⚠️ น้ำหนุนสูงสุดช่วงบ่าย (เสี่ยงเอ่อล้นริมแม่น้ำ)' },
  { time: '17:30 น.', heightMsl: 1.30, type: 'mid', text: 'น้ำลดระดับลง' },
  { time: '21:40 น.', heightMsl: 2.05, type: 'high', text: '⚠️ น้ำหนุนสูงสุดช่วงค่ำ (เฝ้าระวังเขื่อนฟันหลอ)' },
];

export const CitizenAidHub: React.FC<{ onFlyToCoords?: (lat: number, lng: number) => void }> = ({ onFlyToCoords }) => {
  const [activeTab, setActiveTab] = useState<'roads' | 'wading' | 'shelters' | 'compensation' | 'tides'>('roads');
  const [shelterSearch, setShelterSearch] = useState('');
  const [shelterProvince, setShelterProvince] = useState('all');
  const [selectedDepth, setSelectedDepth] = useState<number>(25);

  const filteredShelters = SHELTERS_DATA.filter((s) => {
    if (shelterProvince !== 'all' && s.province !== shelterProvince) return false;
    if (!shelterSearch) return true;
    const q = shelterSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.province.toLowerCase().includes(q) || s.amphoe.toLowerCase().includes(q);
  });

  const provincesWithShelters = Array.from(new Set(SHELTERS_DATA.map((s) => s.province)));

  return (
    <div className="space-y-4">
      {/* Banner / Navigation Tabs */}
      <div className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-3 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]">
          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#0075de]/10 text-[#0075de]">
                <ShieldAlert className="w-5 h-5" />
              </span>
              ศูนย์ช่วยเหลือประชาชน & ข้อมูลที่เป็นประโยชน์ (Citizen Aid Hub)
            </h1>
            <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
              รวบรวมเครื่องมือฉุกเฉิน เส้นทางสัญจร ศูนย์อพยพ และคู่มือสิทธิการเยียวยา สำหรับผู้ประสบอุทกภัยและผู้เดินทาง
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#1aae39] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ข้อมูลเปิดเพื่อประชาชน (ไม่มีค่าบริการ)</span>
            </span>
          </div>
        </div>

        {/* Tab Pills - Notion pill style */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('roads')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'roads'
                ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>เส้นทางน้ำท่วม & ทางเลี่ยง</span>
          </button>

          <button
            onClick={() => setActiveTab('wading')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wading'
                ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#dd5b00]" />
            <span>ระดับน้ำขับลุยได้ไหม (Wading Guide)</span>
          </button>

          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'shelters'
                ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>ศูนย์พักพิง & จุดอพยพ ({SHELTERS_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compensation')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'compensation'
                ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#1aae39]" />
            <span>สิทธิเงินเยียวยา 5,000-9,000 บ.</span>
          </button>

          <button
            onClick={() => setActiveTab('tides')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tides'
                ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-[#0075de]" />
            <span>เวลาน้ำทะเลหนุน (กทม./เจ้าพระยา)</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: ROAD CLOSURES & DETOURS */}
      {activeTab === 'roads' && <RoadClosureTracker />}

      {/* TAB CONTENT 2: VEHICLE WADING DEPTH GUIDE */}
      {activeTab === 'wading' && (
        <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] p-4 sm:p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-500" />
                คู่มือประเมินระดับน้ำท่วมกับการขับขี่ (Vehicle Flood Safety Guide)
              </h2>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                จำลองระดับความสูงของน้ำท่วม เพื่อดูว่ารถแต่ละประเภทลุยได้หรือไม่ พร้อมข้อควรระวังสำคัญ
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>ถ้าเครื่องดับกลางน้ำ ห้ามสตาร์ทรถซ้ำเด็ดขาด!</span>
            </div>
          </div>

          {/* Interactive Depth Slider */}
          <div className="bg-[#f4f8f7] dark:bg-[#162b2e] p-4 rounded-xl border border-[#d2dedd] dark:border-[#233a3d] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0e2429] dark:text-[#e2eeee]">
                เลื่อนระดับความสูงของน้ำท่วมที่กำลังจะลุย:
              </span>
              <span className="text-xl font-bold font-mono-num text-[#0a6c86] dark:text-[#3fb6d3]">
                {selectedDepth} เซนติเมตร (cm)
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="80"
              step="5"
              value={selectedDepth}
              onChange={(e) => setSelectedDepth(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0a6c86]"
            />

            <div className="flex justify-between text-[11px] text-[#53676b] dark:text-[#91a6a9] font-mono-num px-1">
              <span>5 ซม. (ขอบยาง)</span>
              <span>20 ซม. (ใต้ท้องรถเก๋ง)</span>
              <span>40 ซม. (ขอบประตูกระบะ)</span>
              <span>60 ซม. (ไฟหน้ารถ)</span>
              <span>80 ซม. (วิกฤต)</span>
            </div>
          </div>

          {/* Real-time Verdict based on Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Eco car & Sedan */}
            <div className={`p-4 rounded-xl border transition ${
              selectedDepth <= 15
                ? 'bg-emerald-500/10 border-emerald-400 dark:border-emerald-800'
                : selectedDepth <= 25
                ? 'bg-amber-500/10 border-amber-400 dark:border-amber-800'
                : 'bg-red-500/10 border-red-400 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee]">
                  🚗 รถเก๋ง / Eco-Car / รถไฟฟ้า
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedDepth <= 15
                    ? 'bg-emerald-600 text-white'
                    : selectedDepth <= 25
                    ? 'bg-amber-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {selectedDepth <= 15 ? 'ผ่านได้สบาย' : selectedDepth <= 25 ? 'ระมัดระวังสูงสุด' : 'ห้ามผ่านเด็ดขาด'}
                </span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9] leading-relaxed">
                {selectedDepth <= 15
                  ? 'ระดับน้ำยังต่ำกว่าใต้ท้องรถ สามารถขับผ่านได้ด้วยความเร็วคงที่ ไม่ทำให้เกิดคลื่นน้ำซัดบ้านริมทาง'
                  : selectedDepth <= 25
                  ? 'น้ำเริ่มถึงระดับท่อไอเสียและใต้ท้องรถ ต้องปิดแอร์ทันที ใช้เกียร์ต่ำ (L/1) เลี่ยงการชะลอหรือหยุดนิ่ง'
                  : 'เสี่ยงน้ำเข้าท่อไอเสีย ท่อกรองอากาศ และห้องโดยสาร เครื่องยนต์มีโอกาสดับสูง ห้ามเสี่ยงขับลุย'}
              </p>
            </div>

            {/* SUV & Crossover */}
            <div className={`p-4 rounded-xl border transition ${
              selectedDepth <= 25
                ? 'bg-emerald-500/10 border-emerald-400 dark:border-emerald-800'
                : selectedDepth <= 40
                ? 'bg-amber-500/10 border-amber-400 dark:border-amber-800'
                : 'bg-red-500/10 border-red-400 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee]">
                  🚙 รถ SUV / ครอสโอเวอร์
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedDepth <= 25
                    ? 'bg-emerald-600 text-white'
                    : selectedDepth <= 40
                    ? 'bg-amber-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {selectedDepth <= 25 ? 'ผ่านได้ปกติ' : selectedDepth <= 40 ? 'ลุยได้แต่ต้องระวัง' : 'ไม่ควรลุย'}
                </span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9] leading-relaxed">
                {selectedDepth <= 25
                  ? 'ใต้ท้องรถสูงกว่า 18-20 ซม. สามารถสัญจรได้ปลอดภัย ปิดระบบพัดลมแอร์เพื่อป้องกันใบพัดสะบัดน้ำ'
                  : selectedDepth <= 40
                  ? 'น้ำเสมอใต้ท้องรถ รักษารอบเครื่องยนต์ประมาณ 1,500-2,000 รอบ ห้ามขับสวนกับรถบรรทุกที่จะทำให้เกิดคลื่นสูง'
                  : 'ระดับน้ำสูงถึงขอบประตู เสี่ยงน้ำซึมเข้าห้องโดยสารและระบบไฟฟ้ารถยนต์'}
              </p>
            </div>

            {/* Pickup 4WD & High Trucks */}
            <div className={`p-4 rounded-xl border transition ${
              selectedDepth <= 40
                ? 'bg-emerald-500/10 border-emerald-400 dark:border-emerald-800'
                : selectedDepth <= 60
                ? 'bg-amber-500/10 border-amber-400 dark:border-amber-800'
                : 'bg-red-500/10 border-red-400 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee]">
                  🛻 กระบะยกสูง / 4WD / รถบรรทุก
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedDepth <= 40
                    ? 'bg-emerald-600 text-white'
                    : selectedDepth <= 60
                    ? 'bg-amber-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {selectedDepth <= 40 ? 'ผ่านได้ปลอดภัย' : selectedDepth <= 60 ? 'ใช้เกียร์ 4L/ชะลอรถ' : 'อันตรายกระแสน้ำพัด'}
                </span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9] leading-relaxed">
                {selectedDepth <= 40
                  ? 'กระบะยกสูง (Ground Clearance > 22 ซม.) ขับผ่านได้สะดวก ชะลอความเร็วเพื่อไม่ให้น้ำกระแทกบ้านประชาชน'
                  : selectedDepth <= 60
                  ? 'ระดับน้ำสูงถึงไฟหน้ารถ ต้องใช้เกียร์ต่ำ ใช้ 4WD ระวังกระแสน้ำไหลเชี่ยวอาจพัดรถตกขอบทางหลวง'
                  : 'อันตรายมาก กระแสน้ำลึกเกิน 60 ซม. สามารถยกรถปิคอัพให้ลอยน้ำและสูญเสียการควบคุมได้'}
              </p>
            </div>
          </div>

          {/* 5 Golden Rules of Flood Driving */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 space-y-3">
            <h3 className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              5 กฎเหล็กขับรถลุยน้ำท่วมให้รอดปลอดภัย
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#112225]/70 border border-amber-200 dark:border-amber-900/50">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">1. ปิดแอร์ทันที</span>
                <span className="text-[#53676b] dark:text-[#91a6a9]">พัดลมแอร์จะตีน้ำกระจายเข้าท่อไอดีและห้องเครื่องทำให้เครื่องดับ</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#112225]/70 border border-amber-200 dark:border-amber-900/50">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">2. ใช้เกียร์ต่ำ</span>
                <span className="text-[#53676b] dark:text-[#91a6a9]">เกียร์ L, 1 หรือ D1 เพื่อรักษาแรงดันไอเสียไม่ให้น้ำย้อนเข้าท่อ</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#112225]/70 border border-amber-200 dark:border-amber-900/50">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">3. ห้ามเหยียบคันเร่งกระชาก</span>
                <span className="text-[#53676b] dark:text-[#91a6a9]">รักษารอบเครื่องให้นิ่งสม่ำเสมอ หลีกเลี่ยงการเร่ง-ผ่อนกะทันหัน</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#112225]/70 border border-amber-200 dark:border-amber-900/50">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">4. เลียเบรกไล่น้ำ</span>
                <span className="text-[#53676b] dark:text-[#91a6a9]">เมื่อพ้นน้ำ ให้แตะเบรกเบาๆ ซ้ำๆ หลายครั้งเพื่อให้น้ำระเหยออกจากผ้าเบรก</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#112225]/70 border border-red-300 dark:border-red-900/50 bg-red-500/5">
                <span className="font-bold text-red-600 dark:text-red-400 block mb-1">5. ดับกลางน้ำ ห้ามสตาร์ท!</span>
                <span className="text-[#53676b] dark:text-[#91a6a9]">การสตาร์ทซ้ำจะดูดน้ำเข้าลูกสูบ ก้านสูบคด เครื่องพัง ซ่อมเป็นแสน! ให้เข็นรถออก</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 3: EVACUATION SHELTER FINDER */}
      {activeTab === 'shelters' && (
        <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-2">
                <Home className="w-5 h-5 text-[#0a6c86] dark:text-[#3fb6d3]" />
                ค้นหาศูนย์พักพิงชั่วคราว & จุดอพยพผู้ประสบภัย (Evacuation Shelters)
              </h2>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                ค้นหาสถานที่ปลอดภัย จุดแจกอาหาร-น้ำดื่ม และศูนย์พักพิงใกล้เคียงที่เปิดรับผู้ประสบภัย
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">
                เปิดบริการ {SHELTERS_DATA.filter((s) => s.status === 'open').length} แห่ง
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
                ใกล้เต็ม {SHELTERS_DATA.filter((s) => s.status === 'limited').length} แห่ง
              </span>
            </div>
          </div>

          {/* Search & Province Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#53676b]" />
              <input
                type="search"
                value={shelterSearch}
                onChange={(e) => setShelterSearch(e.target.value)}
                placeholder="ค้นหาชื่อศูนย์, อำเภอ หรือสิ่งอำนวยความสะดวก…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
              />
            </div>

            <select
              value={shelterProvince}
              onChange={(e) => setShelterProvince(e.target.value)}
              className="py-2 px-3 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee] cursor-pointer"
            >
              <option value="all">ทุกจังหวัด ({provincesWithShelters.length} จังหวัด)</option>
              {provincesWithShelters.map((p) => (
                <option key={p} value={p}>
                  จ.{p}
                </option>
              ))}
            </select>
          </div>

          {/* Shelters List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredShelters.map((shelter) => {
              const remaining = shelter.capacity - shelter.currentOccupancy;
              const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

              return (
                <div
                  key={shelter.id}
                  className="p-4 rounded-xl border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] flex flex-col justify-between gap-3 hover:border-[#0a6c86] transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#0a6c86] dark:text-[#3fb6d3] uppercase tracking-wide">
                          จ.{shelter.province} · อ.{shelter.amphoe}
                        </span>
                        <h3 className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] line-clamp-2">
                          {shelter.name}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        shelter.status === 'open'
                          ? 'bg-emerald-600 text-white'
                          : shelter.status === 'limited'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {shelter.status === 'open' ? 'เปิดรับปกติ' : shelter.status === 'limited' ? 'ใกล้เต็ม' : 'เต็มแล้ว'}
                      </span>
                    </div>

                    <p className="text-xs text-[#53676b] dark:text-[#91a6a9] flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span>{shelter.address}</span>
                    </p>

                    {/* Capacity bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono-num text-[#53676b] dark:text-[#91a6a9]">
                        <span>พักอยู่ {fmt(shelter.currentOccupancy)} / {fmt(shelter.capacity)} คน ({pct}%)</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">ว่างอีก {fmt(remaining)} ที่</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Facilities Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {shelter.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] text-[10px] text-[#53676b] dark:text-[#91a6a9]"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                      {shelter.petFriendly && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-300 dark:border-amber-900/50 text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                          🐾 รับสัตว์เลี้ยง
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Call & Map) */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#d2dedd] dark:border-[#233a3d] text-xs">
                    <a
                      href={`tel:${shelter.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 transition shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>โทร {shelter.phone}</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      {onFlyToCoords && (
                        <button
                          onClick={() => onFlyToCoords(shelter.lat, shelter.lng)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] font-semibold hover:bg-black/5 flex items-center gap-1 transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>ดูในแผนที่</span>
                        </button>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#53676b] hover:text-[#0e2429] dark:hover:text-white flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>นำทาง</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB CONTENT 4: FLOOD COMPENSATION & RELIEF GUIDE */}
      {activeTab === 'compensation' && (
        <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] p-4 sm:p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-500" />
                คู่มือสิทธิการเยียวยาน้ำท่วม & วิธีถ่ายรูปเก็บหลักฐานขอเงินช่วยเหลือ
              </h2>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                เกณฑ์เงินเยียวยาอุทกภัยจากรัฐบาล 5,000 - 9,000 บาทต่อครัวเรือน และเช็คลิสต์เอกสารสำคัญ
              </p>
            </div>
            <a
              href="https://flood67.disaster.go.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition self-start sm:self-auto shadow-2xs"
            >
              <span>ระบบยื่นคำร้อง ปภ. ออนไลน์</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Compensation Rates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-500/10 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                น้ำท่วมขัง 1 - 7 วัน (หรือทรัพย์สินเสียหาย)
              </span>
              <div className="text-2xl font-bold font-mono-num text-emerald-700 dark:text-emerald-300">
                5,000 <span className="text-sm font-normal">บาท/ครัวเรือน</span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                บ้านที่ถูกน้ำท่วมขังฉับพลัน หรือได้รับผลกระทบต่อสิ่งของเครื่องใช้ในชีวิตประจำวัน
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-500/10 space-y-1.5">
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                น้ำท่วมขังเกิน 7 วัน แต่ไม่เกิน 30 วัน
              </span>
              <div className="text-2xl font-bold font-mono-num text-blue-700 dark:text-blue-300">
                7,000 <span className="text-sm font-normal">บาท/ครัวเรือน</span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                กรณีพื้นที่ลุ่มต่ำ น้ำระบายช้า ต้องใช้ชีวิตในสภาวะน้ำท่วมต่อเนื่องเกิน 1 สัปดาห์
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-500/10 space-y-1.5">
              <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                น้ำท่วมขังเกิน 30 วันขึ้นไป (วิกฤตระยะยาว)
              </span>
              <div className="text-2xl font-bold font-mono-num text-purple-700 dark:text-purple-300">
                9,000 <span className="text-sm font-normal">บาท/ครัวเรือน</span>
              </div>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                อัตราช่วยเหลือสูงสุดสำหรับผู้ประสบภัยที่น้ำขังยาวนาน บ้านเรือนเสียหายหนัก
              </p>
            </div>
          </div>

          {/* Photo Evidence Checklist - CRITICAL */}
          <div className="p-4 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee]">
                4 สิ่งที่ต้องถ่ายรูปเก็บไว้เป็นหลักฐาน "ก่อนเริ่มทำความสะอาดบ้าน"
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] space-y-1">
                <span className="font-bold text-[#0a6c86] dark:text-[#3fb6d3] block">1. ระดับน้ำเทียบตัวบ้าน</span>
                <p className="text-[#53676b] dark:text-[#91a6a9]">
                  ถ่ายให้เห็นคราบน้ำ หรือระดับน้ำขณะท่วม เทียบกับเสาบ้าน ประตู หน้าต่าง ให้เห็นระดับความสูงชัดเจน
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] space-y-1">
                <span className="font-bold text-[#0a6c86] dark:text-[#3fb6d3] block">2. ความเสียหายของทรัพย์สิน</span>
                <p className="text-[#53676b] dark:text-[#91a6a9]">
                  ถ่ายรูปเฟอร์นิเจอร์ เครื่องใช้ไฟฟ้า ตู้เย็น มอเตอร์ไซค์ รถยนต์ ผนังบ้านที่พังเสียหาย ก่อนรื้อทิ้ง
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] space-y-1">
                <span className="font-bold text-[#0a6c86] dark:text-[#3fb6d3] block">3. ป้ายบ้านเลขที่</span>
                <p className="text-[#53676b] dark:text-[#91a6a9]">
                  ถ่ายรูปป้ายบ้านเลขที่พร้อมตัวบ้านในเฟรมเดียวกัน เพื่อยืนยันว่าเป็นบ้านตรงตามทะเบียนบ้านจริง
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] space-y-1">
                <span className="font-bold text-[#0a6c86] dark:text-[#3fb6d3] block">4. เอกสารประจำตัว</span>
                <p className="text-[#53676b] dark:text-[#91a6a9]">
                  เตรียมบัตร ปชช., สำเนาทะเบียนบ้าน และหน้าสมุดบัญชีธนาคาร (ที่ผูกพร้อมเพย์ด้วยเลขบัตรประชาชน 13 หลัก)
                </p>
              </div>
            </div>
          </div>

          {/* Submission steps */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-300 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-blue-900 dark:text-blue-300">
                ขั้นตอนการยื่นรับเงินเยียวยา:
              </span>
              <p className="text-blue-800 dark:text-blue-400">
                1. แจ้งผู้ใหญ่บ้าน/กำนัน/ประธานชุมชน เพื่อรับรองรายชื่อ ➔ 2. ยื่นเอกสารที่ อบต./เทศบาล ในพื้นที่ หรือยื่นผ่านเว็บไซต์ ปภ. ➔ 3. รอรับเงินโอนตรงผ่านระบบพร้อมเพย์
              </p>
            </div>
            <a
              href="tel:1784"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1 transition self-end sm:self-auto shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>สอบถาม ปภ. 1784</span>
            </a>
          </div>
        </section>
      )}

      {/* TAB CONTENT 5: HIGH TIDE & SEA SURGE WARNING */}
      {activeTab === 'tides' && (
        <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-2">
                <Waves className="w-5 h-5 text-sky-500" />
                ตารางเวลาคาดการณ์น้ำทะเลหนุนสูง (Sea Surge & High Tide)
              </h2>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                ข้อมูลสถานีป้อมพระจุลจอมเกล้า (กรมอุทกศาสตร์ กองทัพเรือ) สำหรับพื้นที่แม่น้ำเจ้าพระยาตอนล่าง กทม. นนทบุรี และสมุทรปราการ
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>เฝ้าระวังช่วงน้ำขึ้น 2 ครั้งต่อวัน</span>
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {TIDE_FORECAST.map((tide, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border transition space-y-1.5 ${
                  tide.type === 'high'
                    ? 'bg-red-500/10 border-red-300 dark:border-red-900/60'
                    : tide.type === 'mid'
                    ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/60'
                    : 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] font-mono-num">
                    {tide.time}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tide.type === 'high'
                      ? 'bg-red-600 text-white'
                      : tide.type === 'mid'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {tide.type === 'high' ? 'หนุนสูงสุด' : tide.type === 'mid' ? 'ระดับปานกลาง' : 'น้ำลงต่ำ'}
                  </span>
                </div>

                <div className="text-xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
                  +{tide.heightMsl.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-[#53676b] dark:text-[#91a6a9]">ม. รทก.</span>
                </div>

                <p className="text-xs text-[#53676b] dark:text-[#91a6a9] leading-relaxed">
                  {tide.text}
                </p>
              </div>
            ))}
          </div>

          {/* Advisory banner for Bangkok riverside */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-amber-900 dark:text-amber-200">
              <span className="font-bold">
                ข้อแนะนำสำหรับชุมชนริมแม่น้ำเจ้าพระยา (โดยเฉพาะจุดที่อยู่นอกแนวคันกั้นน้ำ และแนวเขื่อนฟันหลอ):
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                ในช่วงเวลาน้ำทะเลหนุนสูง จะทำให้น้ำในแม่น้ำเจ้าพระยาเอ่อล้นเข้าท่อระบายน้ำและตลิ่งได้ง่ายขึ้น ขอให้ยกของและปลั๊กไฟขึ้นที่สูงก่อนเวลา 12:00 น. และ 20:00 น. ของทุกวัน และเตรียมกระสอบทรายอุดปากท่อระบายน้ำภายในบ้าน
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
