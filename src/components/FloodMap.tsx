import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Video } from 'lucide-react';
import { WaterStation, RainStation, DamData, GdacsAlert } from '../types';
import { fmt, clock, ago, LEVELS, getRainCategory } from '../utils/formatters';
import { FLOOD_CAMERAS } from '../data/cctvData';

interface FloodMapProps {
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
  gdacs: GdacsAlert[];
  isDark: boolean;
  selectedStationId: string | null;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
  flyToBoundsTarget: [number, number][] | null;
  onSelectStation: (stationId: string) => void;
  filterProvince?: string;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  stations,
  rain,
  dams,
  gdacs,
  isDark,
  selectedStationId,
  flyToTarget,
  flyToBoundsTarget,
  onSelectStation,
  filterProvince = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.LayerGroup | null>(null);

  // Layer Groups
  const layersRef = useRef<{
    wl: L.LayerGroup;
    rain: L.LayerGroup;
    dam: L.LayerGroup;
    gdacs: L.LayerGroup;
    cctv: L.LayerGroup;
  }>({
    wl: L.layerGroup(),
    rain: L.layerGroup(),
    dam: L.layerGroup(),
    gdacs: L.layerGroup(),
    cctv: L.layerGroup(),
  });

  const markersMapRef = useRef<Map<string, L.Layer>>(new Map());

