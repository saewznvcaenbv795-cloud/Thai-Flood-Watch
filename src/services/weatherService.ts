// Free Open-Meteo Weather Service (No API Key Required, 100% Free)

export interface HourlyForecast {
  time: string; // ISO string or time label
  displayTime: string; // e.g. "14:00"
  dateStr: string; // e.g. "2026-09-26"
  temp: number; // °C
  humidity: number; // %
  rainProb: number; // %
  rainMm: number; // mm
  weatherCode: number;
  condition: string;
  iconType: 'clear' | 'partly_cloudy' | 'cloudy' | 'drizzle' | 'rain' | 'heavy_rain' | 'thunderstorm';
  windSpeed: number; // km/h
}

export interface DailyForecast {
  date: string; // "2026-09-26"
  dayName: string; // "วันนี้", "พรุ่งนี้", "จันทร์", etc.
  fullDateText: string; // "26 ก.ย. 69"
  maxTemp: number;
  minTemp: number;
  rainSumMm: number;
  rainProbMax: number;
  weatherCode: number;
  condition: string;
  iconType: 'clear' | 'partly_cloudy' | 'cloudy' | 'drizzle' | 'rain' | 'heavy_rain' | 'thunderstorm';
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  floodRiskLevel: 'low' | 'moderate' | 'high' | 'severe';
}

export interface CurrentWeather {
  temp: number;
  apparentTemp: number;
  humidity: number;
  rainMm: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  iconType: 'clear' | 'partly_cloudy' | 'cloudy' | 'drizzle' | 'rain' | 'heavy_rain' | 'thunderstorm';
  isDay: boolean;
  time: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  locationName: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  summary: {
    todayRainMm: number;
    tomorrowRainMm: number;
    fiveDayRainMm: number;
    highestRainDay: string;
    highestRainTime: string;
    floodAdvisory: string;
    floodRiskLevel: 'low' | 'moderate' | 'high' | 'severe';
  };
  updatedAt: Date;
}

