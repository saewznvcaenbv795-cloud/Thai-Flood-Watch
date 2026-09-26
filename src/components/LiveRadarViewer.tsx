import React, { useState } from 'react';
import { Radio, RefreshCw, ExternalLink, Calendar, Info } from 'lucide-react';

interface RadarStationConfig {
  name: string;
  region: string;
  agency: string;
  imageUrl: string;
  altUrl: string;
  description: string;
}

const RADAR_STATIONS: Record<string, RadarStationConfig> = {
  nongchok: {
    name: 'สถานีเรดาร์หนองจอก (กทม.)',
    region: 'กรุงเทพฯ และปริมณฑล, ฉะเชิงเทรา, ปทุมธานี',
    agency: 'สำนักการระบายน้ำ กรุงเทพมหานคร',
    imageUrl: 'https://weather.bangkok.go.th/radar/RadarAnimation.aspx',
    altUrl: 'https://weather.bangkok.go.th/radar',
    description: 'ตรวจจับกลุ่มฝนและกลุ่มเมฆฟ้าคะนองในรัศมี 120-240 กม. รอบกรุงเทพฯ และปริมณฑล',
  },
  nongkhaem: {
    name: 'สถานีเรดาร์หนองแขม (กทม. ฝั่งธน)',
    region: 'กทม. ฝั่งธนบุรี, นครปฐม, สมุทรสาคร, สมุทรสงคราม',
    agency: 'สำนักการระบายน้ำ กรุงเทพมหานคร',
    imageUrl: 'https://weather.bangkok.go.th/radar/RadarNk.aspx',
    altUrl: 'https://weather.bangkok.go.th/radar',
    description: 'ตรวจจับกลุ่มฝนจากอ่าวไทยและทิศตะวันตกเคลื่อนเข้าสู่กรุงเทพฯ',
  },
  chainat: {
    name: 'เรดาร์ชัยนาท (กรมอุตุนิยมวิทยา)',
    region: 'ภาคกลางตอนบน, ลุ่มน้ำเจ้าพระยา, อุทัยธานี, สิงห์บุรี',
    agency: 'กรมอุตุนิยมวิทยา (TMD)',
    imageUrl: 'https://weather.tmd.go.th/cntLoop.php',
    altUrl: 'https://weather.tmd.go.th/cnt.php',
    description: 'เรดาร์ตรวจวัดกลุ่มฝนครอบคลุมแม่น้ำเจ้าพระยา สะแกกรัง และท่าจีน',
  },
  phitsanulok: {
    name: 'เรดาร์พิษณุโลก (กรมอุตุนิยมวิทยา)',
    region: 'พิษณุโลก, สุโขทัย, พิจิตร, เพชรบูรณ์ (ลุ่มน้ำยม-น่าน)',
    agency: 'กรมอุตุนิยมวิทยา (TMD)',
    imageUrl: 'https://weather.tmd.go.th/pslLoop.php',
    altUrl: 'https://weather.tmd.go.th/psl.php',
    description: 'เฝ้าระวังกลุ่มฝนและน้ำป่าไหลหลากลุ่มน้ำยมและลุ่มน้ำน่าน',
  },
  lamphun: {
    name: 'เรดาร์ลำพูน / เชียงใหม่ (กรมอุตุนิยมวิทยา)',
    region: 'เชียงใหม่, ลำพูน, ลำปาง, แม่ฮ่องสอน (ลุ่มน้ำปิง)',
    agency: 'กรมอุตุนิยมวิทยา (TMD)',
    imageUrl: 'https://weather.tmd.go.th/lpnLoop.php',
    altUrl: 'https://weather.tmd.go.th/lpn.php',
    description: 'ตรวจจับกลุ่มฝนต้นน้ำปิงและพื้นที่ภูเขาภาคเหนือ',
  },
  khonkaen: {
    name: 'เรดาร์ขอนแก่น (กรมอุตุนิยมวิทยา)',
    region: 'ขอนแก่น, กาฬสินธุ์, มหาสารคาม, ชัยภูมิ (ลุ่มน้ำชี-มูล)',
    agency: 'กรมอุตุนิยมวิทยา (TMD)',
    imageUrl: 'https://weather.tmd.go.th/kknLoop.php',
    altUrl: 'https://weather.tmd.go.th/kkn.php',
    description: 'ตรวจจับกลุ่มฝนและมรสุมพาดผ่านภาคตะวันออกเฉียงเหนือ',
  },
};

