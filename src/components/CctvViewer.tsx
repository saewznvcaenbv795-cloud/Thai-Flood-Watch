import React, { useState, useMemo } from 'react';
import { Video, Camera, ExternalLink, MapPin, Eye, ShieldAlert, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';
import { FloodCamera } from '../types';
import { FLOOD_CAMERAS } from '../data/cctvData';

interface CctvViewerProps {
  onFlyToCoords: (lat: number, lng: number, zoom?: number) => void;
}

export const CctvViewer: React.FC<CctvViewerProps> = ({ onFlyToCoords }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'river' | 'canal' | 'road' | 'gate'>('all');
  const [search, setSearch] = useState('');
  const [activeCameraId, setActiveCameraId] = useState<string>('cam-rama8');

  const filteredCameras = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FLOOD_CAMERAS.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q) ||
        c.agency.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, search]);

  const activeCam = useMemo(
    () => FLOOD_CAMERAS.find((c) => c.id === activeCameraId) || FLOOD_CAMERAS[0],
    [activeCameraId]
  );

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <Video className="w-4 h-4 text-rose-500 animate-pulse" />
            กล้อง CCTV สดเฝ้าระวังน้ำท่วม & สภาพจราจร (Live Flood & Traffic CCTVs)
          </h2>
          <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
            จุดสังเกตการณ์ระดับน้ำแม่น้ำเจ้าพระยา ประตูระบายน้ำ และจุดน้ำท่วมขังบนถนนสายหลัก
          </p>
        </div>

        {/* Portal links */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="https://live.iticfoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-white dark:hover:bg-[#1b3438] text-[#0a6c86] dark:text-[#3fb6d3] font-semibold flex items-center gap-1 transition"
          >
            <span>เปิดแผนที่กล้องสด iTIC Live (300+ ตัว)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://weather.bangkok.go.th/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-white dark:hover:bg-[#1b3438] text-[#0a6c86] dark:text-[#3fb6d3] font-semibold flex items-center gap-1 transition"
          >
            <span>CCTV สำนักระบายน้ำ กทม.</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Featured Live Stream View Box */}
      <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Video Container */}
          <div className="w-full lg:w-2/3 aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800 flex flex-col items-center justify-center">
            {/* Live Chao Phraya stream or live webcam feed */}
            <iframe
              src="https://www.youtube.com/embed/5-8C1h69614?autoplay=1&mute=1&controls=1"
              title="Live Bangkok Chao Phraya River Webcam"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
            <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>สด (LIVE 24 ชม.)</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
              วิวแม่น้ำเจ้าพระยา & กรุงเทพมหานคร
            </div>
          </div>

          {/* Camera Info Sidebar */}
          <div className="w-full lg:w-1/3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                จุดตรวจการณ์ที่เลือก
              </span>
              <span className="text-xs text-slate-400 font-mono-num">
                {activeCam.province}
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-display">
              {activeCam.name}
            </h3>

            <div className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{activeCam.location}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeCam.description}
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="text-[11px] text-slate-400 mb-1">สถานะระดับน้ำและการสัญจร:</div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                {activeCam.status === 'watch' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{activeCam.statusText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onFlyToCoords(activeCam.lat, activeCam.lng, 14)}
                className="flex-1 py-2 px-3 rounded-lg bg-[#0a6c86] hover:bg-[#095f76] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ดูตำแหน่งบนแผนที่</span>
              </button>

              <a
                href={activeCam.liveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>เปิดดูกล้องสด</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#eef3f2]'
            }`}
          >
            ทั้งหมด ({FLOOD_CAMERAS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('river')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              selectedCategory === 'river'
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#eef3f2]'
            }`}
          >
            สะพาน & แม่น้ำเจ้าพระยา ({FLOOD_CAMERAS.filter((c) => c.category === 'river').length})
          </button>
          <button
            onClick={() => setSelectedCategory('canal')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              selectedCategory === 'canal'
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#eef3f2]'
            }`}
          >
            คลองระบายน้ำ กทม. ({FLOOD_CAMERAS.filter((c) => c.category === 'canal').length})
          </button>
          <button
            onClick={() => setSelectedCategory('gate')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              selectedCategory === 'gate'
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#eef3f2]'
            }`}
          >
            ประตูระบายน้ำหลัก ({FLOOD_CAMERAS.filter((c) => c.category === 'gate').length})
          </button>
          <button
            onClick={() => setSelectedCategory('road')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              selectedCategory === 'road'
                ? 'bg-[#0a6c86] text-white font-semibold'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#eef3f2]'
            }`}
          >
            ถนน & อุโมงค์ทางลอด ({FLOOD_CAMERAS.filter((c) => c.category === 'road').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#53676b] dark:text-[#91a6a9] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อกล้อง / ถนน / พื้นที่…"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
          />
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCameras.map((cam) => {
          const isSelected = activeCameraId === cam.id;
          const isWatch = cam.status === 'watch';

          return (
            <div
              key={cam.id}
              className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0a6c86] bg-[#0a6c86]/5 dark:bg-[#3fb6d3]/10 ring-1 ring-[#0a6c86]'
                  : 'border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-white dark:hover:bg-[#1b3438]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#0a6c86]/15 text-[#0a6c86] dark:text-[#3fb6d3]">
                    {cam.category === 'river'
                      ? 'แม่น้ำ/สะพาน'
                      : cam.category === 'canal'
                      ? 'คลองระบายน้ำ'
                      : cam.category === 'gate'
                      ? 'ประตูระบายน้ำ'
                      : 'ถนน/ทางลอด'}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full flex items-center gap-1 ${
                    isWatch ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isWatch ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span>{isWatch ? 'เฝ้าระวัง' : 'ปกติ'}</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[#0e2429] dark:text-[#e2eeee] mb-1 line-clamp-1">
                  {cam.name}
                </h4>

                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-[#0a6c86] dark:text-[#3fb6d3] shrink-0" />
                  <span className="truncate">{cam.location}</span>
                </div>

                <p className="text-[11px] text-[#53676b] dark:text-[#91a6a9] line-clamp-2 leading-relaxed mb-3">
                  {cam.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#d2dedd]/60 dark:border-[#233a3d] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveCameraId(cam.id);
                    onFlyToCoords(cam.lat, cam.lng, 14);
                  }}
                  className="text-xs text-[#0a6c86] dark:text-[#3fb6d3] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>เลือกกล้องนี้ & ดูบนแผนที่</span>
                </button>

                <a
                  href={cam.liveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-[#53676b] hover:text-[#0e2429] dark:hover:text-white"
                  title="เปิดดูกล้องสดต้นฉบับ"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
