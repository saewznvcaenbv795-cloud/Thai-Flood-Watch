// Google Earth & Open Hydrology Soil Moisture & River Discharge Service (Free, No Key Required)

export interface SoilMoistureData {
  soilMoistureTop0_1cm: number; // m³/m³ (e.g. 0.35)
  soilMoistureSub3_9cm: number; // m³/m³ (e.g. 0.38)
  soilMoistureDeep9_27cm: number; // m³/m³ (e.g. 0.42)
  soilSaturationPct: number; // % (0-100%)
  soilTemperatureC: number; // °C
  surfaceRunoffMm: number; // mm/hr
  soilState: 'dry' | 'moist' | 'saturated' | 'oversaturated';
  soilStateText: string;
  flashFloodRisk: 'low' | 'moderate' | 'high' | 'critical';
  landslideRisk: 'low' | 'moderate' | 'high' | 'critical';
  absorptionCapacityMm: number; // ความสามารถในการซับน้ำที่เหลืออยู่ (มม.)
}

export interface RiverDischargeForecastDay {
  date: string; // YYYY-MM-DD
  dayLabel: string; // วันนี้, พรุ่งนี้, ฯลฯ
  dischargeM3s: number; // m³/s
  dischargeMaxM3s: number;
  dischargeMinM3s: number;
  dischargeMeanM3s: number;
  trend: 'up' | 'down' | 'steady';
  floodLevel: 'normal' | 'watch' | 'warning' | 'critical';
}

