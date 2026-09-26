import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, TrendingUp, TrendingDown, Minus, MapPin, Compass, ShieldAlert, Waves } from 'lucide-react';
import { WaterStation } from '../types';
import { fmt, clock, ago, LEVELS } from '../utils/formatters';

interface StationDetailDrawerProps {
  station: WaterStation | null;
  onClose: () => void;
}

export const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({ station, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!station) return null;

  const lvConfig = LEVELS[station.level] || LEVELS[3];
  const isOverflow = station.level === 5;
  const isHigh = station.level === 4;

  const handleCopySummary = () => {
    const text = `📢 รายงานระดับน้ำ: ${station.name}
📍 อ.${station.amphoe} จ.${station.province} (${station.basin})
🌊 สถานะ: ${lvConfig.label} (${fmt(station.pct, 1)}% ของความจุลำน้ำ)
📏 ระดับน้ำ: ${fmt(station.msl, 2)} ม.รทก. ${station.diffBank !== null ? `(${station.diffBankText || 'ต่างจากตลิ่ง'} ${fmt(station.diffBank, 2)} ม.)` : ''}
📈 แนวโน้ม: ${station.delta !== null && station.delta > 0 ? `▲ เพิ่มขึ้น +${fmt(station.delta, 2)} ม.` : station.delta !== null && station.delta < 0 ? `▼ ลดลง -${fmt(Math.abs(station.delta), 2)} ม.` : 'ทรงตัว'}
⏱️ ตรวจวัดเมื่อ: ${clock(station.time)} (${ago(station.time)})
ที่มา: ${station.agency} ผ่าน Thai Flood Watch`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${station.lat},${station.lng}`;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-md bg-white dark:bg-[#112225] border-l border-[#d2dedd] dark:border-[#233a3d] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#d2dedd] dark:border-[#233a3d] flex items-start justify-between gap-3 bg-[#f4f8f7] dark:bg-[#162b2e]/70">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOverflow ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-xs font-semibold text-[#53676b] dark:text-[#91a6a9] tracking-wide">
                {station.agency} · {station.basin || 'ลุ่มน้ำหลัก'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0e2429] dark:text-[#e2eeee] leading-tight font-display">
              {station.name}
            </h3>
            <div className="text-xs text-[#53676b] dark:text-[#91a6a9] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0a6c86] dark:text-[#3fb6d3]" />
              <span>{station.amphoe ? `อ.${station.amphoe} ` : ''}จ.{station.province}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#53676b] hover:text-[#0e2429] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Status Callout */}
          <div className={`p-4 rounded-xl border ${
            isOverflow
              ? 'bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-200'
              : isHigh
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {isOverflow ? <ShieldAlert className="w-4 h-4 text-red-600" /> : <Waves className="w-4 h-4 text-amber-600" />}
                <span>สถานะ: {lvConfig.label}</span>
              </div>
              <span className="font-mono-num font-bold text-lg">
                {fmt(station.pct, 1)}%
              </span>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isOverflow ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(station.pct ?? 0, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs opacity-80 font-mono-num">
              <span>0% ปริมาณต่ำ</span>
              <span>100% ความจุขอบตลิ่ง</span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#53676b] dark:text-[#91a6a9] tracking-wider uppercase">
              ข้อมูลระดับน้ำโทรมาตร
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-0.5">ระดับน้ำปัจจุบัน</div>
                <div className="text-lg font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
                  {fmt(station.msl, 2)} <span className="text-xs font-normal">ม.รทก.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-0.5">ระดับตลิ่งต่ำสุด</div>
                <div className="text-lg font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
                  {station.bank !== null ? `${fmt(station.bank, 2)} ` : '– '}
                  <span className="text-xs font-normal">ม.รทก.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-0.5">
                  {station.diffBankText || 'ต่างจากตลิ่ง'}
                </div>
                <div className={`text-lg font-bold font-mono-num ${isOverflow ? 'text-red-600 dark:text-red-400' : 'text-[#0e2429] dark:text-[#e2eeee]'}`}>
                  {station.diffBank !== null ? `${fmt(station.diffBank, 2)} ` : '– '}
                  <span className="text-xs font-normal">ม.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-0.5">แนวโน้ม 24 ชม.</div>
                <div className="text-sm font-bold font-mono-num flex items-center gap-1 mt-1">
                  {station.delta !== null && station.delta > 0 ? (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5">
                      <TrendingUp className="w-4 h-4" /> +{fmt(station.delta, 2)} ม.
                    </span>
                  ) : station.delta !== null && station.delta < 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-4 h-4" /> -{fmt(Math.abs(station.delta), 2)} ม.
                    </span>
                  ) : (
                    <span className="text-[#53676b] dark:text-[#91a6a9] flex items-center gap-0.5">
                      <Minus className="w-4 h-4" /> ทรงตัว
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Location */}
          <div className="p-3.5 rounded-xl border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#53676b] dark:text-[#91a6a9]">
              <span>เวลาตรวจวัด:</span>
              <span className="font-mono-num font-semibold text-[#0e2429] dark:text-[#e2eeee]">
                {clock(station.time)} ({ago(station.time)})
              </span>
            </div>
            <div className="flex items-center justify-between text-[#53676b] dark:text-[#91a6a9]">
              <span>พิกัดสถานี:</span>
              <span className="font-mono-num font-medium text-[#0e2429] dark:text-[#e2eeee]">
                {fmt(station.lat, 4)}, {fmt(station.lng, 4)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#53676b] dark:text-[#91a6a9]">
              <span>หน่วยงานเจ้าของสถานี:</span>
              <span className="font-medium text-[#0a6c86] dark:text-[#3fb6d3]">
                {station.agency}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/60 flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex-1 py-2 px-3 rounded-lg bg-[#0a6c86] hover:bg-[#095f76] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกข้อความแล้ว' : 'คัดลอกสรุปสถานีนี้'}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] hover:bg-black/5 font-semibold text-xs flex items-center gap-1 transition"
            title="เปิดแผนที่ Google Maps"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-[#53676b]" />
          </a>
        </div>
      </div>
    </div>
  );
};
