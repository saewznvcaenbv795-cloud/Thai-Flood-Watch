import React from 'react';
import { ShieldCheck, Info, Database, Layers, Compass, Mountain, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenAttributionModal?: () => void;
  updatedAt?: Date;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAttributionModal,
  updatedAt = new Date(),
}) => {
  const formatThaiDateTime = (d: Date) => {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} เวลา ${hours}:${mins} น.`;
  };

  return (
    <footer className="mt-8 pt-6 pb-12 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-xs text-[#615d59] dark:text-[#9b9a97] space-y-4">
      {/* Brand & External Official Portals */}
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

      {/* Attribution Card Matching Open Standards */}
      <div className="p-4 rounded-xl bg-[#f6f5f4] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0075de]" />
              <span>ที่มาของข้อมูลและลิขสิทธิ์</span>
            </span>
          </div>

          {onOpenAttributionModal && (
            <button
              onClick={onOpenAttributionModal}
              className="py-1 px-2.5 rounded-md bg-white dark:bg-[#2a2a2a] border border-[#e6e6e6] dark:border-[#383838] text-[#0075de] dark:text-[#62aef0] hover:bg-[#0075de]/10 font-medium text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <span>ดูรายละเอียดลิขสิทธิ์ทั้ง 6 แหล่ง</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-[11px] text-[#31302e] dark:text-[#d4d4d4]">
          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#0075de] shrink-0" />
              <span>ระดับน้ำและปริมาณน้ำในเขื่อน:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              คลังข้อมูลน้ำแห่งชาติ (ThaiWater) สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) • ดึงผ่าน API ของ สสน. ปรับปรุงทุก 10 นาที ข้อมูลล่าสุด ณ {formatThaiDateTime(updatedAt)}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#0075de] shrink-0" />
              <span>โครงข่ายลำน้ำและทิศทางการไหล:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              HydroRIVERS (Lehner & Grill 2013), WWF HydroSHEDS (สัญญาอนุญาต HydroSHEDS)
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#2a9d99] shrink-0" />
              <span>แนวแม่น้ำสายหลัก คลอง ชื่อ อ่างเก็บน้ำ และเขตอำเภอ:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              © ผู้ร่วมพัฒนา OpenStreetMap (ODbL)
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9065b0] shrink-0" />
              <span>ขอบเขตประเทศ จังหวัด และเมือง:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              Natural Earth (สาธารณสมบัติ)
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-[#dd5b00] shrink-0" />
              <span>ความสูงภูมิประเทศ:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              AWS Terrain Tiles (Mapzen) (SRTM และแหล่งข้อมูลความสูงอื่น)
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] dark:text-white flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#0075de] shrink-0" />
              <span>ความจุ ความสูง และปีที่แล้วเสร็จของเขื่อน:</span>
            </span>
            <p className="text-[#615d59] dark:text-[#9b9a97] pl-4.5 leading-relaxed">
              Wikipedia / Wikidata (CC BY-SA / CC0)
            </p>
          </div>
        </div>
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
