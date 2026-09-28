import React, { useState } from 'react';
import { X, Copy, Check, Share2, FileText } from 'lucide-react';
import { WaterStation, RainStation, DamData } from '../types';
import { fmt, clock } from '../utils/formatters';

interface SituationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
  updatedAt: Date | null;
}

export const SituationSummaryModal: React.FC<SituationSummaryModalProps> = ({
  isOpen,
  onClose,
  stations,
  rain,
  dams,
  updatedAt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const lv5Stations = stations.filter((s) => s.level === 5);
  const lv4Stations = stations.filter((s) => s.level === 4);
  const topRain = rain.reduce<RainStation | null>((max, r) => (r.mm > (max?.mm ?? -1) ? r : max), null);
  const highDams = dams.filter((d) => d.pct >= 80);

  // Top 5 provinces
  const provMap = new Map<string, number>();
  for (const s of stations) {
    if (s.level >= 4 && s.province) {
      provMap.set(s.province, (provMap.get(s.province) || 0) + (s.level === 5 ? 3 : 1));
    }
  }
  const topProvinces = [...provMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([p]) => p);

  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(updatedAt || new Date());

  const summaryText = `🌊 สรุปสถานการณ์น้ำท่วมประเทศไทย (ThaiFlood.online)
📅 ประจำวันที่: ${formattedDate}

🔴 สถานีน้ำล้นตลิ่ง: ${fmt(lv5Stations.length)} จุด
${lv5Stations.slice(0, 5).map((s) => `• ${s.name} (จ.${s.province}) ${fmt(s.pct, 0)}% ล้นตลิ่ง`).join('\n')}${lv5Stations.length > 5 ? `\n• และอื่นๆ อีก ${lv5Stations.length - 5} สถานี` : ''}

🟠 สถานีน้ำมาก (70-100%): ${fmt(lv4Stations.length)} จุด
🌧️ ฝนสูงสุด 24 ชม.: ${topRain ? `${fmt(topRain.mm, 1)} มม. (${topRain.name} จ.${topRain.province})` : '–'}
⚠️ จังหวัดเฝ้าระวังสูงสุด: ${topProvinces.length > 0 ? topProvinces.join(', ') : 'ยังไม่มีพื้นที่วิกฤต'}
🏛️ เขื่อนใหญ่เกิน 80%: ${fmt(highDams.length)} แห่ง (${highDams.map((d) => `เขื่อน${d.name} ${fmt(d.pct, 0)}%`).slice(0, 4).join(', ')})

📞 สายด่วนฉุกเฉิน 24 ชม.:
• ปภ. แจ้งเหตุน้ำท่วม: 1784
• เจ็บป่วยฉุกเฉิน กู้ชีพ: 1669
• สายด่วนทางหลวง: 1586

ติดตามสถานการณ์สดได้ที่ https://thaiflood.online
ที่มา: คลังข้อมูลน้ำแห่งชาติ สสน. และกรมชลประทาน`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_23px_52px_rgba(0,0,0,0.08)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between bg-[#f6f5f4] dark:bg-[#252525]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0075de] text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#000000] dark:text-[#ffffff] font-display">
                สรุปสถานการณ์น้ำประจำวัน
              </h3>
              <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                คัดลอกข้อความสรุปเพื่อแชร์ลง LINE, Facebook หรือกลุ่มอาสา
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#615d59] hover:text-[#000000] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text preview */}
        <div className="p-5 overflow-y-auto flex-1">
          <pre className="p-4 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-sans text-[#31302e] dark:text-[#d4d4d4] whitespace-pre-wrap leading-relaxed select-all">
            {summaryText}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-xs font-medium text-[#31302e] hover:text-[#000000] cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกสำเร็จแล้ว!' : 'คัดลอกข้อความทั้งหมด'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
