import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 pb-12 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-xs text-[#615d59] dark:text-[#9b9a97] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0075de] text-white flex items-center justify-center shrink-0 font-bold text-xs">
            🌊
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="https://thaiflood.online"
              className="font-bold text-[#000000] dark:text-[#ffffff] hover:text-[#0075de] dark:hover:text-[#62aef0]"
            >
              ThaiFlood.online
            </a>
            <span className="text-[#615d59] dark:text-[#9b9a97]">
              (ระบบเฝ้าระวังน้ำท่วมไทยแบบเรียลไทม์)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
          <a
            href="https://www.thaiwater.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0075de] dark:hover:text-[#62aef0] underline"
          >
            คลังข้อมูลน้ำแห่งชาติ สสน.
          </a>
          <a
            href="https://www.disaster.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0075de] dark:hover:text-[#62aef0] underline"
          >
            ปภ. (DDPM)
          </a>
          <a
            href="https://www.tmd.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0075de] dark:hover:text-[#62aef0] underline"
          >
            กรมอุตุนิยมวิทยา
          </a>
          <a
            href="https://sites.research.google/floods/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0075de] dark:hover:text-[#62aef0] underline"
          >
            Google Flood Hub
          </a>
        </div>
      </div>

      <div className="text-[11px] leading-relaxed text-[#615d59] dark:text-[#9b9a97]">
        แหล่งข้อมูล: คลังข้อมูลน้ำแห่งชาติ (ThaiWater / สถาบันสารสนเทศทรัพยากรน้ำ - สสน.), ศูนย์เตือนภัยพิบัติระดับโลก GDACS,
        แบบจำลองสภาพอากาศ Windy, แผนที่ดาวเทียม © Esri, DeLorme, OpenStreetMap.
        ระดับน้ำและฝนดึงจากสถานีโทรมาตรอัตโนมัติของ สสน. และกรมชลประทานโดยตรง
      </div>

      <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#31302e] dark:text-[#d4d4d4] text-[11px] flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 text-[#0075de] mt-0.5" />
        <span>
          <b>ข้อควรระวัง:</b> ข้อมูลจากสถานีโทรมาตรอัตโนมัติอาจมีความคลาดเคลื่อนหรือล่าช้าจากสภาพอากาศรุนแรง
          โปรดใช้เพื่อการเฝ้าระวังเบื้องต้นร่วมกับประกาศเตือนภัยอย่างเป็นทางการจากกรมป้องกันและบรรเทาสาธารณภัย (ปภ.) และหน่วยงานท้องถิ่น
        </span>
      </div>
    </footer>
  );
};
