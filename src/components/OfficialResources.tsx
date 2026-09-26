import React from 'react';
import { ExternalLink, Compass, ShieldAlert, CloudRain, Video, Globe2 } from 'lucide-react';

const LINKS = [
  {
    kicker: 'พยากรณ์น้ำท่วมล่วงหน้า 7 วัน',
    title: 'Google Flood Hub',
    desc: 'คาดการณ์ระดับน้ำในแม่น้ำและพื้นที่เสี่ยงน้ำท่วมล่วงหน้าด้วย AI และโมเดลอุทกวิทยา',
    domain: 'sites.research.google/floods',
    url: 'https://sites.research.google/floods/l/14.312423800500094/100.30929387367266/7.8700000000000045',
    icon: Globe2,
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  {
    kicker: 'พยากรณ์สภาพอากาศ',
    title: 'Windy Weather',
    desc: 'แผนที่ฝน เมฆ และฟ้าคะนองรายชั่วโมง เทียบโมเดลชั้นนำ ECMWF, GFS, ICON',
    domain: 'windy.com',
    url: 'https://www.windy.com/?rain,13.1,101.2,8',
    icon: CloudRain,
    badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  },
  {
    kicker: 'ข้อมูลระดับน้ำสถานีหลัก',
    title: 'ThaiWater (สสน.)',
    desc: 'คลังข้อมูลน้ำแห่งชาติ กราฟโทรมาตรรายชั่วโมง ภาพถ่ายดาวเทียม และเรดาร์ฝนทั่วไทย',
    domain: 'thaiwater.net',
    url: 'https://www.thaiwater.net',
    icon: Compass,
    badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  },
  {
    kicker: 'สภาพจราจร · CCTV สด',
    title: 'iTIC Live CCTV',
    desc: 'แผนที่จุดน้ำท่วมขังบนถนน ปัญหาการจราจร และกล้องวงจรปิดสดตามทางแยกสำคัญ',
    domain: 'live.iticfoundation.org',
    url: 'https://live.iticfoundation.org/',
    icon: Video,
    badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  },
];

export const OfficialResources: React.FC = () => {
  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
          ลิงก์ติดตามสถานการณ์ภายนอก
        </h2>
        <span className="text-[11px] text-[#53676b] dark:text-[#91a6a9]">
          เปิดในหน้าต่างใหม่
        </span>
      </div>
      <p className="text-xs text-[#53676b] dark:text-[#91a6a9] mb-3">
        แพลตฟอร์มพยากรณ์และกล้องตรวจสภาพน้ำท่วมสดที่ได้รับการรับรองจากหน่วยงานทางการ
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-white dark:hover:bg-[#1b3438] hover:border-[#0a6c86] dark:hover:border-[#3fb6d3] transition flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.kicker}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#53676b] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3] transition shrink-0" />
                </div>
                <h3 className="text-sm font-bold text-[#0e2429] dark:text-[#e2eeee] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3] transition flex items-center gap-1.5 mb-1">
                  <Icon className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
                  {item.title}
                </h3>
                <p className="text-xs text-[#53676b] dark:text-[#91a6a9] line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#e2eded] dark:border-[#233a3d] text-[10px] text-[#53676b] dark:text-[#91a6a9] font-mono-num truncate">
                {item.domain}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
