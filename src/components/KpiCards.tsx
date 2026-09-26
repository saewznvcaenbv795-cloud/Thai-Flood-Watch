import React from 'react';
import { AlertTriangle, Droplets, CloudRain, ShieldCheck, Waves } from 'lucide-react';
import { WaterStation, RainStation, DamData } from '../types';
import { fmt } from '../utils/formatters';

interface KpiCardsProps {
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
  onSelectOverflow?: () => void;
  onSelectHighRain?: (lat: number, lng: number) => void;
  onSelectHighDams?: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  stations,
  rain,
  dams,
  onSelectOverflow,
  onSelectHighRain,
  onSelectHighDams,
}) => {
  const lv5Stations = stations.filter((s) => s.level === 5);
  const lv4Stations = stations.filter((s) => s.level === 4);
  const risingCritical = [...lv5Stations, ...lv4Stations].filter((s) => s.delta !== null && s.delta > 0).length;

  const topRain = rain.reduce<RainStation | null>((max, r) => (r.mm > (max?.mm ?? -1) ? r : max), null);
  const rain90 = rain.filter((r) => r.mm > 90);
  const rain35 = rain.filter((r) => r.mm > 35 && r.mm <= 90);

  const damsHigh = dams.filter((d) => d.pct >= 80);
  const topDam = [...dams].sort((a, b) => b.pct - a.pct)[0];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="สรุปภาพรวมสถานการณ์น้ำ">
      {/* 1. ล้นตลิ่ง - Sticker Red */}
      <button
        type="button"
        onClick={onSelectOverflow}
        className="col-span-1 rounded-xl p-3.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-[#e03e3e] dark:text-[#ff6464] group-hover:underline">
            สถานีน้ำล้นตลิ่ง
          </span>
          <div className="w-6 h-6 rounded-md bg-[#e03e3e]/10 text-[#e03e3e] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
            {fmt(lv5Stations.length)}
          </span>
          <span className="text-xs text-[#615d59] dark:text-[#9b9a97]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate">
          จาก {fmt(stations.length)} สถานีโทรมาตรทั่วไทย
        </div>
      </button>

      {/* 2. น้ำมาก 70-100% - Sticker Orange */}
      <div className="col-span-1 rounded-xl p-3.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-[#dd5b00] dark:text-[#ff8c42]">
            น้ำมาก (70–100%)
          </span>
          <div className="w-6 h-6 rounded-md bg-[#dd5b00]/10 text-[#dd5b00] flex items-center justify-center shrink-0">
            <Droplets className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
            {fmt(lv4Stations.length)}
          </span>
          <span className="text-xs text-[#615d59] dark:text-[#9b9a97]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate">
          {fmt(risingCritical)} สถานีระดับน้ำขึ้น ▲
        </div>
      </div>

      {/* 3. ฝนสูงสุด 24 ชม. - Sticker Sky */}
      <button
        type="button"
        onClick={() => topRain && onSelectHighRain && onSelectHighRain(topRain.lat, topRain.lng)}
        className="col-span-1 rounded-xl p-3.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-[#0075de] dark:text-[#62aef0] group-hover:underline">
            ฝนสูงสุด 24 ชม.
          </span>
          <div className="w-6 h-6 rounded-md bg-[#62aef0]/20 text-[#0075de] flex items-center justify-center shrink-0">
            <CloudRain className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
            {topRain ? fmt(topRain.mm, 1) : '–'}
          </span>
          <span className="text-xs text-[#615d59] dark:text-[#9b9a97]">มม.</span>
        </div>
        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate" title={topRain ? `${topRain.name} อ.${topRain.amphoe} จ.${topRain.province}` : ''}>
          {topRain ? `${topRain.province ? `จ.${topRain.province}` : ''} ${topRain.amphoe ? `อ.${topRain.amphoe}` : ''}` : '–'}
        </div>
      </button>

      {/* 4. ฝนหนักมาก >90 มม. - Sticker Purple */}
      <div className="col-span-1 rounded-xl p-3.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-[#793400] dark:text-[#d6b6f6]">
            ฝนหนักมาก (&gt;90 มม.)
          </span>
          <div className="w-6 h-6 rounded-md bg-[#d6b6f6]/30 text-[#391c57] dark:text-[#d6b6f6] flex items-center justify-center shrink-0">
            <CloudRain className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
            {fmt(rain90.length)}
          </span>
          <span className="text-xs text-[#615d59] dark:text-[#9b9a97]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate">
          ฝน 35–90 มม. อีก {fmt(rain35.length)} แห่ง
        </div>
      </div>

      {/* 5. เขื่อนใหญ่เกิน 80% - Sticker Teal */}
      <button
        type="button"
        onClick={onSelectHighDams}
        className="col-span-2 sm:col-span-1 rounded-xl p-3.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-[#2a9d99] dark:text-[#3fb6d3] group-hover:underline">
            เขื่อนใหญ่เกิน 80%
          </span>
          <div className="w-6 h-6 rounded-md bg-[#2a9d99]/15 text-[#2a9d99] flex items-center justify-center shrink-0">
            <Waves className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
            {fmt(damsHigh.length)}
          </span>
          <span className="text-xs text-[#615d59] dark:text-[#9b9a97]">/{fmt(dams.length)} เขื่อน</span>
        </div>
        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate" title={topDam ? `สูงสุด: เขื่อน${topDam.name} ${fmt(topDam.pct, 1)}%` : ''}>
          {topDam ? `สูงสุด: ${topDam.name} ${fmt(topDam.pct, 0)}%` : '–'}
        </div>
      </button>
    </section>
  );
};
