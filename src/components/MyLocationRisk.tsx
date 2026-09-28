import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Droplets, CloudRain, ExternalLink, Compass, Edit3, Check } from 'lucide-react';
import { WaterStation, RainStation, DamData } from '../types';
import { fmt, LEVELS } from '../utils/formatters';
import { requestAccurateGeolocation, reverseGeocodeThai, AccurateUserLocation } from '../utils/geolocation';

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
  const [accurateLoc, setAccurateLoc] = useState<AccurateUserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual coordinate edit modal/fields
  const [isEditingCoords, setIsEditingCoords] = useState(false);
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');

  const handleGetLocation = async () => {
    setIsLocating(true);
    setErrorMsg(null);
    try {
      const loc = await requestAccurateGeolocation();
      setAccurateLoc(loc);
      setCustomLat(loc.lat.toFixed(5));
      setCustomLng(loc.lng.toFixed(5));
      onFlyToCoords(loc.lat, loc.lng, 13);
    } catch (err: any) {
      setErrorMsg(err?.message || 'ไม่สามารถตรวจจับตำแหน่ง GPS ได้ กรุณาตรวจสอบการตั้งค่าตำแหน่งในเครื่อง');
    } finally {
      setIsLocating(false);
    }
  };

  const handleApplyCustomCoords = async () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng) || lat < 5 || lat > 21 || lng < 97 || lng > 106) {
      setErrorMsg('กรุณากรอกพิกัดละติจูด (5 - 21) และลองจิจูด (97 - 106) ของประเทศไทยให้ถูกต้อง');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);
    try {
      const geo = await reverseGeocodeThai(lat, lng);
      setAccurateLoc({
        lat,
        lng,
        accuracyMeters: 5,
        accuracyLevel: 'high',
        accuracyText: 'พิกัดสวน/บ้านที่คุณกำหนดเองโดยตรง (ความแม่นยำสูงสุด)',
        source: 'manual',
        displayName: geo.displayName,
        subdistrict: geo.subdistrict,
        district: geo.district,
        provinceName: geo.provinceName,
        matchedProvince: geo.matchedProvince,
        timestamp: new Date(),
      });
      setIsEditingCoords(false);
      onFlyToCoords(lat, lng, 14);
    } catch (err: any) {
      setErrorMsg('ไม่สามารถค้นหาข้อมูลพื้นที่ของพิกัดนี้ได้');
    } finally {
      setIsLocating(false);
    }
  };

  // Calculate nearest stations
  const nearestResults = React.useMemo(() => {
    if (!accurateLoc) return null;

    // 1. Nearest water stations
    const stationsWithDist = stations.map((s) => ({
      ...s,
      dist: getDistanceKm(accurateLoc.lat, accurateLoc.lng, s.lat, s.lng),
    }));
    stationsWithDist.sort((a, b) => a.dist - b.dist);
    const nearestStation = stationsWithDist[0] || null;

    // Check critical stations within 25 km
    const criticalNearby = stationsWithDist.filter((s) => s.dist <= 25 && s.level >= 4);

    // 2. Nearest rain station
    const rainWithDist = rain.map((r) => ({
      ...r,
      dist: getDistanceKm(accurateLoc.lat, accurateLoc.lng, r.lat, r.lng),
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
  }, [accurateLoc, stations, rain]);

  return (
    <div className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#0075de]/10 text-[#0075de]">
              <Navigation className="w-3.5 h-3.5" />
            </span>
            ตรวจสอบความเสี่ยงน้ำท่วมบริเวณสวน / บ้านของคุณ (GPS แม่นยำสูง)
          </h3>
          <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
            ตรวจจับพิกัดดาวเทียมสด พร้อมระบบระบุตำบล อำเภอ จังหวัด และคำนวณระยะห่างสถานีน้ำ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="px-4 py-1.5 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs active:scale-95"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'กำลังดึงดาวเทียม…' : accurateLoc ? 'อัปเดต GPS สด' : 'ระบุตำแหน่งของฉัน'}</span>
          </button>

          <button
            onClick={() => setIsEditingCoords(!isEditingCoords)}
            className="px-3 py-1.5 rounded-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] text-xs font-medium text-[#31302e] dark:text-[#d4d4d4] hover:bg-white flex items-center gap-1 transition cursor-pointer"
            title="กรอกพิกัดสวนเอง"
          >
            <Edit3 className="w-3 h-3 text-[#615d59]" />
            <span>กำหนดพิกัดสวนเอง</span>
          </button>
        </div>
      </div>

      {/* Manual Coordinate Form */}
      {isEditingCoords && (
        <div className="p-3 rounded-xl bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-2">
          <div className="text-xs font-bold text-[#000000] dark:text-white flex items-center justify-between">
            <span>📍 กำหนดพิกัดสวนหรือที่ดินของคุณโดยตรง (Lat / Long):</span>
            <span className="text-[11px] text-[#615d59] font-normal">สามารถคัดลอกจาก Google Maps ได้</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-[#615d59] block mb-1">ละติจูด (Latitude เช่น 14.3524):</label>
              <input
                type="text"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="14.3524"
                className="w-full px-3 py-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-xs text-[#000000] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#615d59] block mb-1">ลองจิจูด (Longitude เช่น 100.5682):</label>
              <input
                type="text"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                placeholder="100.5682"
                className="w-full px-3 py-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-xs text-[#000000] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditingCoords(false)}
              className="px-3 py-1 rounded-md text-xs text-[#615d59] hover:bg-black/5 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleApplyCustomCoords}
              className="px-3.5 py-1 rounded-md bg-[#0075de] text-white text-xs font-medium hover:bg-[#005bab] cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ใช้พิกัดนี้ตรวจความเสี่ยง</span>
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-[#dd5b00]/10 border border-[#dd5b00]/30 text-[#793400] dark:text-[#ff8c42] text-xs flex items-center gap-1.5">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {!accurateLoc ? (
        <div className="p-3.5 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] text-center text-xs text-[#615d59] dark:text-[#9b9a97] space-y-1">
          <p>
            กดปุ่ม <b>"ระบุตำแหน่งของฉัน"</b> ด้านบน ระบบจะใช้สัญญาณดาวเทียม GPS ร่วมกับระบบแผนที่เพื่อค้นหาแปลงสวนของคุณอย่างแม่นยำ
          </p>
          <p className="text-[11px] text-[#0075de]">
            (ปลอดภัย 100% ไม่มีการบันทึกพิกัดส่วนตัว และสามารถลากหมุดบนแผนที่เพื่อปรับให้ตรงสวนได้)
          </p>
        </div>
      ) : nearestResults ? (
        <div className="space-y-3">
          {/* Accuracy & Location Banner */}
          <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#000000] dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0075de]" />
                <span>{accurateLoc.displayName}</span>
              </div>
              <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] font-mono-num flex items-center gap-2">
                <span>พิกัด: {accurateLoc.lat.toFixed(5)}, {accurateLoc.lng.toFixed(5)}</span>
                <span>·</span>
                <span className={`font-semibold ${
                  accurateLoc.accuracyLevel === 'high'
                    ? 'text-[#1aae39]'
                    : accurateLoc.accuracyLevel === 'medium'
                    ? 'text-[#dd5b00]'
                    : 'text-[#e03e3e]'
                }`}>
                  {accurateLoc.accuracyText}
                </span>
              </div>
            </div>

            <button
              onClick={() => onFlyToCoords(accurateLoc.lat, accurateLoc.lng, 14)}
              className="py-1 px-3 rounded-full bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#31302e] dark:text-[#d4d4d4] hover:bg-black/5 text-xs font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#0075de]" />
              <span>ดูจุดบนแผนที่</span>
            </button>
          </div>

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
                <div className="text-[11px] opacity-80">
                  วิเคราะห์ข้อมูลตามตำแหน่งจริงของสวน/บ้านคุณ
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Nearest Water Station */}
            <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
              <div className="flex items-center justify-between text-[#615d59] dark:text-[#9b9a97] mb-1.5">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#0075de]" />
                  <span>สถานีวัดระดับน้ำที่ใกล้ที่สุด:</span>
                </span>
                {nearestResults.nearestStation && (
                  <span className="font-mono-num font-semibold text-[#0075de]">
                    ห่าง ~{fmt(nearestResults.nearestStation.dist, 1)} กม.
                  </span>
                )}
              </div>

              {nearestResults.nearestStation ? (
                <div>
                  <div className="font-bold text-[#000000] dark:text-[#ffffff] text-sm mb-1 flex items-center justify-between">
                    <span>{nearestResults.nearestStation.name}</span>
                    <button
                      onClick={() => {
                        onSelectStation(nearestResults.nearestStation!.id);
                        onFlyToCoords(nearestResults.nearestStation!.lat, nearestResults.nearestStation!.lng, 14);
                      }}
                      className="text-[#0075de] hover:underline text-xs flex items-center gap-0.5 cursor-pointer font-normal"
                    >
                      <span>ดูสถานี</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[#615d59] dark:text-[#9b9a97] text-[11px]">
                    {nearestResults.nearestStation.amphoe ? `อ.${nearestResults.nearestStation.amphoe} ` : ''}
                    จ.{nearestResults.nearestStation.province} · {nearestResults.nearestStation.basin}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span>สถานะระดับน้ำ:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        LEVELS[nearestResults.nearestStation.level]?.badgeClass || ''
                      }`}
                    >
                      {LEVELS[nearestResults.nearestStation.level]?.label || 'ปกติ'} ({fmt(nearestResults.nearestStation.pct, 0)}%)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[#615d59]">ไม่มีข้อมูลสถานีในรัศมีใกล้เคียง</div>
              )}
            </div>

            {/* Nearest Rain Station */}
            <div className="p-3 rounded-lg bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
              <div className="flex items-center justify-between text-[#615d59] dark:text-[#9b9a97] mb-1.5">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#0075de]" />
                  <span>สถานีวัดปริมาณฝนที่ใกล้ที่สุด:</span>
                </span>
                {nearestResults.nearestRain && (
                  <span className="font-mono-num font-semibold text-[#0075de]">
                    ห่าง ~{fmt(nearestResults.nearestRain.dist, 1)} กม.
                  </span>
                )}
              </div>

              {nearestResults.nearestRain ? (
                <div>
                  <div className="font-bold text-[#000000] dark:text-[#ffffff] text-sm mb-1 flex items-center justify-between">
                    <span>{nearestResults.nearestRain.name}</span>
                    <span className="font-mono-num font-bold text-xs text-[#000000] dark:text-white">
                      ฝน 24 ชม: {fmt(nearestResults.nearestRain.mm, 1)} มม.
                    </span>
                  </div>
                  <div className="text-[#615d59] dark:text-[#9b9a97] text-[11px]">
                    {nearestResults.nearestRain.amphoe ? `อ.${nearestResults.nearestRain.amphoe} ` : ''}
                    จ.{nearestResults.nearestRain.province}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span>โอกาสเสี่ยงน้ำท่วมขัง:</span>
                    <span className="font-semibold text-[#31302e] dark:text-[#d4d4d4]">
                      {nearestResults.nearestRain.mm > 90
                        ? '🚨 เสี่ยงน้ำท่วมฉับพลันสูงมาก'
                        : nearestResults.nearestRain.mm > 35
                        ? '🟠 ฝนตกหนัก ระวังน้ำท่วมขัง'
                        : '🟢 ปริมาณฝนไม่วิกฤต'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[#615d59]">ไม่มีข้อมูลสถานีฝนในรัศมีใกล้เคียง</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