export const LiveRadarViewer: React.FC = () => {
  const [selectedStationKey, setSelectedStationKey] = useState<string>('nongchok');
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());

  const currentStation = RADAR_STATIONS[selectedStationKey] || RADAR_STATIONS.nongchok;

  const handleRefresh = () => {
    setImageTimestamp(Date.now());
  };

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="p-4 border-b border-[#d2dedd] dark:border-[#233a3d] flex flex-wrap items-center justify-between gap-3 bg-[#f4f8f7] dark:bg-[#162b2e]/60">
        <div>
          <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            ภาพเรดาร์ตรวจสภาพฝนสดของหน่วยงานไทย (TMD / กทม.)
          </h2>
          <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
            ภาพเรดาร์ตรวจอากาศ Doppler สดจากสถานีตรวจวัดของกรมอุตุนิยมวิทยาและสำนักการระบายน้ำ กทม.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] hover:bg-[#f4f8f7] text-[#0a6c86] dark:text-[#3fb6d3] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>รีเฟรชภาพเรดาร์</span>
        </button>
      </div>

      {/* Station Selector Bar */}
      <div className="px-4 py-2 border-b border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[#53676b] dark:text-[#91a6a9] font-medium shrink-0 mr-1">
          เลือกสถานีเรดาร์:
        </span>
        {Object.entries(RADAR_STATIONS).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelectedStationKey(key)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 font-medium ${
              selectedStationKey === key
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429] hover:bg-[#eef3f2]'
            }`}
          >
            {item.name.replace(' (กรมอุตุนิยมวิทยา)', '').replace(' (กทม.)', '').replace(' (กทม. ฝั่งธน)', '')}
          </button>
        ))}
      </div>

      {/* Viewer Box */}
      <div className="p-4 flex flex-col items-center bg-slate-950 text-white min-h-[420px] justify-center relative">
        <div className="w-full max-w-2xl bg-black rounded-xl overflow-hidden border border-slate-800 shadow-lg flex flex-col items-center justify-center p-2">
          {/* Direct embed frame or image */}
          <img
            key={`${selectedStationKey}-${imageTimestamp}`}
            src={`${currentStation.imageUrl}?t=${imageTimestamp}`}
            alt={currentStation.name}
            onError={(e: any) => {
              // Fallback to placeholder/link if direct image is blocked by iframe policy
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('radar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
            className="w-full max-h-[500px] object-contain rounded-lg"
          />

          <div
            id="radar-fallback"
            style={{ display: 'none' }}
            className="flex-col items-center justify-center p-8 text-center text-xs space-y-3"
          >
            <Radio className="w-10 h-10 text-rose-400 opacity-80" />
            <div className="font-semibold text-sm">
              ภาพเรดาร์สดจาก {currentStation.name}
            </div>
            <p className="text-slate-400 max-w-md">
              {currentStation.description}
            </p>
            <a
              href={currentStation.altUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-lg bg-[#0a6c86] text-white font-semibold flex items-center gap-1.5 transition hover:bg-[#095f76]"
            >
              <span>เปิดดูภาพเรดาร์สดบนเว็บของ {currentStation.agency}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Info label below image */}
        <div className="w-full max-w-2xl mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            <span className="text-slate-200 font-semibold">{currentStation.name}</span>
            <span className="opacity-75 ml-1.5">({currentStation.region})</span>
          </div>

          <a
            href={currentStation.altUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>แหล่งข้อมูลทางการ: {currentStation.agency}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
