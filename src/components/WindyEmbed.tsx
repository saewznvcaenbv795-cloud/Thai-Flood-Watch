import React, { useState } from 'react';
import { Radio, CloudRain, Wind, ExternalLink, ChevronDown, ChevronUp, Radar, Sparkles } from 'lucide-react';

interface WindyViewConfig {
  label: string;
  lat: number;
  lon: number;
  zoom: number;
  detailLat?: number;
  detailLon?: number;
}

const WINDY_VIEWS: Record<string, WindyViewConfig> = {
  thailand: { label: 'ทั้งประเทศ', lat: 13.2, lon: 101.0, zoom: 6, detailLat: 13.2, detailLon: 101.0 },
  focus: { label: 'ภาคกลาง', lat: 13.75, lon: 100.5, zoom: 8, detailLat: 13.75, detailLon: 100.5 },
  east: { label: 'กทม.-ตะวันออก', lat: 13.1, lon: 101.2, zoom: 8, detailLat: 13.75, detailLon: 100.5 },
  north: { label: 'ภาคเหนือ', lat: 18.79, lon: 99.0, zoom: 8, detailLat: 18.79, detailLon: 99.0 },
  isan: { label: 'ภาคอีสาน', lat: 16.0, lon: 103.0, zoom: 7, detailLat: 16.4, detailLon: 102.8 },
  south: { label: 'ภาคใต้', lat: 8.5, lon: 99.5, zoom: 7, detailLat: 7.0, detailLon: 100.47 },
};

interface WindyEmbedProps {
  title?: string;
  defaultOverlay?: 'rain' | 'radar' | 'wind';
  defaultViewKey?: string;
  defaultCollapsed?: boolean;
}

export const WindyEmbed: React.FC<WindyEmbedProps> = ({
  title = 'เรดาร์ตรวจจับกลุ่มฝนสด (Live Rain Radar)',
  defaultOverlay = 'radar',
  defaultViewKey = 'thailand',
  defaultCollapsed = false,
}) => {
  const [overlay, setOverlay] = useState<'rain' | 'radar' | 'wind'>(defaultOverlay);
  const [selectedViewKey, setSelectedViewKey] = useState<string>(defaultViewKey);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  const currentView = WINDY_VIEWS[selectedViewKey] || WINDY_VIEWS.thailand;

  const params = new URLSearchParams({
    lat: String(currentView.lat),
    lon: String(currentView.lon),
    detailLat: String(currentView.detailLat ?? currentView.lat),
    detailLon: String(currentView.detailLon ?? currentView.lon),
    zoom: String(currentView.zoom),
    level: 'surface',
    overlay: overlay,
    product: overlay === 'radar' ? 'radar' : 'ecmwf',
    menu: '',
    message: 'true',
    marker: '',
    calendar: 'now',
    pressure: '',
    type: 'map',
    location: 'coordinates',
    detail: '',
    metricWind: 'km/h',
    metricTemp: '°C',
    radarRange: '-1',
  });

  const embedUrl = `https://embed.windy.com/embed2.html?${params.toString()}`;
  const directLink = `https://www.windy.com/?${overlay},${currentView.lat},${currentView.lon},${currentView.zoom}`;

  return (
    <section className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col transition-all">
      {/* Header bar */}
      <div className="px-3.5 py-2.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-wrap items-center justify-between gap-2.5 bg-[#f6f5f4] dark:bg-[#252525]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-1.5">
                <span>{title}</span>
              </h2>
              <span className="text-[10px] font-semibold text-[#1aae39] bg-[#1aae39]/10 px-2 py-0.5 rounded-full border border-[#1aae39]/20 hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-ping" />
                <span>สัญญาณสดจากสถานีเรดาร์</span>
              </span>
            </div>
            <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
              สแกนกลุ่มเมฆฝนฟ้าคะนอง ทิศทางการเคลื่อนตัว และพยากรณ์เมฆฝนล่วงหน้า
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Layer Selector */}
          <div className="flex rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] p-0.5 shadow-2xs">
            <button
              onClick={() => {
                setOverlay('radar');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                overlay === 'radar'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
              title="ภาพสแกนเรดาร์ตรวจฝนจริงแบบสด"
            >
              <Radio className="w-3 h-3" />
              <span>เรดาร์ฝนสด</span>
            </button>
            <button
              onClick={() => {
                setOverlay('rain');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                overlay === 'rain'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
              title="ปริมาณฝนสะสมและการพยากรณ์"
            >
              <CloudRain className="w-3 h-3" />
              <span>ฝนสะสม</span>
            </button>
            <button
              onClick={() => {
                setOverlay('wind');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                overlay === 'wind'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
              title="กระแสลมและพายุ"
            >
              <Wind className="w-3 h-3" />
              <span>ทิศทางลม</span>
            </button>
          </div>

          {/* Region Selector */}
          <div className="hidden md:flex rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] p-0.5 shadow-2xs">
            {Object.entries(WINDY_VIEWS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedViewKey(key);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`px-2 py-1 rounded-md transition cursor-pointer ${
                  selectedViewKey === key
                    ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-semibold'
                    : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Collapse / Expand Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white transition cursor-pointer"
            title={isCollapsed ? 'ขยายแผนที่เรดาร์ฝน' : 'ย่อแผนที่เรดาร์ฝน'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Windy Iframe Section (Collapsible) */}
      {!isCollapsed && (
        <>
          <div className="w-full h-[360px] sm:h-[430px] bg-slate-900 relative">
            <iframe
              src={embedUrl}
              title="Windy Weather Rain Radar Map"
              loading="lazy"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Footer bar */}
          <div className="px-3.5 py-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] flex flex-wrap items-center justify-between text-xs text-[#615d59] dark:text-[#9b9a97] gap-2">
            <div className="flex items-center gap-1.5">
              <span>💡 ใช้ปุ่มเล่น <b>Play (▶)</b> ที่แถบเวลาด้านล่างแผนที่เพื่อจำลองการเคลื่อนที่ของกลุ่มฝน</span>
            </div>
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0075de] dark:text-[#62aef0] font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>เปิดดูเรดาร์เต็มจอ</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </>
      )}
    </section>
  );
};
