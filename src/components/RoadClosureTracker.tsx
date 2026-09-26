import React, { useState, useMemo } from 'react';
import { Car, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Info, ExternalLink, Phone, Navigation } from 'lucide-react';
import { fmt } from '../utils/formatters';

interface RoadClosure {
  id: string;
  roadNo: string;
  roadName: string;
  province: string;
  amphoe: string;
  km: string;
  waterDepthCm: number;
  status: 'impassable_all' | 'impassable_small' | 'passable_caution' | 'reopened';
  statusText: string;
  detour: string;
  updatedAt: string;
}

const ROAD_CLOSURES_DATA: RoadClosure[] = [
  {
    id: 'rd-1',
    roadNo: 'ทล. 32 (สายเอเชีย)',
    roadName: 'ช่วงอยุธยา - อ่างทอง',
    province: 'พระนครศรีอยุธยา',
    amphoe: 'บางปะอิน / นครหลวง',
    km: 'กม. 18+000 - 20+500',
    waterDepthCm: 15,
    status: 'passable_caution',
    statusText: 'น้ำท่วมขังไหล่ทาง รถทุกชนิดผ่านได้ชะลอความเร็ว',
    detour: 'ใช้ช่องทางหลัก 2 เลนขวา หลีกเลี่ยงช่องทางคู่ขนาน',
    updatedAt: '30 นาทีที่แล้ว',
  },
  {
    id: 'rd-2',
    roadNo: 'ทล. 340',
    roadName: 'ช่วงสุพรรณบุรี - ชัยนาท',
    province: 'สุพรรณบุรี',
    amphoe: 'เดิมบางนางบวช',
    km: 'กม. 92+300 - 94+100',
    waterDepthCm: 35,
    status: 'impassable_small',
    statusText: 'รถเล็ก (รถเก๋ง / มอเตอร์ไซค์) ห้ามผ่าน',
    detour: 'แนะนำเลี่ยงไปใช้ ทล. 333 หรือ ทล. 1 พหลโยธิน',
    updatedAt: '1 ชม. ที่แล้ว',
  },
  {
    id: 'rd-3',
    roadNo: 'ทล. 117',
    roadName: 'ช่วงนครสวรรค์ - พิษณุโลก',
    province: 'พิจิตร',
    amphoe: 'โพธิ์ประทับช้าง',
    km: 'กม. 68+000 - 69+500',
    waterDepthCm: 50,
    status: 'impassable_all',
    statusText: 'ระดับน้ำสูง กระแสน้ำไหลเชี่ยว ปิดการจราจรทุกชนิด',
    detour: 'ใช้เส้นทางเลี่ยง ทล. 11 พิษณุโลก - สากเหล็ก - วังทอง',
    updatedAt: '45 นาทีที่แล้ว',
  },
  {
    id: 'rd-4',
    roadNo: 'ทล. 101',
    roadName: 'ช่วงสุโขทัย - ศรีสัชนาลัย',
    province: 'สุโขทัย',
    amphoe: 'สวรรคโลก',
    km: 'กม. 35+200 - 37+000',
    waterDepthCm: 40,
    status: 'impassable_small',
    statusText: 'รถเล็กห้ามผ่าน รถกระบะยกสูงสัญจรระมัดระวัง',
    detour: 'เลี่ยงไปใช้ถนนเลี่ยงเมือง ทล. 1048',
    updatedAt: '2 ชม. ที่แล้ว',
  },
  {
    id: 'rd-5',
    roadNo: 'ทล. 118',
    roadName: 'ช่วงเชียงใหม่ - เชียงราย',
    province: 'เชียงใหม่',
    amphoe: 'ดอยสะเก็ด',
    km: 'กม. 42+000',
    waterDepthCm: 25,
    status: 'passable_caution',
    statusText: 'มีดินสไลด์และน้ำป่าไหลผ่านผิวทาง เจ้าหน้าที่เปิด 1 เลน',
    detour: 'ขับขี่ชะลอความเร็ว ปฏิบัติตามสัญญาณเจ้าหน้าที่แขวงทางหลวง',
    updatedAt: '1.5 ชม. ที่แล้ว',
  },
  {
    id: 'rd-6',
    roadNo: 'ทล. 226',
    roadName: 'ช่วงอุบลราชธานี - วารินชำราบ',
    province: 'อุบลราชธานี',
    amphoe: 'วารินชำราบ',
    km: 'กม. 12+000 - 13+500 (สะพานข้ามแม่น้ำมูล)',
    waterDepthCm: 60,
    status: 'impassable_all',
    statusText: 'น้ำล้นตลิ่งท่วมสะพานข้ามแม่น้ำมูล ปิดการจราจรเด็ดขาด',
    detour: 'ใช้สะพานข้ามแม่น้ำมูลแห่งที่ 2 (วงแหวนเลี่ยงเมือง ทล. 231)',
    updatedAt: '20 นาทีที่แล้ว',
  },
  {
    id: 'rd-7',
    roadNo: 'ถช. นบ. 1002 (ถนนเลียบคลองบางใหญ่)',
    roadName: 'ช่วงบางใหญ่ - ไทรน้อย',
    province: 'นนทบุรี',
    amphoe: 'บางใหญ่',
    km: 'ตลอดสายเลียบคลอง',
    waterDepthCm: 20,
    status: 'passable_caution',
    statusText: 'น้ำเอ่อล้นคลองช่วงน้ำทะเลหนุน รถเล็กวิ่งชิดขวา',
    detour: 'เลี่ยงไปใช้ถนนกาญจนาภิเษก (ทล. 9)',
    updatedAt: '1 ชม. ที่แล้ว',
  },
];

