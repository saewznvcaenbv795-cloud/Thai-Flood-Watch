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
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3" aria-label="สรุปภาพรวมสถานการณ์น้ำ">
      {/* 1. ล้นตลิ่ง */}
      <button
        type="button"
        onClick={onSelectOverflow}
        className="col-span-1 rounded-xl p-3 sm:p-3.5 bg-white dark:bg-[#112225] border-t-4 border-t-[#d7263d] dark:border-t-[#ff5469] border border-[#d2dedd] dark:border-[#233a3d] shadow-2xs hover:shadow-xs transition text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 group-hover:underline">
            สถานีน้ำล้นตลิ่ง
          </span>
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
            {fmt(lv5Stations.length)}
          </span>
          <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate">
          จาก {fmt(stations.length)} สถานีโทรมาตรทั่วไทย
        </div>
      </button>

      {/* 2. น้ำมาก 70-100% */}
      <div className="col-span-1 rounded-xl p-3 sm:p-3.5 bg-white dark:bg-[#112225] border-t-4 border-t-[#ea7a16] dark:border-t-[#ff9b3b] border border-[#d2dedd] dark:border-[#233a3d] shadow-2xs">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            น้ำมาก (70–100%)
          </span>
          <Droplets className="w-4 h-4 text-amber-500 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
            {fmt(lv4Stations.length)}
          </span>
          <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate">
          {fmt(risingCritical)} สถานีระดับน้ำขึ้น ▲
        </div>
      </div>

      {/* 3. ฝนสูงสุด 24 ชม. */}
      <button
        type="button"
        onClick={() => topRain && onSelectHighRain && onSelectHighRain(topRain.lat, topRain.lng)}
        className="col-span-1 rounded-xl p-3 sm:p-3.5 bg-white dark:bg-[#112225] border-t-4 border-t-[#3a4ed7] dark:border-t-[#7b8eff] border border-[#d2dedd] dark:border-[#233a3d] shadow-2xs hover:shadow-xs transition text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
            ฝนสูงสุด 24 ชม.
          </span>
          <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
            {topRain ? fmt(topRain.mm, 1) : '–'}
          </span>
          <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">มม.</span>
        </div>
        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate" title={topRain ? `${topRain.name} อ.${topRain.amphoe} จ.${topRain.province}` : ''}>
          {topRain ? `${topRain.province ? `จ.${topRain.province}` : ''} ${topRain.amphoe ? `อ.${topRain.amphoe}` : ''}` : '–'}
        </div>
      </button>

      {/* 4. ฝนหนักมาก >90 มม. */}
      <div className="col-span-1 rounded-xl p-3 sm:p-3.5 bg-white dark:bg-[#112225] border-t-4 border-t-[#0a6c86] dark:border-t-[#3fb6d3] border border-[#d2dedd] dark:border-[#233a3d] shadow-2xs">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-[#0a6c86] dark:text-[#3fb6d3]">
            ฝนหนักมาก (&gt;90 มม.)
          </span>
          <CloudRain className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3] shrink-0" />
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
            {fmt(rain90.length)}
          </span>
          <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">แห่ง</span>
        </div>
        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate">
          ฝนหนัก 35–90 มม. อีก {fmt(rain35.length)} แห่ง
        </div>
      </div>

      {/* 5. เขื่อนใหญ่เกิน 80% */}
      <button
        type="button"
        onClick={onSelectHighDams}
        className="col-span-2 sm:col-span-1 rounded-xl p-3 sm:p-3.5 bg-white dark:bg-[#112225] border-t-4 border-t-[#279b63] dark:border-t-[#43c489] border border-[#d2dedd] dark:border-[#233a3d] shadow-2xs hover:shadow-xs transition text-left cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline">
            เขื่อนใหญ่เกิน 80%
          </span>
          <Waves className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
            {fmt(damsHigh.length)}
          </span>
          <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">/{fmt(dams.length)} เขื่อน</span>
        </div>
        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate" title={topDam ? `สูงสุด: เขื่อน${topDam.name} ${fmt(topDam.pct, 1)}%` : ''}>
          {topDam ? `สูงสุด: ${topDam.name} ${fmt(topDam.pct, 0)}%` : '–'}
        </div>
      </button>
    </section>
  );
};
