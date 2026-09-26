import React, { useState } from 'react';
import { CloudRain, Radio, Wind, ExternalLink } from 'lucide-react';

interface WindyViewConfig {
  label: string;
  lat: number;
  lon: number;
  zoom: number;
  detailLat?: number;
  detailLon?: number;
}

const WINDY_VIEWS: Record<string, WindyViewConfig> = {
  east: { label: 'กทม. + ตะวันออก', lat: 13.1, lon: 101.2, zoom: 8, detailLat: 13.75, detailLon: 100.5 },
  focus: { label: 'ภาคกลาง-ตะวันตก', lat: 13.749, lon: 99.742, zoom: 9, detailLat: 13.75, detailLon: 100.0 },
  north: { label: 'ภาคเหนือ', lat: 18.79, lon: 99.0, zoom: 8, detailLat: 18.79, detailLon: 99.0 },
  isan: { label: 'ภาคอีสาน', lat: 16.0, lon: 103.0, zoom: 7, detailLat: 16.4, detailLon: 102.8 },
  south: { label: 'ภาคใต้', lat: 8.5, lon: 99.5, zoom: 7, detailLat: 7.0, detailLon: 100.47 },
  thailand: { label: 'ทั้งประเทศ', lat: 13.2, lon: 101.0, zoom: 5, detailLat: 13.2, detailLon: 101.0 },
};

export const WindyEmbed: React.FC = () => {
  const [overlay, setOverlay] = useState<'rain' | 'radar' | 'wind'>('rain');
  const [selectedViewKey, setSelectedViewKey] = useState<string>('east');

  const currentView = WINDY_VIEWS[selectedViewKey] || WINDY_VIEWS.east;

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
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="px-3.5 py-2.5 border-b border-[#d2dedd] dark:border-[#233a3d] flex flex-wrap items-center justify-between gap-2.5 bg-[#f4f8f7] dark:bg-[#162b2e]/60">
        <div>
          <h2 className="text-sm font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
            พยากรณ์ฝนและลมสดจาก Windy
          </h2>
          <p className="text-[11px] text-[#53676b] dark:text-[#91a6a9]">
            แบบจำลองพยากรณ์ ECMWF และเรดาร์ตรวจสภาพอากาศ
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Overlay Selector */}
          <div className="flex rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] p-0.5 text-xs">
            <button
              onClick={() => setOverlay('rain')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                overlay === 'rain'
                  ? 'bg-[#0a6c86] text-white'
                  : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>ฝน</span>
            </button>
            <button
              onClick={() => setOverlay('radar')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                overlay === 'radar'
                  ? 'bg-[#0a6c86] text-white'
                  : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>เรดาร์</span>
            </button>
            <button
              onClick={() => setOverlay('wind')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                overlay === 'wind'
                  ? 'bg-[#0a6c86] text-white'
                  : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
              }`}
            >
              <Wind className="w-3 h-3" />
              <span>ลม</span>
            </button>
          </div>

          {/* View Selector */}
          <div className="flex flex-wrap rounded-lg bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] p-0.5 text-xs">
            {Object.entries(WINDY_VIEWS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedViewKey(key)}
                className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${
                  selectedViewKey === key
                    ? 'bg-[#0a6c86] text-white'
                    : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Windy Iframe */}
      <div className="w-full h-[400px] sm:h-[480px] bg-slate-900 relative">
        <iframe
          src={embedUrl}
          title="Windy Weather Forecast Map"
          loading="lazy"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Footer bar */}
      <div className="px-3.5 py-2 border-t border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/60 flex items-center justify-between text-xs text-[#53676b] dark:text-[#91a6a9]">
        <span>ใช้แถบเวลาด้านล่างแผนที่ Windy เพื่อเลื่อนดูพยากรณ์ล่วงหน้า 3-7 วัน</span>
        <a
          href={directLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0a6c86] dark:text-[#3fb6d3] font-semibold flex items-center gap-1 hover:underline"
        >
          <span>เปิดใน Windy เต็มจอ</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
};