export const RoadClosureTracker: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ROAD_CLOSURES_DATA.filter((item) => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (!q) return true;
      return (
        item.roadNo.toLowerCase().includes(q) ||
        item.roadName.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q) ||
        item.amphoe.toLowerCase().includes(q)
      );
    });
  }, [filterStatus, search]);

  const countImpassable = ROAD_CLOSURES_DATA.filter((r) => r.status === 'impassable_all').length;
  const countSmallBlocked = ROAD_CLOSURES_DATA.filter((r) => r.status === 'impassable_small').length;

  return (
    <section className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#0075de]/10 text-[#0075de]">
              <Car className="w-4 h-4" />
            </span>
            ตรวจสอบเส้นทางน้ำท่วม & รายงานถนนผ่านไม่ได้ (Road Closures)
          </h2>
          <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
            ตรวจสอบสภาพผิวจราจร ระดับน้ำท่วมบนถนน และเส้นทางเลี่ยง (ข้อมูลกรมทางหลวง & กรมทางหลวงชนบท)
          </p>
        </div>

        {/* Quick dial actions */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href="tel:1586"
            className="px-3.5 py-1.5 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white font-medium flex items-center gap-1.5 transition shadow-2xs active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>สายด่วนทางหลวง 1586</span>
          </a>
          <a
            href="tel:1146"
            className="px-3.5 py-1.5 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] text-[#31302e] dark:text-[#d4d4d4] font-medium flex items-center gap-1.5 transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>ทางหลวงชนบท 1146</span>
          </a>
        </div>
      </div>

      {/* Warning summary pills - Notion Sticker Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-lg bg-[#e03e3e]/10 border border-[#e03e3e]/30 flex items-center justify-between">
          <span className="text-[#e03e3e] dark:text-[#ff6464] font-semibold">ปิดการจราจรทุกชนิด</span>
          <span className="text-base font-bold font-mono-num text-[#e03e3e]">{countImpassable} สาย</span>
        </div>
        <div className="p-3 rounded-lg bg-[#dd5b00]/10 border border-[#dd5b00]/30 flex items-center justify-between">
          <span className="text-[#dd5b00] dark:text-[#ff8c42] font-semibold">รถเล็กห้ามผ่าน</span>
          <span className="text-base font-bold font-mono-num text-[#dd5b00] dark:text-[#ff8c42]">{countSmallBlocked} สาย</span>
        </div>
        <div className="p-3 rounded-lg bg-[#62aef0]/15 border border-[#62aef0]/30 flex items-center justify-between">
          <span className="text-[#0075de] dark:text-[#62aef0] font-semibold">ผ่านได้แต่ชะลอความเร็ว</span>
          <span className="text-base font-bold font-mono-num text-[#0075de] dark:text-[#62aef0]">
            {ROAD_CLOSURES_DATA.filter((r) => r.status === 'passable_caution').length} สาย
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[#1aae39]/10 border border-[#1aae39]/30 flex items-center justify-between">
          <span className="text-[#1aae39] dark:text-[#42cc68] font-semibold">เปิดการจราจรปกติ</span>
          <span className="text-base font-bold font-mono-num text-[#1aae39]">77 จังหวัด</span>
        </div>
      </div>

      {/* Filter / Search ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer font-medium ${
              filterStatus === 'all'
                ? 'bg-[#0075de] text-white font-semibold shadow-2xs'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            ทั้งหมด ({ROAD_CLOSURES_DATA.length})
          </button>
          <button
            onClick={() => setFilterStatus('impassable_all')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer font-medium ${
              filterStatus === 'impassable_all'
                ? 'bg-[#e03e3e] text-white font-semibold shadow-2xs'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            ผ่านไม่ได้เด็ดขาด ({countImpassable})
          </button>
          <button
            onClick={() => setFilterStatus('impassable_small')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer font-medium ${
              filterStatus === 'impassable_small'
                ? 'bg-[#dd5b00] text-white font-semibold shadow-2xs'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            รถเล็กห้ามผ่าน ({countSmallBlocked})
          </button>
          <button
            onClick={() => setFilterStatus('passable_caution')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer font-medium ${
              filterStatus === 'passable_caution'
                ? 'bg-[#0075de] text-white font-semibold shadow-2xs'
                : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
            }`}
          >
            เฝ้าระวัง/ชะลอความเร็ว
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาหมายเลขทางหลวง / จังหวัด…"
          className="w-full sm:w-64 px-3 py-1.5 rounded-xs border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#252525] text-[#000000] dark:text-[#ffffff] placeholder-[#a39e98] focus:outline-none focus:border-[#0075de]"
        />
      </div>

      {/* Cards list */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isBlocked = item.status === 'impassable_all';
          const isSmallBlocked = item.status === 'impassable_small';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isBlocked
                  ? 'bg-[#e03e3e]/5 border-[#e03e3e]/30'
                  : isSmallBlocked
                  ? 'bg-[#dd5b00]/5 border-[#dd5b00]/30'
                  : 'bg-[#f6f5f4] dark:bg-[#252525] border-[#e6e6e6] dark:border-[#2f2f2f]'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#000000] dark:text-[#ffffff]">
                    {item.roadNo} {item.roadName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isBlocked
                      ? 'bg-[#e03e3e] text-white'
                      : isSmallBlocked
                      ? 'bg-[#dd5b00] text-white'
                      : 'bg-[#0075de] text-white'
                  }`}>
                    {isBlocked ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{item.statusText}</span>
                  </span>
                  <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] font-mono-num">
                    (น้ำท่วมสูง ~{item.waterDepthCm} ซม.)
                  </span>
                </div>

                <div className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                  📍 จ.{item.province} อ.{item.amphoe} ({item.km}) · อัปเดตเมื่อ {item.updatedAt}
                </div>

                <div className="text-xs text-[#31302e] dark:text-[#d4d4d4] bg-white dark:bg-[#202020] p-2 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] flex items-start gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0] shrink-0 mt-0.5" />
                  <span><b>เส้นทางเลี่ยงที่แนะนำ:</b> {item.detour}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(`${item.roadNo} ${item.province}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-xs font-medium hover:bg-[#f6f5f4] text-[#31302e] dark:text-[#d4d4d4] flex items-center gap-1 transition"
                >
                  <span>เปิด Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
