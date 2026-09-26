import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Droplets, CloudRain, ExternalLink } from 'lucide-react';
import { WaterStation, RainStation, DamData } from '../types';
import { fmt, LEVELS } from '../utils/formatters';

interface MyLocationRiskProps {
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
  onFlyToCoords: (lat: number, lng: number, zoom?: number) => void;
  onSelectStation: (stationId: string) => void;
}

// Haversine formula in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const MyLocationRisk: React.FC<MyLocationRiskProps> = ({
  stations,
  rain,
  dams,
  onFlyToCoords,
  onSelectStation,
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
        onFlyToCoords(coords.lat, coords.lng, 12);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('กรุณากด "อนุญาต" (Allow) ให้เบราว์เซอร์เข้าถึงตำแหน่ง GPS');
        } else {
          setErrorMsg('ไม่สามารถตรวจจับตำแหน่งปัจจุบันได้ กรุณาลองใหม่อีกครั้ง');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Calculate nearest stations
  const nearestResults = React.useMemo(() => {
    if (!userLocation) return null;

    // 1. Nearest water stations
    const stationsWithDist = stations.map((s) => ({
      ...s,
      dist: getDistanceKm(userLocation.lat, userLocation.lng, s.lat, s.lng),
    }));
    stationsWithDist.sort((a, b) => a.dist - b.dist);
    const nearestStation = stationsWithDist[0] || null;

    // Check critical stations within 25 km
    const criticalNearby = stationsWithDist.filter((s) => s.dist <= 25 && s.level >= 4);

    // 2. Nearest rain station
    const rainWithDist = rain.map((r) => ({
      ...r,
      dist: getDistanceKm(userLocation.lat, userLocation.lng, r.lat, r.lng),
    }));
    rainWithDist.sort((a, b) => a.dist - b.dist);
    const nearestRain = rainWithDist[0] || null;

    // Check heavy rain nearby (< 25km, > 35mm)
    const heavyRainNearby = rainWithDist.filter((r) => r.dist <= 25 && r.mm > 35);

    // Overall Risk evaluation
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (criticalNearby.some((s) => s.level === 5)) {
      riskLevel = 'critical';
    } else if (criticalNearby.length > 0 || heavyRainNearby.some((r) => r.mm > 90)) {
      riskLevel = 'high';
    } else if (heavyRainNearby.length > 0 || (nearestStation && nearestStation.level === 3 && (nearestStation.pct ?? 0) > 60)) {
      riskLevel = 'moderate';
    }

    return {
      nearestStation,
      criticalNearby,
      nearestRain,
      heavyRainNearby,
      riskLevel,
    };
  }, [userLocation, stations, rain]);

  return (
    <div className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
            ตรวจสอบความเสี่ยงน้ำท่วมบริเวณที่คุณอยู่ (GPS)
          </h3>
          <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
            คำนวณระยะห่างระหว่างตำแหน่งของคุณกับสถานีโทรมาตรและปริมาณฝนสะสมล่าสุด
          </p>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="px-3.5 py-1.5 rounded-lg bg-[#0a6c86] hover:bg-[#095f76] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'กำลังค้นหาตำแหน่ง…' : userLocation ? 'อัปเดตตำแหน่ง GPS' : 'ระบุตำแหน่งของฉัน'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs mb-3">
          {errorMsg}
        </div>
      )}

      {!userLocation ? (
        <div className="p-4 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-dashed border-[#d2dedd] dark:border-[#233a3d] text-center text-xs text-[#53676b] dark:text-[#91a6a9]">
          กดปุ่ม <b>"ระบุตำแหน่งของฉัน"</b> ด้านบน เพื่อให้ระบบค้นหาสถานีวัดระดับน้ำและกลุ่มฝนที่ใกล้ที่สุดรอบตัวคุณโดยอัตโนมัติ (ปลอดภัย ไม่มีการบันทึกพิกัดส่วนตัว)
        </div>
      ) : nearestResults ? (
        <div className="space-y-3">
          {/* Risk Level Callout */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              nearestResults.riskLevel === 'critical'
                ? 'bg-red-500/15 border-red-500/40 text-red-900 dark:text-red-200'
                : nearestResults.riskLevel === 'high'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200'
                : nearestResults.riskLevel === 'moderate'
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-900 dark:text-sky-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {nearestResults.riskLevel === 'critical' || nearestResults.riskLevel === 'high' ? (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <div>
                <div className="font-bold text-xs">
                  {nearestResults.riskLevel === 'critical' && '⚠️ มีสถานีน้ำล้นตลิ่งในรัศมี 25 กม. จากตำแหน่งของคุณ'}
                  {nearestResults.riskLevel === 'high' && '🟠 มีสถานีน้ำมากหรือฝนตกหนักมากในรัศมี 25 กม.'}
                  {nearestResults.riskLevel === 'moderate' && '🔵 มีฝนตกปานกลางในพื้นที่ใกล้เคียง ระดับน้ำในเกณฑ์เฝ้าระวัง'}
                  {nearestResults.riskLevel === 'low' && '🟢 สถานการณ์น้ำในรัศมีรอบตัวคุณอยู่ในเกณฑ์ปกติ'}
                </div>
                <div className="text-[11px] opacity-80">
                  พิกัดของคุณ: {fmt(userLocation.lat, 4)}, {fmt(userLocation.lng, 4)}
                </div>
              </div>
            </div>

            <button
              onClick={() => onFlyToCoords(userLocation.lat, userLocation.lng, 13)}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-black/40 text-xs font-semibold hover:opacity-80 transition cursor-pointer shrink-0 border border-current"
            >
              ซูมแผนที่ดูรอบตัว
            </button>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Nearest Water Station */}
            {nearestResults.nearestStation && (
              <div
                onClick={() => onSelectStation(nearestResults.nearestStation.id)}
                className="p-3 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:border-[#0a6c86] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0a6c86] dark:text-[#3fb6d3]">
                    <Droplets className="w-3.5 h-3.5" />
                    สถานีระดับน้ำที่ใกล้ที่สุด
                  </span>
                  <span className="font-mono-num font-bold text-xs text-[#0e2429] dark:text-[#e2eeee]">
                    ห่าง {fmt(nearestResults.nearestStation.dist, 1)} กม.
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0e2429] dark:text-[#e2eeee] group-hover:text-[#0a6c86] truncate">
                  {nearestResults.nearestStation.name}
                </h4>
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mt-0.5">
                  จ.{nearestResults.nearestStation.province} อ.{nearestResults.nearestStation.amphoe} · {nearestResults.nearestStation.basin}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-[#d2dedd]/50 dark:border-[#233a3d]">
                  <span>ความจุ: <b className="font-mono-num">{fmt(nearestResults.nearestStation.pct, 0)}%</b></span>
                  <span className={`font-semibold px-2 py-0.2 rounded-full text-[10px] ${
                    nearestResults.nearestStation.level === 5 ? 'bg-red-500 text-white' : nearestResults.nearestStation.level === 4 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {LEVELS[nearestResults.nearestStation.level]?.label || 'ปกติ'}
                  </span>
                </div>
              </div>
            )}

            {/* Nearest Rain Station */}
            {nearestResults.nearestRain && (
              <div className="p-3 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]">
                <div className="flex items-center justify-between text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-1">
                  <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                    <CloudRain className="w-3.5 h-3.5" />
                    สถานีวัดฝนที่ใกล้ที่สุด
                  </span>
                  <span className="font-mono-num font-bold text-xs text-[#0e2429] dark:text-[#e2eeee]">
                    ห่าง {fmt(nearestResults.nearestRain.dist, 1)} กม.
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0e2429] dark:text-[#e2eeee] truncate">
                  {nearestResults.nearestRain.name}
                </h4>
                <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mt-0.5">
                  จ.{nearestResults.nearestRain.province} อ.{nearestResults.nearestRain.amphoe}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-[#d2dedd]/50 dark:border-[#233a3d]">
                  <span>ฝน 24 ชม.:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono-num">
                    {fmt(nearestResults.nearestRain.mm, 1)} มม.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