  // Layer visibility state
  const [showWl, setShowWl] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const [showDam, setShowDam] = useState(true);
  const [showGdacs, setShowGdacs] = useState(true);
  const [showCctv, setShowCctv] = useState(true);
  const [onlyCrit, setOnlyCrit] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      zoomControl: false,
      minZoom: 5,
      maxZoom: 16,
    }).setView([13.2, 101.0], 6);

    mapInstanceRef.current = map;

    // Attach layers
    layersRef.current.wl.addTo(map);
    layersRef.current.rain.addTo(map);
    layersRef.current.dam.addTo(map);
    layersRef.current.gdacs.addTo(map);
    layersRef.current.cctv.addTo(map);

    // Global listener for popup click to open drawer
    (window as any).__openStationDrawer = (stationId: string) => {
      onSelectStation(stationId);
    };

    return () => {
      delete (window as any).__openStationDrawer;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectStation]);

  // Update Basemap Tiles when Dark/Light changes
  const updateTiles = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const style = isDark ? 'Dark_Gray' : 'Light_Gray';
    const base = L.tileLayer(
      `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${style}_Base/MapServer/tile/{z}/{y}/{x}`,
      {
        maxZoom: 16,
        attribution: 'Tiles &copy; Esri',
      }
    );
    const ref = L.tileLayer(
      `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${style}_Reference/MapServer/tile/{z}/{y}/{x}`,
      { maxZoom: 16 }
    );

    const group = L.layerGroup([base, ref]).addTo(map);
    tileLayerRef.current = group;
  }, [isDark]);

  useEffect(() => {
    updateTiles();
  }, [updateTiles]);

  // Sync layer visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const sync = (show: boolean, layer: L.LayerGroup) => {
      if (show && !map.hasLayer(layer)) map.addLayer(layer);
      if (!show && map.hasLayer(layer)) map.removeLayer(layer);
    };

    sync(showWl, layersRef.current.wl);
    sync(showRain, layersRef.current.rain);
    sync(showDam, layersRef.current.dam);
    sync(showGdacs, layersRef.current.gdacs);
    sync(showCctv, layersRef.current.cctv);
  }, [showWl, showRain, showDam, showGdacs, showCctv]);

  // Render Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing
    layersRef.current.wl.clearLayers();
    layersRef.current.rain.clearLayers();
    layersRef.current.dam.clearLayers();
    layersRef.current.gdacs.clearLayers();
    layersRef.current.cctv.clearLayers();
    markersMapRef.current.clear();

    const provFilter = filterProvince.trim().toLowerCase();

    // 1. Rain Stations (> 35mm)
    const rainColor = isDark ? '#7b8eff' : '#3a4ed7';
    for (const r of rain) {
      if (r.mm <= 35) continue;
      if (provFilter && !r.province.toLowerCase().includes(provFilter)) continue;

      const cat = getRainCategory(r.mm);
      const isExtreme = r.mm > 90;

      const marker = L.circleMarker([r.lat, r.lng], {
        radius: Math.min(3 + Math.sqrt(r.mm) * 0.7, 16),
        color: isExtreme ? '#2563eb' : rainColor,
        weight: isExtreme ? 2 : 1,
        opacity: isExtreme ? 0.95 : 0.6,
        fillColor: rainColor,
        fillOpacity: isExtreme ? 0.35 : 0.12,
      });

      const popupHtml = `
        <div class="custom-flood-popup font-sans p-3 min-w-[220px]">
          <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#e2eded] dark:border-[#233a3d]">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${cat.badgeClass}">
              ${cat.label}
            </span>
            <span class="text-[10px] text-[#53676b] dark:text-[#91a6a9] font-mono-num">
              ${clock(r.time)}
            </span>
          </div>
          <h4 class="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] leading-tight mb-1">
            ${r.name}
          </h4>
          <div class="text-xs text-[#53676b] dark:text-[#91a6a9] mb-2">
            ${r.amphoe ? `อ.${r.amphoe} ` : ''}${r.province ? `จ.${r.province}` : ''}
          </div>
          <div class="grid grid-cols-2 gap-1.5 bg-[#f4f8f7] dark:bg-[#162b2e] p-2 rounded-lg text-xs">
            <div>
              <div class="text-[10px] text-[#53676b] dark:text-[#91a6a9]">ฝน 24 ชม.</div>
              <div class="font-bold text-sm text-blue-600 dark:text-blue-400 font-mono-num">${fmt(r.mm, 1)} มม.</div>
            </div>
            <div>
              <div class="text-[10px] text-[#53676b] dark:text-[#91a6a9]">ฝน 1 ชม. ล่าสุด</div>
              <div class="font-semibold text-xs text-[#0e2429] dark:text-[#e2eeee] font-mono-num">${r.mm1h !== null ? `${fmt(r.mm1h, 1)} มม.` : '–'}</div>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-flood-popup' });
      layersRef.current.rain.addLayer(marker);
      markersMapRef.current.set(r.id, marker);
    }

    // 2. Water Level Stations
    const sortedStations = [...stations].sort((a, b) => a.level - b.level);
    for (const s of sortedStations) {
      if (onlyCrit && s.level < 4) continue;
      if (provFilter && !s.province.toLowerCase().includes(provFilter)) continue;

      const lvConfig = LEVELS[s.level] || LEVELS[3];
      const isCritical = s.level === 5;
      const isHigh = s.level === 4;

      const marker = L.circleMarker([s.lat, s.lng], {
        radius: isCritical ? 9 : isHigh ? 6.5 : 4.5,
        color: isCritical ? '#ffffff' : lvConfig.dotColor,
        weight: isCritical ? 2.5 : 1,
        fillColor: lvConfig.dotColor,
        fillOpacity: isCritical ? 0.95 : isHigh ? 0.85 : 0.7,
      });

      const trendText =
        s.delta === null
          ? 'ทรงตัว'
          : s.delta > 0
          ? `▲ กำลังขึ้น +${fmt(s.delta, 2)} ม.`
          : s.delta < 0
          ? `▼ กำลังลด -${fmt(Math.abs(s.delta), 2)} ม.`
          : '■ ทรงตัว';

      const trendClass =
        s.delta !== null && s.delta > 0
          ? 'text-red-600 dark:text-red-400 font-semibold'
          : s.delta !== null && s.delta < 0
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-[#53676b] dark:text-[#91a6a9]';

      const popupHtml = `
        <div class="custom-flood-popup font-sans p-3.5 min-w-[260px] max-w-[320px]">
          <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#e2eded] dark:border-[#233a3d]">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${lvConfig.badgeClass}">
              ${lvConfig.label}
            </span>
            <span class="text-[11px] text-[#53676b] dark:text-[#91a6a9] font-mono-num">
              ${clock(s.time)}
            </span>
          </div>
          <h4 class="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] leading-tight mb-0.5">
            ${s.name}
          </h4>
          <div class="text-xs text-[#53676b] dark:text-[#91a6a9] mb-2.5">
            ${s.amphoe ? `อ.${s.amphoe} ` : ''}${s.province ? `จ.${s.province}` : ''}${s.basin ? ` · ${s.basin}` : ''}
          </div>
          
          <table class="w-full text-xs border-collapse">
            <tbody>
              <tr class="border-b border-[#f0f4f4] dark:border-[#1d3337]">
                <td class="py-1 text-[#53676b] dark:text-[#91a6a9]">ความจุลำน้ำ:</td>
                <td class="py-1 text-right font-bold font-mono-num ${isCritical ? 'text-red-600 dark:text-red-400' : isHigh ? 'text-amber-600 dark:text-amber-400' : ''}">${fmt(s.pct, 1)}%</td>
              </tr>
              <tr class="border-b border-[#f0f4f4] dark:border-[#1d3337]">
                <td class="py-1 text-[#53676b] dark:text-[#91a6a9]">ระดับน้ำ:</td>
                <td class="py-1 text-right font-semibold font-mono-num">${fmt(s.msl, 2)} ม.รทก.</td>
              </tr>
              ${s.diffBank !== null ? `
              <tr class="border-b border-[#f0f4f4] dark:border-[#1d3337]">
                <td class="py-1 text-[#53676b] dark:text-[#91a6a9]">${s.diffBankText || 'ต่างจากตลิ่ง'}:</td>
                <td class="py-1 text-right font-mono-num font-semibold ${s.diffBank > 0 && isCritical ? 'text-red-600' : ''}">${fmt(s.diffBank, 2)} ม.</td>
              </tr>` : ''}
              <tr>
                <td class="py-1 text-[#53676b] dark:text-[#91a6a9]">แนวโน้ม:</td>
                <td class="py-1 text-right font-mono-num ${trendClass}">${trendText}</td>
              </tr>
            </tbody>
          </table>

          <button
            onclick="window.__openStationDrawer('${s.id}')"
            class="w-full mt-3 py-1.5 px-2.5 rounded-lg bg-[#0a6c86] hover:bg-[#095f76] text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <span>ดูข้อมูลเชิงลึก & กราฟสถานี</span>
            <span>&rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-flood-popup' });
      marker.on('click', () => onSelectStation(s.id));
      layersRef.current.wl.addLayer(marker);
      markersMapRef.current.set(s.id, marker);
    }

    // 3. Dams
    for (const d of dams) {
      if (provFilter && !d.province.toLowerCase().includes(provFilter)) continue;

      const isDamOver = d.pct >= 100;
      const isDamWarn = d.pct >= 80;
      const damColor = isDamOver ? '#d7263d' : isDamWarn ? '#ea7a16' : '#0a6c86';

      const customDamIcon = L.divIcon({
        className: '',
        html: `<div class="dam-marker-pin" style="background-color: ${damColor}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([d.lat, d.lng], { icon: customDamIcon, title: d.name });

      const popupHtml = `
        <div class="custom-flood-popup font-sans p-3 min-w-[240px]">
          <div class="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#e2eded] dark:border-[#233a3d]">
            <span class="text-xs font-bold text-[#0a6c86] dark:text-[#3fb6d3]">
              เขื่อนขนาดใหญ่
            </span>
            <span class="text-xs font-bold font-mono-num ${isDamWarn ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}">
              ${fmt(d.pct, 1)}%
            </span>
          </div>
          <h4 class="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] leading-tight mb-0.5">
            เขื่อน${d.name}
          </h4>
          <div class="text-xs text-[#53676b] dark:text-[#91a6a9] mb-2">
            ${d.province ? `จ.${d.province}` : ''}${d.date ? ` · วันที่ ${d.date}` : ''}
          </div>

          <div class="w-full bg-[#e2eded] dark:bg-[#233a3d] h-2 rounded-full overflow-hidden mb-2.5">
            <div class="h-full rounded-full ${isDamOver ? 'bg-red-500' : isDamWarn ? 'bg-amber-500' : 'bg-cyan-600'}" style="width: ${Math.min(d.pct, 100)}%"></div>
          </div>

          <table class="w-full text-xs">
            <tbody>
              <tr>
                <td class="py-0.5 text-[#53676b] dark:text-[#91a6a9]">ปริมาณน้ำ:</td>
                <td class="py-0.5 text-right font-mono-num font-semibold">${fmt(d.storage, 0)} ล้าน ลบ.ม.</td>
              </tr>
              <tr>
                <td class="py-0.5 text-[#53676b] dark:text-[#91a6a9]">น้ำไหลเข้า:</td>
                <td class="py-0.5 text-right font-mono-num">${fmt(d.inflow, 2)} ล้าน ลบ.ม./วัน</td>
              </tr>
              <tr>
                <td class="py-0.5 text-[#53676b] dark:text-[#91a6a9]">ระบายออก:</td>
                <td class="py-0.5 text-right font-mono-num">${fmt(d.released, 2)} ล้าน ลบ.ม./วัน</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-flood-popup' });
      layersRef.current.dam.addLayer(marker);
      markersMapRef.current.set(d.id, marker);
    }

    // 4. GDACS Alerts
    for (const g of gdacs) {
      if (!g.lat || !g.lng) continue;
      const customGdacsIcon = L.divIcon({
        className: '',
        html: `<div class="gdacs-marker-pin">!</div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([g.lat, g.lng], { icon: customGdacsIcon });
      const popupHtml = `
        <div class="custom-flood-popup font-sans p-3 min-w-[220px]">
          <span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white mb-1.5">
            GDACS ${g.alertlevel} Alert
          </span>
          <h4 class="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] leading-tight mb-1">
            ${g.name}
          </h4>
          <p class="text-xs text-[#53676b] dark:text-[#91a6a9] mb-2 leading-relaxed">
            ${g.description ? g.description.replace(/<[^>]*>?/gm, '').slice(0, 140) : 'เหตุการณ์อุทกภัยระดับสากล'}
          </p>
          <a href="${g.reportUrl}" target="_blank" rel="noopener noreferrer" class="inline-block text-xs text-[#0a6c86] dark:text-[#3fb6d3] font-semibold underline">
            ดูรายงานฉบับเต็มของ GDACS ↗
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml, { className: 'custom-flood-popup' });
      layersRef.current.gdacs.addLayer(marker);
    }

    // 5. CCTV Flood & Traffic Cameras
    for (const cam of FLOOD_CAMERAS) {
      if (provFilter && !cam.province.toLowerCase().includes(provFilter)) continue;

      const isWatch = cam.status === 'watch';
      const customCctvIcon = L.divIcon({
        className: '',
        html: `<div class="cctv-marker-pin" style="background-color: ${isWatch ? '#ea580c' : '#0a6c86'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([cam.lat, cam.lng], { icon: customCctvIcon, title: cam.name });
      const popupHtml = `
        <div class="custom-flood-popup font-sans p-3 min-w-[240px]">
          <div class="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#e2eded] dark:border-[#233a3d]">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isWatch ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'}">
              ${isWatch ? '⚠️ เฝ้าระวัง' : '● ระดับน้ำปกติ'}
            </span>
            <span class="text-[10px] text-[#53676b] dark:text-[#91a6a9] font-mono-num">กล้อง CCTV สด</span>
          </div>
          <h4 class="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] leading-tight mb-1">
            ${cam.name}
          </h4>
          <div class="text-xs text-[#53676b] dark:text-[#91a6a9] mb-1.5">
            ${cam.location} (${cam.province})
          </div>
          <p class="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-2.5 leading-relaxed">
            ${cam.description}
          </p>
          <div class="pt-2 border-t border-[#e2eded] dark:border-[#233a3d] flex items-center justify-between gap-2">
            <span class="text-[10px] text-[#53676b] dark:text-[#91a6a9] truncate">${cam.agency}</span>
            <a href="${cam.liveViewUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs text-[#0a6c86] dark:text-[#3fb6d3] font-bold hover:underline shrink-0">
              <span>เปิดภาพสด ↗</span>
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml, { className: 'custom-flood-popup' });
      layersRef.current.cctv.addLayer(marker);
    }
  }, [stations, rain, dams, gdacs, onlyCrit, isDark, onSelectStation, filterProvince]);

  // Handle flyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (flyToTarget) {
      map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 12, {
        duration: 0.8,
      });
      return;
    }

    if (selectedStationId) {
      const marker = markersMapRef.current.get(selectedStationId);
      if (marker && 'getLatLng' in marker) {
        if (!showWl) setShowWl(true);
        const latLng = (marker as L.CircleMarker).getLatLng();
        map.flyTo(latLng, 12, { duration: 0.8 });
        (marker as L.CircleMarker).openPopup();
      }
    }
  }, [selectedStationId, flyToTarget, showWl]);

  // Handle flyToBounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !flyToBoundsTarget || flyToBoundsTarget.length === 0) return;

    const bounds = L.latLngBounds(flyToBoundsTarget);
    map.flyToBounds(bounds.pad(0.35), { maxZoom: 11, duration: 0.9 });
  }, [flyToBoundsTarget]);

  // Region jumps
  const handleRegionJump = (lat: number, lng: number, zoom: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([lat, lng], zoom, { duration: 0.8 });
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetZoom = () => handleRegionJump(13.2, 101.0, 6);

  return (
    <div className={`bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs overflow-hidden flex flex-col h-full transition-all ${
      isFullscreen ? 'fixed inset-0 z-[90] rounded-none' : ''
    }`}>
      {/* Control Ribbon */}
      <div className="px-3.5 py-2 border-b border-[#d2dedd] dark:border-[#233a3d] flex flex-wrap items-center justify-between gap-2 bg-[#f4f8f7] dark:bg-[#162b2e]/60">
        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-[#0e2429] dark:text-[#e2eeee]">
            <input
              type="checkbox"
              checked={showWl}
              onChange={(e) => setShowWl(e.target.checked)}
              className="rounded accent-[#d7263d] cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7263d]"></span>
            <span>ระดับน้ำ</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#0e2429] dark:text-[#e2eeee]">
            <input
              type="checkbox"
              checked={showRain}
              onChange={(e) => setShowRain(e.target.checked)}
              className="rounded accent-[#3a4ed7] cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a4ed7]"></span>
            <span>ฝนตกหนัก</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#0e2429] dark:text-[#e2eeee]">
            <input
              type="checkbox"
              checked={showDam}
              onChange={(e) => setShowDam(e.target.checked)}
              className="rounded accent-[#0a6c86] cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0a6c86]"></span>
            <span>เขื่อน</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#0e2429] dark:text-[#e2eeee]">
            <input
              type="checkbox"
              checked={showGdacs}
              onChange={(e) => setShowGdacs(e.target.checked)}
              className="rounded accent-[#9333ea] cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea]"></span>
            <span>GDACS</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#0e2429] dark:text-[#e2eeee]">
            <input
              type="checkbox"
              checked={showCctv}
              onChange={(e) => setShowCctv(e.target.checked)}
              className="rounded accent-rose-500 cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>กล้อง CCTV</span>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-[#0e2429] dark:text-[#e2eeee] cursor-pointer font-medium bg-white dark:bg-[#112225] px-2.5 py-1 rounded-lg border border-[#d2dedd] dark:border-[#233a3d]">
            <input
              type="checkbox"
              checked={onlyCrit}
              onChange={(e) => setOnlyCrit(e.target.checked)}
              className="rounded accent-[#d7263d] cursor-pointer"
            />
            <span>เฉพาะน้ำมาก/ล้นตลิ่ง</span>
          </label>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#53676b] hover:text-[#0e2429] dark:hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'ย่อหน้าต่างแผนที่' : 'ขยายเต็มหน้าจอ'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Region Presets Ribbon */}
      <div className="px-3.5 py-1.5 border-b border-[#e2dedd] dark:border-[#233a3d] flex items-center justify-between text-xs bg-white dark:bg-[#112225] shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-[#53676b] dark:text-[#91a6a9] shrink-0 font-medium mr-1">ซูมด่วน:</span>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            ทั้งประเทศ
          </button>
          <button
            onClick={() => handleRegionJump(13.75, 100.5, 9)}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            กทม.-ปริมณฑล
          </button>
          <button
            onClick={() => handleRegionJump(18.79, 99.0, 8)}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            ภาคเหนือ
          </button>
          <button
            onClick={() => handleRegionJump(16.0, 103.0, 7)}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            ภาคอีสาน
          </button>
          <button
            onClick={() => handleRegionJump(14.5, 100.5, 8)}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            ภาคกลาง
          </button>
          <button
            onClick={() => handleRegionJump(8.5, 99.5, 7)}
            className="px-2 py-0.5 rounded-md hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 cursor-pointer font-medium"
          >
            ภาคใต้
          </button>
        </div>

        {/* Zoom In / Out Buttons */}
        <div className="hidden sm:flex items-center gap-1 border-l border-[#d2dedd] dark:border-[#233a3d] pl-2">
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-[#53676b] cursor-pointer"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-[#53676b] cursor-pointer"
            title="ซูมออก"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[560px]">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Legend Footer */}
      <div className="px-3.5 py-2 border-t border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/60 flex flex-wrap items-center justify-between gap-y-1 gap-x-3 text-[11px] text-[#53676b] dark:text-[#91a6a9]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7263d]"></span>
            <span className="font-medium text-[#0e2429] dark:text-[#e2eeee]">ล้นตลิ่ง (&gt;100%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea7a16]"></span>
            <span>น้ำมาก (70–100%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#279b63]"></span>
            <span>ปกติ</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#3a4ed7] bg-[#3a4ed7]/30"></span>
            <span>ฝนสะสม 24 ชม.</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0a6c86]"></span>
            <span>เขื่อนใหญ่ (% รนก.)</span>
          </span>
        </div>
        <div className="text-[10px]">
          กดที่จุดเพื่อดูข้อมูลเชิงลึก & กราฟ
        </div>
      </div>
    </div>
  );
};