export interface GoogleHydrologyData {
  latitude: number;
  longitude: number;
  locationName: string;
  soil: SoilMoistureData;
  hourlyRunoff: { time: string; runoffMm: number; soilMoisture: number }[];
  riverDischargeForecast: RiverDischargeForecastDay[];
  summary: {
    peakDischargeM3s: number;
    peakDischargeDate: string;
    soilWarning: string;
    floodAdvisory: string;
  };
  updatedAt: Date;
}

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export async function fetchGoogleHydrologyData(
  lat: number,
  lng: number,
  locationName = 'พื้นที่ที่เลือก'
): Promise<GoogleHydrologyData> {
  const soilUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,surface_runoff&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum,precipitation_probability_max&timezone=Asia%2FBangkok&forecast_days=3`;
  const floodUrl = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lng}&daily=river_discharge,river_discharge_mean,river_discharge_max,river_discharge_min&forecast_days=7`;

  const [soilRes, floodRes] = await Promise.allSettled([
    fetch(soilUrl),
    fetch(floodUrl)
  ]);

  let soilJson: any = null;
  let floodJson: any = null;

  if (soilRes.status === 'fulfilled' && soilRes.value.ok) {
    soilJson = await soilRes.value.json();
  }
  if (floodRes.status === 'fulfilled' && floodRes.value.ok) {
    floodJson = await floodRes.value.json();
  }

  // Parse Soil
  const currentHourIdx = 0;
  const topSoil = soilJson?.hourly?.soil_moisture_0_to_1cm?.[currentHourIdx] ?? 0.32;
  const midSoil = soilJson?.hourly?.soil_moisture_3_to_9cm?.[currentHourIdx] ?? 0.35;
  const deepSoil = soilJson?.hourly?.soil_moisture_9_to_27cm?.[currentHourIdx] ?? 0.38;
  const soilTemp = soilJson?.hourly?.soil_temperature_0cm?.[currentHourIdx] ?? 28;
  const runoffNow = soilJson?.hourly?.surface_runoff?.[currentHourIdx] ?? 0;

  // Typical max porosity for clay-loam in Thailand is ~0.45 - 0.50 m³/m³
  const avgMoisture = (topSoil * 0.4) + (midSoil * 0.3) + (deepSoil * 0.3);
  const saturationPct = Math.min(Math.round((avgMoisture / 0.48) * 100), 100);

  let soilState: 'dry' | 'moist' | 'saturated' | 'oversaturated' = 'moist';
  let soilStateText = 'ดินชุ่มชื้นปกติ ซับน้ำได้ดี';
  let flashFloodRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let landslideRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let absorptionCapacityMm = Math.max(0, Math.round((1 - (saturationPct / 100)) * 60));

  if (saturationPct >= 90 || avgMoisture >= 0.44) {
    soilState = 'oversaturated';
    soilStateText = 'ดินอิ่มตัวด้วยน้ำเต็มที่ 100% ไม่สามารถซับน้ำได้อีกต่อไป';
    flashFloodRisk = 'critical';
    landslideRisk = 'critical';
    absorptionCapacityMm = 0;
  } else if (saturationPct >= 75 || avgMoisture >= 0.38) {
    soilState = 'saturated';
    soilStateText = 'ดินอิ่มตัวสูง หากมีฝนตกใหม่จะเกิดน้ำหลากผิวดินทันที';
    flashFloodRisk = 'high';
    landslideRisk = 'high';
    absorptionCapacityMm = 10;
  } else if (saturationPct >= 50) {
    soilState = 'moist';
    soilStateText = 'ดินมีความชื้นปานกลาง สามารถซับน้ำได้';
    flashFloodRisk = 'moderate';
    landslideRisk = 'low';
    absorptionCapacityMm = 30;
  } else {
    soilState = 'dry';
    soilStateText = 'ดินแห้ง มีความจุซับน้ำได้มาก';
    flashFloodRisk = 'low';
    landslideRisk = 'low';
    absorptionCapacityMm = 55;
  }

  // Hourly Runoff (Next 24 Hours)
  const hourlyTimes: string[] = soilJson?.hourly?.time || [];
  const hourlyRunoff = hourlyTimes.slice(0, 24).map((t: string, idx: number) => {
    const d = new Date(t);
    return {
      time: `${d.getHours().toString().padStart(2, '0')}:00`,
      runoffMm: Number((soilJson?.hourly?.surface_runoff?.[idx] ?? 0).toFixed(2)),
      soilMoisture: Number((soilJson?.hourly?.soil_moisture_0_to_1cm?.[idx] ?? topSoil).toFixed(3)),
    };
  });

  // GloFAS River Discharge Forecast (7 Days)
  const dischargeDates: string[] = floodJson?.daily?.time || [];
  const dischargeValues: number[] = floodJson?.daily?.river_discharge || [];
  const dischargeMax: number[] = floodJson?.daily?.river_discharge_max || [];
  const dischargeMin: number[] = floodJson?.daily?.river_discharge_min || [];
  const dischargeMean: number[] = floodJson?.daily?.river_discharge_mean || [];

  const todayStr = new Date().toLocaleDateString('en-CA');
  const riverDischargeForecast: RiverDischargeForecastDay[] = dischargeDates.map((dateStr, idx) => {
    const val = Number((dischargeValues[idx] ?? dischargeMean[idx] ?? 120).toFixed(1));
    const maxVal = Number((dischargeMax[idx] ?? val * 1.15).toFixed(1));
    const minVal = Number((dischargeMin[idx] ?? val * 0.85).toFixed(1));
    const meanVal = Number((dischargeMean[idx] ?? val).toFixed(1));

    const dateObj = new Date(dateStr);
    let dayLabel = THAI_DAYS[dateObj.getDay()];
    if (idx === 0 || dateStr === todayStr) dayLabel = 'วันนี้';
    else if (idx === 1) dayLabel = 'พรุ่งนี้';

    const prevVal = idx > 0 ? dischargeValues[idx - 1] ?? val : val;
    const trend: 'up' | 'down' | 'steady' = val > prevVal * 1.05 ? 'up' : val < prevVal * 0.95 ? 'down' : 'steady';

    let floodLevel: 'normal' | 'watch' | 'warning' | 'critical' = 'normal';
    if (val >= 1500) floodLevel = 'critical';
    else if (val >= 900) floodLevel = 'warning';
    else if (val >= 450) floodLevel = 'watch';

    return {
      date: dateStr,
      dayLabel,
      dischargeM3s: val,
      dischargeMaxM3s: maxVal,
      dischargeMinM3s: minVal,
      dischargeMeanM3s: meanVal,
      trend,
      floodLevel
    };
  });

  // Summary
  let peakVal = 0;
  let peakDate = 'วันนี้';
  riverDischargeForecast.forEach((d) => {
    if (d.dischargeM3s > peakVal) {
      peakVal = d.dischargeM3s;
      peakDate = `${d.dayLabel} (${d.date.slice(5)})`;
    }
  });

  let soilWarning = 'ดินในพื้นที่ยังสามารถรองรับปริมาณน้ำฝนได้ตามปกติ';
  if (soilState === 'oversaturated') {
    soilWarning = '⚠️ ดินอิ่มตัววิกฤต (ความชื้นสูงกว่า 90%) เสี่ยงดินสไลด์และน้ำหลากฉับพลันสูงมาก!';
  } else if (soilState === 'saturated') {
    soilWarning = '🟠 ดินอิ่มตัวสูง ฝนที่ตกลงมาใหม่จะกลายเป็นน้ำหลากผิวดินทั้งหมด (Runoff 100%)';
  }

  let floodAdvisory = 'อัตราการไหลของลำน้ำอยู่ในเกณฑ์ปกติ';
  if (peakVal >= 1500) {
    floodAdvisory = '🚨 คาดการณ์ลำน้ำสายหลักจะมีอัตราการไหลสูงเกินจุดวิกฤต เสี่ยงน้ำเอ่อล้นตลิ่งรุนแรง';
  } else if (peakVal >= 900) {
    floodAdvisory = '🟠 คาดการณ์อัตราการไหลของลำน้ำเพิ่มสูงขึ้น เฝ้าระวังพื้นที่ลุ่มต่ำริมสองฝั่งน้ำ';
  } else if (peakVal >= 450) {
    floodAdvisory = '🔵 อัตราการไหลมีแนวโน้มเพิ่มขึ้นเล็กน้อย อยู่ในเกณฑ์เฝ้าระวัง';
  }

  return {
    latitude: lat,
    longitude: lng,
    locationName,
    soil: {
      soilMoistureTop0_1cm: Number(topSoil.toFixed(3)),
      soilMoistureSub3_9cm: Number(midSoil.toFixed(3)),
      soilMoistureDeep9_27cm: Number(deepSoil.toFixed(3)),
      soilSaturationPct: saturationPct,
      soilTemperatureC: Math.round(soilTemp),
      surfaceRunoffMm: Number(runoffNow.toFixed(2)),
      soilState,
      soilStateText,
      flashFloodRisk,
      landslideRisk,
      absorptionCapacityMm,
    },
    hourlyRunoff,
    riverDischargeForecast,
    summary: {
      peakDischargeM3s: peakVal,
      peakDischargeDate: peakDate,
      soilWarning,
      floodAdvisory
    },
    updatedAt: new Date()
  };
}
