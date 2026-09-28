import React, { useState, useMemo } from 'react';
import {
  Waves,
  ArrowDown,
  Navigation,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Compass,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronRight,
  ExternalLink,
  Droplets,
  Layers,
  Activity
} from 'lucide-react';
import { RIVER_BASIN_PATHS, RiverBasinPath, RiverCheckpoint } from '../data/riverFlowData';
import { WaterStation } from '../types';
import { fmt, LEVELS } from '../utils/formatters';

interface WaterFlowTrackerProps {
  stations: WaterStation[];
  onFlyToCoords: (lat: number, lng: number, zoom?: number) => void;
  onSelectStation?: (stationId: string) => void;
}

export const WaterFlowTracker: React.FC<WaterFlowTrackerProps> = ({
  stations,
  onFlyToCoords,
  onSelectStation,
}) => {
  const [selectedBasinId, setSelectedBasinId] = useState<string>('chaophraya');
  const [activeCheckpointId, setActiveCheckpointId] = useState<string>('cp-c13');

  // Selected Basin
  const currentBasin = useMemo(() => {
    return RIVER_BASIN_PATHS.find((b) => b.id === selectedBasinId) || RIVER_BASIN_PATHS[0];
  }, [selectedBasinId]);

  // Match telemetry station for a checkpoint
  const matchStation = (cp: RiverCheckpoint): WaterStation | undefined => {
    return stations.find((s) => {
      if (cp.stationCode && s.name.includes(cp.stationCode)) return true;
      if (s.province === cp.province && (s.amphoe === cp.amphoe || s.name.includes(cp.name))) return true;
      // Distance match if close
      const dLat = Math.abs(s.lat - cp.lat);
      const dLng = Math.abs(s.lng - cp.lng);
      return dLat < 0.08 && dLng < 0.08;
    });
  };

  // Find active checkpoint
  const activeCheckpoint = useMemo(() => {
    return currentBasin.checkpoints.find((c) => c.id === activeCheckpointId) || currentBasin.checkpoints[0];
  }, [currentBasin, activeCheckpointId]);

  const activeMatchedStation = matchStation(activeCheckpoint);

  return (
    <div className="space-y-4">
      {/* Top Banner & Overview */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0075de]/10 text-[#0075de] flex items-center justify-center shrink-0 font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
                <span>ติดตามเส้นทางมวลน้ำ & ทิศทางการไหล (Water Flow Progression)</span>
              </h2>
              <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                จำลองทิศทางการเคลื่อนตัวของมวลน้ำหลากจากต้นน้ำสู่ปลายน้ำ พร้อมระดับน้ำจริงและเวลาเดินทาง (ETA)
              </p>
            </div>
          </div>

          {/* Basin Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-x-auto w-full sm:w-auto">
            {RIVER_BASIN_PATHS.map((basin) => (
              <button
                key={basin.id}
                onClick={() => {
                  setSelectedBasinId(basin.id);
                  setActiveCheckpointId(basin.checkpoints[0]?.id || '');
                }}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedBasinId === basin.id
                    ? 'bg-white dark:bg-[#202020] text-[#0075de] dark:text-[#62aef0] shadow-xs border border-[#e6e6e6] dark:border-[#383838]'
                    : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
                }`}
              >
                {basin.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Basin Info Callout */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentBasin.color }} />
              <span>{currentBasin.thaiName}</span>
              <span className="text-[11px] font-normal text-[#615d59] dark:text-[#9b9a97] font-mono-num">
                (ความยาวลำน้ำหลัก ~{currentBasin.totalLengthKm} กม.)
              </span>
            </div>
            <p className="text-[#615d59] dark:text-[#9b9a97] leading-relaxed">
              {currentBasin.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => onFlyToCoords(currentBasin.coordinates[0][0], currentBasin.coordinates[0][1], 8)}
              className="py-1.5 px-3 rounded-full bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#31302e] dark:text-[#d4d4d4] hover:bg-black/5 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#0075de]" />
              <span>ดูแนวแม่น้ำบนแผนที่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Flow Path Stepper + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Downstream Water Progression Pipeline (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-1.5">
                <span>ลำดับด่านตรวจวัดการเดินทางของมวลน้ำ</span>
                <span className="text-[11px] font-normal text-[#615d59] dark:text-[#9b9a97]">
                  (จากต้นน้ำสู่ปากอ่าว)
                </span>
              </h3>
            </div>
            <span className="text-[11px] text-[#0075de] font-medium font-mono-num">
              {currentBasin.checkpoints.length} จุดตรวจวัดหลัก
            </span>
          </div>

          {/* Vertical Stepper with Flow Wave Connector */}
          <div className="relative pl-6 sm:pl-8 space-y-4 sm:space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-gradient-to-b before:from-[#0075de] before:via-[#62aef0] before:to-[#2a9d99] before:rounded-full">
            {currentBasin.checkpoints.map((cp, idx) => {
              const matched = matchStation(cp);
              const isSelected = cp.id === activeCheckpointId;
              const isCrit = matched?.level === 5;
              const isHigh = matched?.level === 4;

              return (
                <div
                  key={cp.id}
                  onClick={() => setActiveCheckpointId(cp.id)}
                  className={`relative p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0075de]/5 dark:bg-[#0075de]/10 border-[#0075de] shadow-sm ring-1 ring-[#0075de]'
                      : 'bg-[#f6f5f4] dark:bg-[#252525] border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-white dark:hover:bg-[#202020]'
                  }`}
                >
                  {/* Stepper Node Marker */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono-num shadow-sm transition-transform ${
                      isCrit
                        ? 'bg-[#e03e3e] text-white animate-pulse'
                        : isHigh
                        ? 'bg-[#dd5b00] text-white'
                        : isSelected
                        ? 'bg-[#0075de] text-white scale-110'
                        : 'bg-white dark:bg-[#202020] text-[#0075de] border border-[#0075de]'
                    }`}
                  >
                    {cp.stageOrder}
                  </div>

                  {/* Checkpoint Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#000000] dark:text-[#ffffff] font-display">
                        {cp.name}
                      </span>
                      {cp.stationCode && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-num font-bold bg-[#0075de]/10 text-[#0075de]">
                          {cp.stationCode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#9b9a97]">
                      <MapPin className="w-3.5 h-3.5 text-[#0075de]" />
                      <span>{cp.amphoe} จ.{cp.province}</span>
                    </div>
                  </div>

                  {/* Flow Time & Telemetry Status Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-[#615d59] dark:text-[#9b9a97]">
                      <Clock className="w-3.5 h-3.5 text-[#dd5b00]" />
                      <span>เวลาเดินทางน้ำ: <b>{cp.travelTimeHours}</b></span>
                      {cp.distanceFromPrevKm > 0 && (
                        <span className="text-[11px] font-mono-num">({cp.distanceFromPrevKm} กม.)</span>
                      )}
                    </div>

                    {matched ? (
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">ระดับน้ำสด:</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold font-mono-num text-[11px] ${
                          matched.level === 5
                            ? 'bg-[#e03e3e] text-white'
                            : matched.level === 4
                            ? 'bg-[#dd5b00] text-white'
                            : 'bg-[#1aae39] text-white'
                        }`}>
                          {fmt(matched.pct, 0)}% {matched.level === 5 ? '(ล้นตลิ่ง)' : matched.level === 4 ? '(น้ำมาก)' : '(ปกติ)'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#615d59] sm:text-right">
                        เกณฑ์ตลิ่ง: {cp.criticalBankLevelMsl ? `${fmt(cp.criticalBankLevelMsl, 2)} ม.รทก.` : 'ตามมาตรฐาน'}
                      </div>
                    )}
                  </div>

                  {/* Brief Impact Note */}
                  <div className="mt-2.5 pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-[11px] text-[#615d59] dark:text-[#9b9a97] flex items-center justify-between">
                    <span className="line-clamp-1">พื้นที่กระทบ: {cp.impactZone}</span>
                    <span className="text-[#0075de] font-medium flex items-center gap-0.5 shrink-0 ml-2">
                      <span>รายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Checkpoint Deep-Dive & Action Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-16">
          {/* Card: Selected Checkpoint Details */}
          <div className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-3">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0075de]/10 text-[#0075de] font-mono-num mb-1 inline-block">
                  ด่านที่ {activeCheckpoint.stageOrder} / {currentBasin.checkpoints.length}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff] font-display">
                  {activeCheckpoint.name}
                </h3>
                <div className="text-xs text-[#615d59] dark:text-[#9b9a97] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0075de]" />
                  <span>{activeCheckpoint.amphoe} จ.{activeCheckpoint.province}</span>
                </div>
              </div>

              <button
                onClick={() => onFlyToCoords(activeCheckpoint.lat, activeCheckpoint.lng, 13)}
                className="py-1.5 px-3 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>บินไปจุดนี้</span>
              </button>
            </div>

            {/* Live Water Telemetry Status */}
            {activeMatchedStation ? (
              <div className={`p-4 rounded-xl border ${
                activeMatchedStation.level === 5
                  ? 'bg-[#e03e3e]/10 border-[#e03e3e]/30'
                  : activeMatchedStation.level === 4
                  ? 'bg-[#dd5b00]/10 border-[#dd5b00]/30'
                  : 'bg-[#1aae39]/10 border-[#1aae39]/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#e03e3e]" />
                    <span>สถานะระดับน้ำจริงขณะนี้:</span>
                  </span>
                  <span className="font-mono-num font-bold text-base">
                    {fmt(activeMatchedStation.pct, 1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-lg border border-[#e6e6e6]/60 dark:border-[#2f2f2f]">
                    <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">ระดับน้ำปัจจุบัน</div>
                    <div className="text-sm font-bold font-mono-num text-[#000000] dark:text-white">
                      {fmt(activeMatchedStation.msl, 2)} ม.รทก.
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-lg border border-[#e6e6e6]/60 dark:border-[#2f2f2f]">
                    <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">เทียบกับขอบตลิ่ง</div>
                    <div className={`text-sm font-bold font-mono-num ${
                      activeMatchedStation.diffBank !== null && activeMatchedStation.diffBank > 0
                        ? 'text-[#e03e3e]'
                        : 'text-[#1aae39]'
                    }`}>
                      {activeMatchedStation.diffBankText || 'ต่างจากตลิ่ง'}{' '}
                      {activeMatchedStation.diffBank !== null ? `${fmt(activeMatchedStation.diffBank, 2)} ม.` : '–'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#9b9a97] mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <span>แนวโน้ม 24 ชม.:</span>
                  <span className="font-bold flex items-center gap-1 font-mono-num">
                    {activeMatchedStation.delta !== null && activeMatchedStation.delta > 0 ? (
                      <span className="text-[#e03e3e] flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +{fmt(activeMatchedStation.delta, 2)} ม. (เพิ่มขึ้น)
                      </span>
                    ) : activeMatchedStation.delta !== null && activeMatchedStation.delta < 0 ? (
                      <span className="text-[#1aae39] flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" /> -{fmt(Math.abs(activeMatchedStation.delta), 2)} ม. (ลดลง)
                      </span>
                    ) : (
                      <span><Minus className="w-3.5 h-3.5 inline" /> ทรงตัว</span>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs space-y-1.5">
                <div className="font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#0075de]" />
                  <span>เกณฑ์ความจุและการระบายน้ำมาตรฐาน</span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono-num text-[11px] pt-1">
                  <div>
                    <span className="text-[#615d59] dark:text-[#9b9a97] block">ระดับตลิ่งวิกฤต:</span>
                    <b className="text-[#e03e3e]">{activeCheckpoint.criticalBankLevelMsl ? `${fmt(activeCheckpoint.criticalBankLevelMsl, 2)} ม.รทก.` : 'เฝ้าระวังตลิ่งต่ำ'}</b>
                  </div>
                  <div>
                    <span className="text-[#615d59] dark:text-[#9b9a97] block">เกณฑ์ระบายเฝ้าระวัง:</span>
                    <b className="text-[#0075de]">{activeCheckpoint.warningDischargeM3s ? `${fmt(activeCheckpoint.warningDischargeM3s, 0)} ลบ.ม./วินาที` : 'ตามสถานการณ์'}</b>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Impact */}
            <div className="space-y-2.5 text-xs">
              <div>
                <h4 className="font-bold text-[#000000] dark:text-[#ffffff] mb-1">
                  บทบาทและการบริหารมวลน้ำ:
                </h4>
                <p className="text-[#615d59] dark:text-[#9b9a97] leading-relaxed">
                  {activeCheckpoint.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">⚠️ ชุมชนเสี่ยงภัยท้ายน้ำ:</span>
                <span>{activeCheckpoint.impactZone}</span>
              </div>
            </div>

            {/* Water Wave Transit Calculator */}
            <div className="p-3.5 rounded-xl bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs space-y-2">
              <div className="font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0075de]" />
                <span>การประเมินเวลาเดินทางของยอดน้ำหลาก (ETA)</span>
              </div>
              <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                ยอดน้ำหลากจาก <b>{activeCheckpoint.name}</b> จะเดินทางถึงจุดถัดไปโดยใช้เวลาประมาณ{' '}
                <b className="text-[#0075de]">{activeCheckpoint.travelTimeHours}</b> (ขึ้นอยู่กับความลาดชันลำน้ำ และระดับน้ำทะเลหนุนปลายน้ำ)
              </p>
            </div>
          </div>

          {/* Key Basin Warnings Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs space-y-2 text-xs">
            <h4 className="font-bold text-[#e03e3e] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>ข้อพึงระวังของลุ่มน้ำนี้:</span>
            </h4>
            <ul className="space-y-1.5 text-[#615d59] dark:text-[#9b9a97] list-disc pl-4 text-[11px] leading-relaxed">
              {currentBasin.keyRisks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
