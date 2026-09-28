import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
  Compass,
  Calendar,
  Clock,
  MapPin,
  Search,
  Navigation,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { THAI_PROVINCES, ProvinceLocation } from '../data/provinces';
import { requestAccurateGeolocation } from '../utils/geolocation';
import {
  fetchWeatherForecast,
  WeatherData,
  DailyForecast,
  HourlyForecast,
  getWeatherConditionInfo
} from '../services/weatherService';
import { fmt } from '../utils/formatters';

interface WeatherForecastViewerProps {
  initialProvinceName?: string;
  onFlyToCoords?: (lat: number, lng: number) => void;
}

export const WeatherForecastViewer: React.FC<WeatherForecastViewerProps> = ({
  initialProvinceName = 'กรุงเทพมหานคร',
  onFlyToCoords,
}) => {
  // Selected Province / Location
  const [selectedProvince, setSelectedProvince] = useState<ProvinceLocation>(() => {
    return THAI_PROVINCES.find((p) => p.name === initialProvinceName) || THAI_PROVINCES[0];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'today' | 'hourly' | 'tomorrow' | 'fiveday'>('all');

  // Weather data state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // GPS My Location
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isCustomGps, setIsCustomGps] = useState<boolean>(false);

  // Fetch forecast data
  const loadForecast = useCallback(async (lat: number, lng: number, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(lat, lng, name);
      setWeather(data);
    } catch (err: any) {
      console.error('Failed to fetch weather forecast:', err);
      setError('ไม่สามารถเชื่อมต่อระบบพยากรณ์อากาศได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(selectedProvince.lat, selectedProvince.lng, selectedProvince.name);
  }, [selectedProvince, loadForecast]);

  // Handle GPS location
  const handleUseMyLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await requestAccurateGeolocation();
      setIsCustomGps(true);
      const customLoc: ProvinceLocation = {
        ...loc.matchedProvince,
        name: loc.displayName,
        lat: loc.lat,
        lng: loc.lng,
      };
      setSelectedProvince(customLoc);
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      setError(err?.message || 'ไม่สามารถเข้าถึงตำแหน่ง GPS ของคุณได้ โปรดอนุญาตสิทธิ์ตำแหน่งในเบราว์เซอร์');
    } finally {
      setIsLocating(false);
    }
  };

  // Filtered provinces for dropdown / search
  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return THAI_PROVINCES;
    const q = searchQuery.toLowerCase().trim();
    return THAI_PROVINCES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.enName.toLowerCase().includes(q) || p.regionName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const quickHotspots = useMemo(() => {
    return THAI_PROVINCES.filter((p) => p.isFloodHotspot).slice(0, 8);
  }, []);

  // Weather icon component helper
  const renderWeatherIcon = (iconType: string, className = 'w-6 h-6') => {
    switch (iconType) {
      case 'clear':
        return <Sun className={`${className} text-[#dd5b00]`} />;
      case 'partly_cloudy':
        return <Cloud className={`${className} text-[#62aef0]`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-[#615d59]`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${className} text-[#2a9d99]`} />;
      case 'heavy_rain':
        return <CloudRain className={`${className} text-[#dd5b00]`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-[#e03e3e]`} />;
      case 'rain':
      default:
        return <CloudRain className={`${className} text-[#0075de]`} />;
    }
  };

  const todayForecast = weather?.daily?.[0];
  const tomorrowForecast = weather?.daily?.[1];
  const fiveDayForecasts = weather?.daily?.slice(0, 5) || [];

  return (
    <section className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-4">
      {/* 1. Header & Location Selector Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-[#0075de]/10 text-[#0075de]">
              <CloudRain className="w-5 h-5" />
            </span>
            <span>ระบบพยากรณ์อากาศ & ฝนตกสะสม (Weather & Rain Forecast)</span>
          </h2>
          <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
            พยากรณ์สภาพอากาศรายชั่วโมง วันนี้ พรุ่งนี้ และ 5 วันข้างหน้า (Open-Meteo Open Data · ฟรี 100%)
          </p>
        </div>

        {/* Location selector tools */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* GPS Button */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-full bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#31302e] dark:text-[#d4d4d4] hover:bg-white hover:border-[#0075de] font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
            title="ค้นหาพยากรณ์ตำแหน่ง GPS ปัจจุบัน"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#0075de] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'ระบุพิกัด…' : 'ตำแหน่งของฉัน (GPS)'}</span>
          </button>

          {/* Province Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedProvince.name}
              onChange={(e) => {
                const found = THAI_PROVINCES.find((p) => p.name === e.target.value);
                if (found) {
                  setSelectedProvince(found);
                  setIsCustomGps(false);
                }
              }}
              className="py-1.5 pl-3 pr-8 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#252525] text-[#000000] dark:text-[#ffffff] font-medium cursor-pointer focus:outline-none focus:border-[#0075de]"
            >
              {THAI_PROVINCES.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  จ.{prov.name} ({prov.regionName})
                </option>
              ))}
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => loadForecast(selectedProvince.lat, selectedProvince.lng, selectedProvince.name)}
            disabled={isLoading}
            className="p-1.5 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#252525] text-[#615d59] hover:text-[#000000] transition cursor-pointer disabled:opacity-50"
            title="รีเฟรชการพยากรณ์"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Province Hotspots Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
        <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] font-medium shrink-0 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#0075de]" />
          พื้นที่เฝ้าระวังด่วน:
        </span>
        {quickHotspots.map((p) => {
          const isSelected = selectedProvince.name === p.name;
          return (
            <button
              key={p.name}
              onClick={() => {
                setSelectedProvince(p);
                setIsCustomGps(false);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#31302e] dark:text-[#d4d4d4] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
              }`}
            >
              จ.{p.name}
            </button>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs (All, Today, Hourly, Tomorrow, 5 Days) */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-2">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-[#f6f5f4] dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000]'
          }`}
        >
          สรุปภาพรวมทั้งหมด
        </button>
        <button
          onClick={() => setSelectedTab('today')}
          className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
            selectedTab === 'today'
              ? 'bg-[#f6f5f4] dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000]'
          }`}
        >
          พยากรณ์วันนี้
        </button>
        <button
          onClick={() => setSelectedTab('hourly')}
          className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
            selectedTab === 'hourly'
              ? 'bg-[#f6f5f4] dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000]'
          }`}
        >
          รายชั่วโมง (Hourly)
        </button>
        <button
          onClick={() => setSelectedTab('tomorrow')}
          className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
            selectedTab === 'tomorrow'
              ? 'bg-[#f6f5f4] dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000]'
          }`}
        >
          วันพรุ่งนี้
        </button>
        <button
          onClick={() => setSelectedTab('fiveday')}
          className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
            selectedTab === 'fiveday'
              ? 'bg-[#f6f5f4] dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000]'
          }`}
        >
          5 วันข้างหน้า (5-Day Trend)
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#615d59] dark:text-[#9b9a97]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#0075de]" />
          <span>กำลังประมวลผลข้อมูลพยากรณ์อากาศ {selectedProvince.name}…</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-[#e03e3e] text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => loadForecast(selectedProvince.lat, selectedProvince.lng, selectedProvince.name)}
            className="underline font-semibold hover:opacity-80"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {weather && !isLoading && (
        <div className="space-y-4">
          {/* TOP BANNER: FLOOD ADVISORY BASED ON FORECAST */}
          <div
            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              weather.summary.floodRiskLevel === 'severe'
                ? 'bg-[#e03e3e]/10 border-[#e03e3e]/40 text-[#e03e3e]'
                : weather.summary.floodRiskLevel === 'high'
                ? 'bg-[#dd5b00]/10 border-[#dd5b00]/40 text-[#dd5b00]'
                : weather.summary.floodRiskLevel === 'moderate'
                ? 'bg-[#0075de]/10 border-[#0075de]/30 text-[#0075de]'
                : 'bg-[#1aae39]/10 border-[#1aae39]/30 text-[#1aae39]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {weather.summary.floodRiskLevel === 'severe' || weather.summary.floodRiskLevel === 'high' ? (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold text-xs sm:text-sm">
                  การประเมินความเสี่ยงน้ำท่วมจากฝนสะสม ({selectedProvince.name}):
                </div>
                <p className="text-xs text-[#31302e] dark:text-[#d4d4d4] leading-relaxed">
                  {weather.summary.floodAdvisory}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-auto font-mono-num">
              <div className="text-right">
                <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">ฝนสะสม 5 วัน:</div>
                <div className="font-bold text-sm text-[#000000] dark:text-[#ffffff]">
                  {weather.summary.fiveDayRainMm} มม.
                </div>
              </div>
              {onFlyToCoords && (
                <button
                  onClick={() => onFlyToCoords(selectedProvince.lat, selectedProvince.lng)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#0075de] dark:text-[#62aef0] font-medium hover:bg-[#f6f5f4] transition"
                >
                  เปิดดูในแผนที่
                </button>
              )}
            </div>
          </div>

          {/* VIEW 1: TODAY'S WEATHER HIGHLIGHT */}
          {(selectedTab === 'all' || selectedTab === 'today') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              {/* Primary Current Card */}
              <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#0075de] dark:text-[#62aef0] uppercase tracking-wide">
                      พยากรณ์อากาศปัจจุบัน · {selectedProvince.name}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-[#ffffff] font-display">
                      {weather.current.condition}
                    </h3>
                    <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                      อุณหภูมิจริง {weather.current.temp}°C · รู้สึกเหมือน {weather.current.apparentTemp}°C
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs">
                    {renderWeatherIcon(weather.current.iconType, 'w-10 h-10')}
                  </div>
                </div>

                {/* Big numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                    <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">ฝนวันนี้รวม</span>
                    <span className="text-base font-bold font-mono-num text-[#0075de] dark:text-[#62aef0]">
                      {todayForecast?.rainSumMm ?? 0} มม.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                    <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">โอกาสเกิดฝน</span>
                    <span className="text-base font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
                      {todayForecast?.rainProbMax ?? 0}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                    <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">ความชื้น</span>
                    <span className="text-base font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
                      {weather.current.humidity}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                    <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">ความเร็วลม</span>
                    <span className="text-base font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
                      {weather.current.windSpeed} กม./ชม.
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Details & Day Range Card */}
              <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#000000] dark:text-[#ffffff] uppercase tracking-wide">
                    ดัชนีและช่วงเวลาสำคัญ (วันนี้)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-md bg-[#f6f5f4] dark:bg-[#252525]">
                      <span className="text-[#615d59] dark:text-[#9b9a97]">อุณหภูมิ สูงสุด / ต่ำสุด:</span>
                      <span className="font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
                        {todayForecast?.maxTemp}°C / {todayForecast?.minTemp}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-[#f6f5f4] dark:bg-[#252525]">
                      <span className="text-[#615d59] dark:text-[#9b9a97]">ช่วงเวลาฝนตกชุกที่สุด:</span>
                      <span className="font-bold text-[#0075de] dark:text-[#62aef0]">
                        {weather.summary.highestRainTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-[#f6f5f4] dark:bg-[#252525]">
                      <span className="text-[#615d59] dark:text-[#9b9a97]">พระอาทิตย์ขึ้น / ตก:</span>
                      <span className="font-mono-num text-[#000000] dark:text-[#ffffff]">
                        🌅 {todayForecast?.sunrise} น. · 🌇 {todayForecast?.sunset} น.
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-[#f6f5f4] dark:bg-[#252525]">
                      <span className="text-[#615d59] dark:text-[#9b9a97]">ดัชนีรังสี UV สูงสุด:</span>
                      <span className="font-mono-num font-bold text-[#dd5b00]">
                        ระดับ {todayForecast?.uvIndexMax} (ปานกลาง-สูง)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: HOURLY FORECAST SCROLLER (24 - 36 HOURS) */}
          {(selectedTab === 'all' || selectedTab === 'hourly') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0075de]" />
                  <span>พยากรณ์รายชั่วโมง (Hourly Forecast - 36 ชั่วโมงข้างหน้า)</span>
                </h3>
                <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                  เลื่อนขวาเพื่อดูเวลาถัดไป →
                </span>
              </div>

              {/* Scrollable container */}
              <div className="overflow-x-auto pb-2 -mx-1 px-1">
                <div className="flex items-stretch gap-2 min-w-max">
                  {weather.hourly.map((h, idx) => {
                    const hasRain = h.rainMm > 0;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-center flex flex-col justify-between gap-1.5 w-[85px] transition ${
                          hasRain
                            ? 'bg-[#0075de]/5 border-[#0075de]/30'
                            : 'bg-white dark:bg-[#252525] border-[#e6e6e6] dark:border-[#2f2f2f]'
                        }`}
                      >
                        <span className="text-[11px] font-mono-num text-[#615d59] dark:text-[#9b9a97]">
                          {h.displayTime}
                        </span>

                        <div className="flex justify-center my-1">
                          {renderWeatherIcon(h.iconType, 'w-6 h-6')}
                        </div>

                        <span className="text-xs font-bold font-mono-num text-[#000000] dark:text-[#ffffff]">
                          {h.temp}°C
                        </span>

                        {/* Rain probability & mm */}
                        <div className="pt-1 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-[10px] space-y-0.5">
                          <span className={`block font-mono-num font-semibold ${
                            h.rainProb >= 60 ? 'text-[#0075de] font-bold' : 'text-[#615d59] dark:text-[#9b9a97]'
                          }`}>
                            💧 {h.rainProb}%
                          </span>
                          {h.rainMm > 0 ? (
                            <span className="inline-block px-1 rounded bg-[#0075de] text-white font-mono-num font-bold">
                              {h.rainMm} mm
                            </span>
                          ) : (
                            <span className="text-[#a39e98]">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: TOMORROW'S FORECAST CARD */}
          {(selectedTab === 'all' || selectedTab === 'tomorrow') && tomorrowForecast && (
            <div className="p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                  {renderWeatherIcon(tomorrowForecast.iconType, 'w-8 h-8')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0075de] text-white">
                      วันพรุ่งนี้ ({tomorrowForecast.fullDateText})
                    </span>
                    <span className="text-xs font-semibold text-[#000000] dark:text-[#ffffff]">
                      {tomorrowForecast.condition}
                    </span>
                  </div>
                  <p className="text-xs text-[#615d59] dark:text-[#9b9a97] mt-1">
                    อุณหภูมิ {tomorrowForecast.minTemp}°C - {tomorrowForecast.maxTemp}°C · โอกาสเกิดฝน {tomorrowForecast.rainProbMax}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto font-mono-num">
                <div className="text-right">
                  <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">ปริมาณฝนคาดการณ์:</span>
                  <span className="text-base font-bold text-[#0075de] dark:text-[#62aef0]">
                    {tomorrowForecast.rainSumMm} มม.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97] block">ระดับความเสี่ยง:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    tomorrowForecast.floodRiskLevel === 'severe'
                      ? 'bg-[#e03e3e] text-white'
                      : tomorrowForecast.floodRiskLevel === 'high'
                      ? 'bg-[#dd5b00] text-white'
                      : tomorrowForecast.floodRiskLevel === 'moderate'
                      ? 'bg-[#0075de] text-white'
                      : 'bg-[#1aae39] text-white'
                  }`}>
                    {tomorrowForecast.floodRiskLevel === 'severe' ? 'วิกฤต' : tomorrowForecast.floodRiskLevel === 'high' ? 'ฝนหนัก' : tomorrowForecast.floodRiskLevel === 'moderate' ? 'เฝ้าระวัง' : 'ปกติ'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: 5-DAY TO 7-DAY EXTENDED FORECAST TABLE */}
          {(selectedTab === 'all' || selectedTab === 'fiveday') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0075de]" />
                  <span>แนวโน้มสภาพอากาศ 5 วันข้างหน้า (5-Day Trend)</span>
                </h3>
                <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                  ฝนรวม 5 วัน: <b>{weather.summary.fiveDayRainMm} มม.</b>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {fiveDayForecasts.map((d, i) => {
                  const isHighRain = d.rainSumMm >= 30;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition ${
                        isHighRain
                          ? 'bg-[#0075de]/5 border-[#0075de]/30'
                          : 'bg-white dark:bg-[#202020] border-[#e6e6e6] dark:border-[#2f2f2f]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-[#000000] dark:text-[#ffffff] block">
                            {d.dayName}
                          </span>
                          <span className="text-[10px] text-[#615d59] dark:text-[#9b9a97] font-mono-num">
                            {d.fullDateText}
                          </span>
                        </div>
                        {renderWeatherIcon(d.iconType, 'w-6 h-6')}
                      </div>

                      <div className="text-xs text-[#31302e] dark:text-[#d4d4d4] line-clamp-1">
                        {d.condition}
                      </div>

                      {/* Temp Range */}
                      <div className="text-xs font-mono-num flex items-center justify-between pt-1 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
                        <span className="text-[#0075de] font-semibold">{d.minTemp}°</span>
                        <div className="flex-1 mx-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#0075de] to-[#dd5b00] rounded-full w-full" />
                        </div>
                        <span className="text-[#dd5b00] font-semibold">{d.maxTemp}°</span>
                      </div>

                      {/* Rain Sum */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
                        <span className="text-[#615d59] dark:text-[#9b9a97]">ฝนสะสม:</span>
                        <span className={`font-mono-num font-bold ${
                          isHighRain ? 'text-[#0075de]' : 'text-[#31302e] dark:text-[#d4d4d4]'
                        }`}>
                          {d.rainSumMm} มม. ({d.rainProbMax}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
