import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 pb-12 border-t border-[#d2dedd] dark:border-[#233a3d] text-xs text-[#53676b] dark:text-[#91a6a9] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0a6c86] text-white flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-2" viewBox="0 0 32 32">
              <path d="M2 20c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" />
              <path d="M2 26c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" />
            </svg>
          </div>
          <span className="font-bold text-[#0e2429] dark:text-[#e2eeee]">
            Thai Flood Watch (เฝ้าระวังน้ำท่วมไทย)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
          <a
            href="https://www.thaiwater.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a6c86] dark:hover:text-[#3fb6d3] underline"
          >
            คลังข้อมูลน้ำแห่งชาติ สสน.
          </a>
          <a
            href="https://www.disaster.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a6c86] dark:hover:text-[#3fb6d3] underline"
          >
            ปภ. (DDPM)
          </a>
          <a
            href="https://www.tmd.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a6c86] dark:hover:text-[#3fb6d3] underline"
          >
            กรมอุตุนิยมวิทยา
          </a>
          <a
            href="https://sites.research.google/floods/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0a6c86] dark:hover:text-[#3fb6d3] underline"
          >
            Google Flood Hub
          </a>
        </div>
      </div>

      <div className="text-[11px] leading-relaxed text-[#53676b] dark:text-[#91a6a9]">
        แหล่งข้อมูล: คลังข้อมูลน้ำแห่งชาติ (ThaiWater / สถาบันสารสนเทศทรัพยากรน้ำ - สสน.), ศูนย์เตือนภัยพิบัติระดับโลก GDACS,
        แบบจำลองสภาพอากาศ Windy, แผนที่ดาวเทียม © Esri, DeLorme, OpenStreetMap.
        ระดับน้ำและฝนดึงจากสถานีโทรมาตรอัตโนมัติของ สสน. และกรมชลประทานโดยตรง
      </div>

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <span>
          <b>ข้อควรระวัง:</b> ข้อมูลจากสถานีโทรมาตรอัตโนมัติอาจมีความคลาดเคลื่อนหรือล่าช้าจากสภาพอากาศรุนแรง
          โปรดใช้เพื่อการเฝ้าระวังเบื้องต้นร่วมกับประกาศเตือนภัยอย่างเป็นทางการจากกรมป้องกันและบรรเทาสาธารณภัย (ปภ.) และหน่วยงานท้องถิ่น
        </span>
      </div>
    </footer>
  );
};