export function getWeatherConditionInfo(code: number): {
  condition: string;
  iconType: 'clear' | 'partly_cloudy' | 'cloudy' | 'drizzle' | 'rain' | 'heavy_rain' | 'thunderstorm';
  emoji: string;
  color: string;
} {
  switch (code) {
    case 0:
      return { condition: 'ท้องฟ้าแจ่มใส', iconType: 'clear', emoji: '☀️', color: '#dd5b00' };
    case 1:
      return { condition: 'แจ่มใสเป็นส่วนใหญ่', iconType: 'clear', emoji: '🌤️', color: '#dd5b00' };
    case 2:
      return { condition: 'มีเมฆบางส่วน', iconType: 'partly_cloudy', emoji: '⛅', color: '#62aef0' };
    case 3:
      return { condition: 'เมฆครึ้ม / มีเมฆมาก', iconType: 'cloudy', emoji: '☁️', color: '#615d59' };
    case 45:
    case 48:
      return { condition: 'มีหมอกหนา', iconType: 'cloudy', emoji: '🌫️', color: '#a39e98' };
    case 51:
    case 53:
    case 55:
      return { condition: 'ฝนละอองโปรยปราย', iconType: 'drizzle', emoji: '🌦️', color: '#2a9d99' };
    case 61:
      return { condition: 'ฝนตกเล็กน้อย', iconType: 'rain', emoji: '🌧️', color: '#0075de' };
    case 63:
      return { condition: 'ฝนตกปานกลาง', iconType: 'rain', emoji: '🌧️', color: '#0075de' };
    case 65:
      return { condition: 'ฝนตกหนัก', iconType: 'heavy_rain', emoji: '⛈️', color: '#dd5b00' };
    case 80:
      return { condition: 'ฝนซู่ตกเบา', iconType: 'rain', emoji: '🌦️', color: '#0075de' };
    case 81:
      return { condition: 'ฝนซู่ตกปานกลาง', iconType: 'rain', emoji: '🌧️', color: '#0075de' };
    case 82:
      return { condition: 'ฝนซู่ตกหนักมาก', iconType: 'heavy_rain', emoji: '⛈️', color: '#e03e3e' };
    case 95:
      return { condition: 'พายุฝนฟ้าคะนอง', iconType: 'thunderstorm', emoji: '⛈️', color: '#e03e3e' };
    case 96:
    case 99:
      return { condition: 'พายุฝนฟ้าคะนองรุนแรง / ลมกระโชกแรง', iconType: 'thunderstorm', emoji: '🌩️', color: '#e03e3e' };
    default:
      if (code >= 70 && code <= 77) {
        return { condition: 'ลูกเห็บ / ฝนน้ำแข็ง', iconType: 'heavy_rain', emoji: '🌨️', color: '#62aef0' };
      }
      return { condition: 'มีเมฆเป็นส่วนมาก', iconType: 'partly_cloudy', emoji: '⛅', color: '#615d59' };
  }
}

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export async function fetchWeatherForecast(lat: number, lng: number, locationName = 'พื้นที่ที่เลือก'): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Asia%2FBangkok&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP error: ${res.status}`);
  }

  const data = await res.json();

  // Current
  const currentInfo = getWeatherConditionInfo(data.current?.weather_code || 0);
  const current: CurrentWeather = {
    temp: Math.round(data.current?.temperature_2m ?? 30),
    apparentTemp: Math.round(data.current?.apparent_temperature ?? 33),
    humidity: Math.round(data.current?.relative_humidity_2m ?? 75),
    rainMm: Number((data.current?.precipitation ?? 0).toFixed(1)),
    windSpeed: Math.round(data.current?.wind_speed_10m ?? 12),
    windDirection: Math.round(data.current?.wind_direction_10m ?? 180),
    weatherCode: data.current?.weather_code || 0,
    condition: currentInfo.condition,
    iconType: currentInfo.iconType,
    isDay: Boolean(data.current?.is_day ?? 1),
    time: data.current?.time || new Date().toISOString(),
  };

  // Hourly (filter from now to next 36-48 hours)
  const nowIso = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
  const hourlyTimes: string[] = data.hourly?.time || [];
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(nowIso));
  if (startIndex === -1) startIndex = 0;

  const hourlySlice = hourlyTimes.slice(startIndex, startIndex + 36);
  const hourly: HourlyForecast[] = hourlySlice.map((timeStr, idx) => {
    const rawIdx = startIndex + idx;
    const code = data.hourly?.weather_code?.[rawIdx] || 0;
    const info = getWeatherConditionInfo(code);
    const dateObj = new Date(timeStr);
    const hour = dateObj.getHours().toString().padStart(2, '0');

    return {
      time: timeStr,
      displayTime: `${hour}:00`,
      dateStr: timeStr.slice(0, 10),
      temp: Math.round(data.hourly?.temperature_2m?.[rawIdx] ?? 30),
      humidity: Math.round(data.hourly?.relative_humidity_2m?.[rawIdx] ?? 70),
      rainProb: Math.round(data.hourly?.precipitation_probability?.[rawIdx] ?? 0),
      rainMm: Number((data.hourly?.precipitation?.[rawIdx] ?? 0).toFixed(1)),
      weatherCode: code,
      condition: info.condition,
      iconType: info.iconType,
      windSpeed: Math.round(data.hourly?.wind_speed_10m?.[rawIdx] ?? 10),
    };
  });

  // Daily
  const dailyDates: string[] = data.daily?.time || [];
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const daily: DailyForecast[] = dailyDates.map((dateStr, idx) => {
    const code = data.daily?.weather_code?.[idx] || 0;
    const info = getWeatherConditionInfo(code);
    const dateObj = new Date(dateStr);
    const dayOfWeek = THAI_DAYS[dateObj.getDay()];
    const dayOfMonth = dateObj.getDate();
    const month = THAI_MONTHS_SHORT[dateObj.getMonth()];

    let dayName = dayOfWeek;
    if (idx === 0 || dateStr === todayStr) {
      dayName = 'วันนี้';
    } else if (idx === 1) {
      dayName = 'พรุ่งนี้';
    }

    const rainSum = Number((data.daily?.precipitation_sum?.[idx] ?? 0).toFixed(1));
    const rainProb = Math.round(data.daily?.precipitation_probability_max?.[idx] ?? 0);

    let floodRiskLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    if (rainSum >= 90 || (rainSum >= 60 && rainProb >= 80)) {
      floodRiskLevel = 'severe';
    } else if (rainSum >= 45 || (rainSum >= 30 && rainProb >= 70)) {
      floodRiskLevel = 'high';
    } else if (rainSum >= 15 || rainProb >= 50) {
      floodRiskLevel = 'moderate';
    }

    return {
      date: dateStr,
      dayName,
      fullDateText: `${dayOfMonth} ${month}`,
      maxTemp: Math.round(data.daily?.temperature_2m_max?.[idx] ?? 32),
      minTemp: Math.round(data.daily?.temperature_2m_min?.[idx] ?? 24),
      rainSumMm: rainSum,
      rainProbMax: rainProb,
      weatherCode: code,
      condition: info.condition,
      iconType: info.iconType,
      uvIndexMax: Math.round(data.daily?.uv_index_max?.[idx] ?? 7),
      sunrise: (data.daily?.sunrise?.[idx] || '').slice(11, 16) || '06:05',
      sunset: (data.daily?.sunset?.[idx] || '').slice(11, 16) || '18:15',
      floodRiskLevel,
    };
  });

  // Calculate summaries
  const todayRainMm = daily[0]?.rainSumMm || 0;
  const tomorrowRainMm = daily[1]?.rainSumMm || 0;
  const fiveDayRainMm = Number(daily.slice(0, 5).reduce((acc, d) => acc + d.rainSumMm, 0).toFixed(1));

  // Find max rain day & hour
  let highestRainDayObj = daily[0];
  daily.slice(0, 5).forEach((d) => {
    if (d.rainSumMm > (highestRainDayObj?.rainSumMm || 0)) {
      highestRainDayObj = d;
    }
  });

  let highestRainHourObj = hourly[0];
  hourly.slice(0, 24).forEach((h) => {
    if (h.rainMm > (highestRainHourObj?.rainMm || 0)) {
      highestRainHourObj = h;
    }
  });

  let floodRiskLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
  let floodAdvisory = 'สภาพอากาศโดยทั่วไปปกติ ไม่มีสัญญาณฝนตกสะสมรุนแรง';

  if (fiveDayRainMm >= 180 || todayRainMm >= 90 || tomorrowRainMm >= 90) {
    floodRiskLevel = 'severe';
    floodAdvisory = '⚠️ เฝ้าระวังสูงสุด! คาดการณ์ฝนตกหนักสะสมต่อเนื่อง เสี่ยงเกิดน้ำป่าไหลหลาก น้ำท่วมฉับพลัน และน้ำเอ่อล้นตลิ่งสูงมาก';
  } else if (fiveDayRainMm >= 90 || todayRainMm >= 45 || tomorrowRainMm >= 45) {
    floodRiskLevel = 'high';
    floodAdvisory = '🟠 มีโอกาสฝนตกหนัก เสี่ยงน้ำท่วมขังในพื้นที่ลุ่มต่ำ ระดับน้ำในลำน้ำมีแนวโน้มเพิ่มสูงขึ้น';
  } else if (fiveDayRainMm >= 35 || todayRainMm >= 20 || tomorrowRainMm >= 20) {
    floodRiskLevel = 'moderate';
    floodAdvisory = '🔵 มีฝนตกกระจายปานกลาง ติดตามการระบายน้ำของคลองและแม่น้ำสายหลักอย่างสม่ำเสมอ';
  }

  return {
    latitude: lat,
    longitude: lng,
    locationName,
    current,
    hourly,
    daily,
    summary: {
      todayRainMm,
      tomorrowRainMm,
      fiveDayRainMm,
      highestRainDay: `${highestRainDayObj?.dayName} (${highestRainDayObj?.rainSumMm} มม.)`,
      highestRainTime: highestRainHourObj && highestRainHourObj.rainMm > 0 ? `${highestRainHourObj.displayTime} น. (~${highestRainHourObj.rainMm} มม.)` : 'ไม่มีฝนตกหนักเด่นชัด',
      floodAdvisory,
      floodRiskLevel,
    },
    updatedAt: new Date(),
  };
}
