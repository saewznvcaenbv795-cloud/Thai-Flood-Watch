import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Droplets,
  Layers,
  Activity,
  Mountain,
  AlertTriangle,
  ShieldCheck,
  Search,
  Navigation,
  RefreshCw,
  Compass,
  ArrowUp,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { THAI_PROVINCES, ProvinceLocation } from '../data/provinces';
import { requestAccurateGeolocation } from '../utils/geolocation';
import {
  fetchGoogleHydrologyData,
  GoogleHydrologyData,
  RiverDischargeForecastDay
} from '../services/soilAndHydrologyService';
import { fmt } from '../utils/formatters';

interface GoogleEarthSoilWeatherProps {
  initialProvinceName?: string;
  onFlyToCoords?: (lat: number, lng: number) => void;
}

export const GoogleEarthSoilWeather: React.FC<GoogleEarthSoilWeatherProps> = ({
  initialProvinceName = 'กรุงเทพมหานคร',
  onFlyToCoords,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceLocation>(() => {
    return THAI_PROVINCES.find((p) => p.name === initialProvinceName) || THAI_PROVINCES[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [data, setData] = useState<GoogleHydrologyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async (lat: number, lng: number, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchGoogleHydrologyData(lat, lng, name);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'ไม่สามารถโหลดข้อมูลสภาพดินและน้ำได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedProvince.lat, selectedProvince.lng, selectedProvince.name);
  }, [selectedProvince, loadData]);

  const [gpsAccuracyInfo, setGpsAccuracyInfo] = useState<string | null>(null);

  // Handle GPS location
  const handleGetLocation = async () => {
    setIsLocating(true);
    setError(null);
    try {
      const loc = await requestAccurateGeolocation();
      setSelectedProvince({
        ...loc.matchedProvince,
        name: loc.displayName,
        lat: loc.lat,
        lng: loc.lng,
      });
      setGpsAccuracyInfo(loc.accuracyText);
    } catch (err: any) {
      setError(err?.message || 'ไม่สามารถดึงพิกัด GPS ได้');
    } finally {
      setIsLocating(false);
    }
  };

  // Filter provinces for search dropdown
  const filteredProvinces = THAI_PROVINCES.filter((p) =>
    p.name.includes(searchQuery.trim())
  ).slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Top Banner & Location Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a9d99]/10 text-[#2a9d99] flex items-center justify-center shrink-0 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
                <span>พยากรณ์สภาพดิน ฝนฟ้าอากาศ และการไหลของลำน้ำ (Google Earth & GloFAS Hydrology)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1aae39]/10 text-[#1aae39]">
                  ฟรี 100%
                </span>
              </h2>
              <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                ดัชนีความชื้นในดิน (Soil Moisture), ความอิ่มตัวของน้ำ, น้ำหลากผิวดิน (Runoff) และอัตราการไหลของแม่น้ำล่วงหน้า 7 วัน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(selectedProvince.lat, selectedProvince.lng, selectedProvince.name)}
              disabled={isLoading}
              className="p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] transition cursor-pointer"
              title="รีเฟรชข้อมูลสด"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Location Selector Bar */}
        <div className="pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#615d59]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาจังหวัด หรือเลือกจากรายชื่อ 77 จังหวัด..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] text-xs text-[#000000] dark:text-white placeholder-[#615d59] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>

            {/* Dropdown search suggestions */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#252525] rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-lg z-50 max-h-48 overflow-y-auto py-1">
                {filteredProvinces.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedProvince(p);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#f6f5f4] dark:hover:bg-[#31302e] text-[#000000] dark:text-white flex items-center justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] text-[#615d59]">{p.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="py-1.5 px-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] text-xs font-medium text-[#31302e] dark:text-[#d4d4d4] hover:bg-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#0075de] ${isLocating ? 'animate-pulse' : ''}`} />
              <span>{isLocating ? 'กำลังดึง GPS…' : 'ตำแหน่งของฉัน'}</span>
            </button>

            {onFlyToCoords && (
              <button
                onClick={() => onFlyToCoords(selectedProvince.lat, selectedProvince.lng)}
                className="py-1.5 px-3 rounded-lg bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>ดูบนแผนที่</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected location pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#615d59] dark:text-[#9b9a97]">
          <span>กำลังแสดงข้อมูลสำหรับ:</span>
          <span className="font-bold text-[#000000] dark:text-[#ffffff] bg-[#f6f5f4] dark:bg-[#252525] px-2.5 py-0.5 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f]">
            📍 {selectedProvince.name}
          </span>
          <span className="font-mono-num text-[11px]">
            ({fmt(selectedProvince.lat, 4)}, {fmt(selectedProvince.lng, 4)})
          </span>
          {gpsAccuracyInfo && (
            <span className="text-[11px] font-semibold text-[#1aae39] bg-[#1aae39]/10 px-2 py-0.5 rounded-full border border-[#1aae39]/20">
              🎯 {gpsAccuracyInfo}
            </span>
          )}
        </div>
      </div>

      {/* Loading or Error */}
      {isLoading && (
        <div className="p-8 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#0075de] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#615d59]">กำลังประมวลผลข้อมูลสภาพดินและอุทกวิทยาจากดาวเทียม…</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-600">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content Grid */}
      {data && !isLoading && (
        <div className="space-y-4">
          {/* Row 1: Soil Saturation & Runoff KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Soil Saturation % */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#615d59] dark:text-[#9b9a97]">
                <span>ความอิ่มตัวของน้ำในดิน</span>
                <Droplets className="w-4 h-4 text-[#0075de]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-white">
                  {data.soil.soilSaturationPct}%
                </span>
                <span className={`text-xs font-bold ${
                  data.soil.soilSaturationPct >= 85
                    ? 'text-[#e03e3e]'
                    : data.soil.soilSaturationPct >= 65
                    ? 'text-[#dd5b00]'
                    : 'text-[#1aae39]'
                }`}>
                  {data.soil.soilSaturationPct >= 85 ? 'ดินอิ่มตัวเต็มที่' : data.soil.soilSaturationPct >= 65 ? 'ความชื้นสูง' : 'ปกติ'}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#f6f5f4] dark:bg-[#252525] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    data.soil.soilSaturationPct >= 85
                      ? 'bg-[#e03e3e]'
                      : data.soil.soilSaturationPct >= 65
                      ? 'bg-[#dd5b00]'
                      : 'bg-[#1aae39]'
                  }`}
                  style={{ width: `${Math.min(data.soil.soilSaturationPct, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97] leading-tight">
                {data.soil.soilStateText}
              </p>
            </div>

            {/* Card 2: Soil Absorption Capacity */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#615d59] dark:text-[#9b9a97]">
                <span>ความจุซับน้ำที่ดินเหลืออยู่</span>
                <Layers className="w-4 h-4 text-[#2a9d99]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-white">
                  {data.soil.absorptionCapacityMm}
                </span>
                <span className="text-xs text-[#615d59] font-normal">มม. (มิลลิเมตร)</span>
              </div>
              <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97] leading-tight">
                หากฝนตกเกิน <b>{data.soil.absorptionCapacityMm} มม.</b> น้ำจะไม่ซึมลงดินและกลายเป็นน้ำหลากผิวดินทั้งหมด
              </p>
            </div>

            {/* Card 3: Surface Runoff */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#615d59] dark:text-[#9b9a97]">
                <span>น้ำหลากผิวดินขณะนี้ (Runoff)</span>
                <Activity className="w-4 h-4 text-[#dd5b00]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono-num text-[#000000] dark:text-white">
                  {fmt(data.soil.surfaceRunoffMm, 2)}
                </span>
                <span className="text-xs text-[#615d59] font-normal">มม./ชม.</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[#615d59] dark:text-[#9b9a97]">อุณหภูมิดิน:</span>
                <span className="font-bold font-mono-num text-[#000000] dark:text-white">{data.soil.soilTemperatureC}°C</span>
              </div>
            </div>

            {/* Card 4: Flash Flood / Landslide Risk */}
            <div className={`p-4 rounded-xl border shadow-xs space-y-2 ${
              data.soil.flashFloodRisk === 'critical'
                ? 'bg-[#e03e3e]/10 border-[#e03e3e]/40 text-[#e03e3e]'
                : data.soil.flashFloodRisk === 'high'
                ? 'bg-[#dd5b00]/10 border-[#dd5b00]/40 text-[#dd5b00]'
                : 'bg-[#1aae39]/10 border-[#1aae39]/40 text-[#1aae39]'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span>ความเสี่ยงน้ำป่า & ดินสไลด์</span>
                <Mountain className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                {data.soil.flashFloodRisk === 'critical'
                  ? 'ระดับวิกฤต'
                  : data.soil.flashFloodRisk === 'high'
                  ? 'ระดับเฝ้าระวังสูง'
                  : 'ระดับต่ำ / ปลอดภัย'}
              </div>
              <p className="text-[11px] leading-tight opacity-90">
                ประเมินจากปริมาณน้ำขังในชั้นดิน 0-27 ซม. ตามมาตรฐาน GloFAS
              </p>
            </div>
          </div>

          {/* Row 2: Deep Soil Layers + 7-Day GloFAS River Discharge Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: 7-Day River Discharge Forecast (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0075de]" />
                    <span>พยากรณ์อัตราการไหลของลำน้ำ 7 วันล่วงหน้า (River Discharge)</span>
                  </h3>
                  <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                    แบบจำลองอุทกวิทยาโลก GloFAS (หน่วย: ลูกบาศก์เมตรต่อวินาที - m³/s)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#615d59]">จุดสูงสุด:</div>
                  <div className="text-xs font-bold font-mono-num text-[#0075de]">
                    {fmt(data.summary.peakDischargeM3s, 1)} m³/s
                  </div>
                </div>
              </div>

              {/* Day-by-Day Forecast Cards */}
              <div className="space-y-2">
                {data.riverDischargeForecast.map((day, idx) => {
                  const maxChart = Math.max(...data.riverDischargeForecast.map((d) => d.dischargeM3s), 500);
                  const pctWidth = Math.min(Math.round((day.dischargeM3s / maxChart) * 100), 100);

                  return (
                    <div
                      key={day.date}
                      className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                    >
                      <div className="flex items-center gap-3 sm:w-36 shrink-0">
                        <span className="font-bold text-[#000000] dark:text-white w-14">
                          {day.dayLabel}
                        </span>
                        <span className="text-[11px] font-mono-num text-[#615d59]">
                          {day.date.slice(5)}
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="flex-1 w-full flex items-center gap-2">
                        <div className="flex-1 bg-black/5 dark:bg-white/5 h-3 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              day.floodLevel === 'critical'
                                ? 'bg-[#e03e3e]'
                                : day.floodLevel === 'warning'
                                ? 'bg-[#dd5b00]'
                                : 'bg-[#0075de]'
                            }`}
                            style={{ width: `${Math.max(pctWidth, 6)}%` }}
                          />
                        </div>
                        <span className="w-24 text-right font-mono-num font-bold text-[#000000] dark:text-white">
                          {fmt(day.dischargeM3s, 0)} <span className="text-[10px] font-normal text-[#615d59]">m³/s</span>
                        </span>
                      </div>

                      <div className="sm:w-20 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          day.floodLevel === 'critical'
                            ? 'bg-[#e03e3e]/10 text-[#e03e3e]'
                            : day.floodLevel === 'warning'
                            ? 'bg-[#dd5b00]/10 text-[#dd5b00]'
                            : 'bg-[#1aae39]/10 text-[#1aae39]'
                        }`}>
                          {day.floodLevel === 'critical' ? 'วิกฤต' : day.floodLevel === 'warning' ? 'เฝ้าระวัง' : 'ปกติ'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Advisory note */}
              <div className="p-3 rounded-lg bg-[#0075de]/5 dark:bg-[#0075de]/10 border border-[#0075de]/20 text-xs text-[#0075de] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{data.summary.floodAdvisory}</span>
              </div>
            </div>

            {/* Right: Soil Moisture Layer Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-3">
                <h3 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2a9d99]" />
                  <span>ความชื้นในดินแต่ละระดับความลึก</span>
                </h3>
                <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                  ตรวจวัดโดยดาวเทียมสำรวจพื้นผิวโลก Google Earth Engine
                </p>
              </div>

              <div className="space-y-3">
                {/* Layer 1 */}
                <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#000000] dark:text-white">
                      1. ชั้นผิวดินบนสุด (ความลึก 0 - 1 ซม.)
                    </span>
                    <span className="font-mono-num font-bold text-[#0075de]">
                      {data.soil.soilMoistureTop0_1cm} m³/m³
                    </span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#62aef0] h-full rounded-full"
                      style={{ width: `${Math.min((data.soil.soilMoistureTop0_1cm / 0.5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#615d59]">สัมผัสฝนโดยตรง ตอบสนองต่อฝนตกแรกทันที</span>
                </div>

                {/* Layer 2 */}
                <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#000000] dark:text-white">
                      2. ชั้นดินตื้น (ความลึก 3 - 9 ซม.)
                    </span>
                    <span className="font-mono-num font-bold text-[#2a9d99]">
                      {data.soil.soilMoistureSub3_9cm} m³/m³
                    </span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2a9d99] h-full rounded-full"
                      style={{ width: `${Math.min((data.soil.soilMoistureSub3_9cm / 0.5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#615d59]">ชั้นรากพืชผิวดิน และโครงสร้างการซึมน้ำ</span>
                </div>

                {/* Layer 3 */}
                <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#000000] dark:text-white">
                      3. ชั้นดินลึก (ความลึก 9 - 27 ซม.)
                    </span>
                    <span className="font-mono-num font-bold text-[#dd5b00]">
                      {data.soil.soilMoistureDeep9_27cm} m³/m³
                    </span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#dd5b00] h-full rounded-full"
                      style={{ width: `${Math.min((data.soil.soilMoistureDeep9_27cm / 0.5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#615d59]">ตัวชี้วัดความเสี่ยงดินโคลนถล่มในพื้นที่ลาดเชิงเขา</span>
                </div>
              </div>

              {/* Soil Alert Notice */}
              <div className="p-3.5 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs space-y-1.5">
                <div className="font-bold text-[#000000] dark:text-white flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-[#dd5b00]" />
                  <span>สรุปการประเมินสภาพดิน:</span>
                </div>
                <p className="text-[#615d59] dark:text-[#9b9a97] leading-relaxed text-[11px]">
                  {data.summary.soilWarning}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
