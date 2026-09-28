import { THAI_PROVINCES, ProvinceLocation } from '../data/provinces';

export interface AccurateUserLocation {
  lat: number;
  lng: number;
  accuracyMeters: number;
  accuracyLevel: 'high' | 'medium' | 'low';
  accuracyText: string;
  source: 'gps' | 'network' | 'ip' | 'manual';
  displayName: string; // e.g. "ต.บางบาล อ.บางบาล จ.พระนครศรีอยุธยา"
  subdistrict?: string;
  district?: string;
  provinceName: string;
  matchedProvince: ProvinceLocation;
  timestamp: Date;
}

// Reverse Geocode using free OpenStreetMap Nominatim API with fallback
export async function reverseGeocodeThai(lat: number, lng: number): Promise<{
  displayName: string;
  subdistrict?: string;
  district?: string;
  provinceName: string;
  matchedProvince: ProvinceLocation;
}> {
  // First find closest province from our local list as baseline
  let closest = THAI_PROVINCES[0];
  let minD = Infinity;
  for (const p of THAI_PROVINCES) {
    const d = Math.hypot(p.lat - lat, p.lng - lng);
    if (d < minD) {
      minD = d;
      closest = p;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=th`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'th,en;q=0.9',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      // Parse Thai administrative parts
      let province = addr.province || addr.state || '';
      province = province.replace(/^จังหวัด\s*/, '').trim();

      const district = (addr.district || addr.county || addr.city || '').replace(/^(อำเภอ|อ\.)\s*/, '').trim();
      const subdistrict = (addr.subdistrict || addr.suburb || addr.town || addr.village || '').replace(/^(ตำบล|ต\.)\s*/, '').trim();

      // Find matching province in our catalog
      const matched = THAI_PROVINCES.find((p) => p.name === province || province.includes(p.name)) || closest;

      const parts: string[] = [];
      if (subdistrict) parts.push(`ต.${subdistrict}`);
      if (district) parts.push(`อ.${district}`);
      if (matched) parts.push(`จ.${matched.name}`);

      const displayName = parts.length > 0 ? parts.join(' ') : `${matched.name} (พิกัด GPS)`;

      return {
        displayName,
        subdistrict: subdistrict || undefined,
        district: district || undefined,
        provinceName: matched.name,
        matchedProvince: matched,
      };
    }
  } catch {
    // Ignore and use fallback
  }

  return {
    displayName: `${closest.name} (พิกัดดาวเทียม)`,
    provinceName: closest.name,
    matchedProvince: closest,
  };
}

export function requestAccurateGeolocation(): Promise<AccurateUserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับระบบตรวจจับพิกัด GPS'));
    }

    // Try high-accuracy GPS satellite mode first
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 50);

        let accuracyLevel: 'high' | 'medium' | 'low' = 'high';
        let accuracyText = `พิกัดดาวเทียม GPS แม่นยำสูง (คลาดเคลื่อน ±${acc} เมตร)`;
        let source: 'gps' | 'network' | 'ip' = 'gps';

        if (acc > 300) {
          accuracyLevel = 'low';
          source = 'ip';
          accuracyText = `พิกัดจาก IP อินเทอร์เน็ต (คลาดเคลื่อน ±${(acc / 1000).toFixed(1)} กม.) กรุณาเปิดระบบ Location Service และให้สิทธิ์ GPS เบราว์เซอร์`;
        } else if (acc > 45) {
          accuracyLevel = 'medium';
          source = 'network';
          accuracyText = `พิกัดจากเสาสัญญาณ/Wi-Fi (คลาดเคลื่อน ±${acc} เมตร)`;
        }

        const geo = await reverseGeocodeThai(lat, lng);

        resolve({
          lat,
          lng,
          accuracyMeters: acc,
          accuracyLevel,
          accuracyText,
          source,
          displayName: geo.displayName,
          subdistrict: geo.subdistrict,
          district: geo.district,
          provinceName: geo.provinceName,
          matchedProvince: geo.matchedProvince,
          timestamp: new Date(),
        });
      },
      (err) => {
        // Fallback: If high accuracy fails or times out (common indoors or under concrete), try lower accuracy
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const acc = Math.round(pos.coords.accuracy || 1500);

            const geo = await reverseGeocodeThai(lat, lng);

            resolve({
              lat,
              lng,
              accuracyMeters: acc,
              accuracyLevel: 'low',
              accuracyText: `สัญญาณดาวเทียมอ่อน ได้พิกัดโดยประมาณ (คลาดเคลื่อน ±${(acc / 1000).toFixed(1)} กม.)`,
              source: 'network',
              displayName: geo.displayName,
              subdistrict: geo.subdistrict,
              district: geo.district,
              provinceName: geo.provinceName,
              matchedProvince: geo.matchedProvince,
              timestamp: new Date(),
            });
          },
          (fallbackErr) => {
            if (fallbackErr.code === fallbackErr.PERMISSION_DENIED) {
              reject(new Error('ท่านได้ปิดกั้นสิทธิ์เข้าถึงพิกัด กรุณากดรูปกุญแจ 🔒 ที่แถบ URL ของเบราว์เซอร์ แล้วเลือก "อนุญาตตำแหน่ง (Allow Location)"'));
            } else if (fallbackErr.code === fallbackErr.POSITION_UNAVAILABLE) {
              reject(new Error('ไม่พบสัญญาณ GPS กรุณาเปิด Location Service ในการตั้งค่าของโทรศัพท์หรือคอมพิวเตอร์'));
            } else {
              reject(new Error('หมดเวลาค้นหาสัญญาณ GPS กรุณาตรวจสอบว่าเปิด GPS บนอุปกรณ์แล้ว และลองใหม่อีกครั้ง'));
            }
          },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // Force fresh real-time satellite reading, no stale cache!
      }
    );
  });
}
