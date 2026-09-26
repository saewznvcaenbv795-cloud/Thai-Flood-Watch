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
    <div className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#0075de]/10 text-[#0075de]">
              <Navigation className="w-3.5 h-3.5" />
            </span>
            ตรวจสอบความเสี่ยงน้ำท่วมบริเวณที่คุณอยู่ (GPS)
          </h3>
          <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
            คำนวณระยะห่างระหว่างตำแหน่งของคุณกับสถานีโทรมาตรและปริมาณฝนสะสมล่าสุด
          </p>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="px-4 py-1.5 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs active:scale-95"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'กำลังค้นหาตำแหน่ง…' : userLocation ? 'อัปเดตตำแหน่ง GPS' : 'ระบุตำแหน่งของฉัน'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-[#dd5b00]/10 border border-[#dd5b00]/30 text-[#793400] dark:text-[#ff8c42] text-xs mb-3 flex items-center gap-1.5">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {!userLocation ? (
        <div className="p-3.5 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] text-center text-xs text-[#615d59] dark:text-[#9b9a97]">
          กดปุ่ม <b>"ระบุตำแหน่งของฉัน"</b> ด้านบน เพื่อให้ระบบค้นหาสถานีวัดระดับน้ำและกลุ่มฝนที่ใกล้ที่สุดรอบตัวคุณโดยอัตโนมัติ (ปลอดภัย ไม่มีการบันทึกพิกัดส่วนตัว)
        </div>
      ) : nearestResults ? (
        <div className="space-y-3">
          {/* Risk Level Callout - Notion Callout */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              nearestResults.riskLevel === 'critical'
                ? 'bg-[#e03e3e]/10 border-[#e03e3e]/30 text-[#e03e3e] dark:text-[#ff6464]'
                : nearestResults.riskLevel === 'high'
                ? 'bg-[#dd5b00]/10 border-[#dd5b00]/30 text-[#dd5b00] dark:text-[#ff8c42]'
                : nearestResults.riskLevel === 'moderate'
                ? 'bg-[#62aef0]/15 border-[#62aef0]/30 text-[#0075de] dark:text-[#62aef0]'
                : 'bg-[#1aae39]/10 border-[#1aae39]/30 text-[#1aae39] dark:text-[#42cc68]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {nearestResults.riskLevel === 'critical' || nearestResults.riskLevel === 'high' ? (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 shrink-0" />
              )}
              <div>
                <div className="font-bold text-xs">
                  {nearestResults.riskLevel === 'critical' && '⚠️ มีสถานีน้ำล้นตลิ่งในรัศมี 25 กม. จากตำแหน่งของคุณ'}
                  {nearestResults.riskLevel === 'high' && '🟠 มีสถานีน้ำมากหรือฝนตกหนักมากในรัศมี 25 กม.'}
                  {nearestResults.riskLevel === 'moderate' && '🔵 มีฝนตกปานกลางในพื้นที่ใกล้เคียง ระดับน้ำในเกณฑ์เฝ้าระวัง'}
                  {nearestResults.riskLevel === 'low' && '🟢 สถานการณ์น้ำในรัศมีรอบตัวคุณอยู่ในเกณฑ์ปกติ'}
                </div>
                <div className="text-[11px] opacity-80 font-mono-num">
                  พิกัดของคุณ: {fmt(userLocation.lat, 4)}, {fmt(userLocation.lng, 4)}
                </div>
              </div>
            </div>

            <button
              onClick={() => onFlyToCoords(userLocation.lat, userLocation.lng, 13)}
              className="px-3 py-1 rounded-full bg-white dark:bg-[#202020] text-xs font-medium hover:opacity-80 transition cursor-pointer shrink-0 border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#31302e] dark:text-[#d4d4d4]"
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
                className="p-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] hover:border-[#0075de] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#9b9a97] mb-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0075de] dark:text-[#62aef0]">
                    <Droplets className="w-3.5 h-3.5" />
                    สถานีระดับน้ำที่ใกล้ที่สุด
                  </span>
                  <span className="font-mono-num font-bold text-xs text-[#000000] dark:text-[#ffffff]">
                    ห่าง {fmt(nearestResults.nearestStation.dist, 1)} กม.
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#000000] dark:text-[#ffffff] group-hover:text-[#0075de] truncate">
                  {nearestResults.nearestStation.name}
                </h4>
                <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] mt-0.5">
                  จ.{nearestResults.nearestStation.province} อ.{nearestResults.nearestStation.amphoe} · {nearestResults.nearestStation.basin}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
                  <span className="text-[#31302e] dark:text-[#d4d4d4]">ความจุ: <b className="font-mono-num">{fmt(nearestResults.nearestStation.pct, 0)}%</b></span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    nearestResults.nearestStation.level === 5 ? 'bg-[#e03e3e] text-white' : nearestResults.nearestStation.level === 4 ? 'bg-[#dd5b00] text-white' : 'bg-[#1aae39] text-white'
                  }`}>
                    {LEVELS[nearestResults.nearestStation.level]?.label || 'ปกติ'}
                  </span>
                </div>
              </div>
            )}

            {/* Nearest Rain Station */}
            {nearestResults.nearestRain && (
              <div className="p-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525]">
                <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#9b9a97] mb-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0075de] dark:text-[#62aef0]">
                    <CloudRain className="w-3.5 h-3.5" />
                    สถานีวัดฝนที่ใกล้ที่สุด
                  </span>
                  <span className="font-mono-num font-bold text-xs text-[#000000] dark:text-[#ffffff]">
                    ห่าง {fmt(nearestResults.nearestRain.dist, 1)} กม.
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#000000] dark:text-[#ffffff] truncate">
                  {nearestResults.nearestRain.name}
                </h4>
                <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] mt-0.5">
                  จ.{nearestResults.nearestRain.province} อ.{nearestResults.nearestRain.amphoe}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
                  <span className="text-[#31302e] dark:text-[#d4d4d4]">ฝน 24 ชม.:</span>
                  <span className="font-bold text-[#0075de] dark:text-[#62aef0] font-mono-num">
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
