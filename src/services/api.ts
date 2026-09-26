import { WaterStation, RainStation, DamData, GdacsAlert, FloodNews } from '../types';

const THAIWATER_ENDPOINT = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/thailand_main';
const GDACS_ENDPOINT = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL&country=Thailand';
const FEED_ENDPOINT = 'https://sunthanawit.github.io/thai-flood-watch/data/feed.json';

const STALE_HOURS = 36;

const num = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const thText = (o: any): string => {
  if (!o) return '';
  if (typeof o === 'string') return o;
  return o.th || o.en || '';
};

// ThaiWater times are Bangkok local ("YYYY-MM-DD HH:mm")
const parseBkkTime = (s: string | null | undefined): Date | null => {
  if (!s) return null;
  try {
    const clean = s.trim().replace(' ', 'T') + (s.length <= 10 ? 'T00:00' : '') + ':00+07:00';
    const d = new Date(clean);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

export async function fetchThaiWater(): Promise<{
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
}> {
  const res = await fetch(THAIWATER_ENDPOINT, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`ThaiWater API HTTP ${res.status}`);
  }
  const j = await res.json();
  const cutoff = Date.now() - STALE_HOURS * 3600 * 1000;

  // Process Water Level Stations
  const rawStations = j.waterlevel?.data?.data || [];
  const stations: WaterStation[] = rawStations
    .map((w: any) => {
      const st = w.station || {};
      const time = parseBkkTime(w.waterlevel_datetime);
      const msl = num(w.waterlevel_msl);
      const prev = num(w.waterlevel_msl_previous);
      return {
        id: `wl-${st.id ?? w.id}`,
        stationId: st.id ?? w.id,
        name: thText(st.tele_station_name) || `สถานี ${st.id ?? w.id}`,
        lat: num(st.tele_station_lat) ?? 0,
        lng: num(st.tele_station_long) ?? 0,
        level: Number(w.situation_level) || 3,
        pct: num(w.storage_percent),
        msl,
        delta: msl !== null && prev !== null ? msl - prev : null,
        bank: num(st.min_bank),
        diffBank: num(w.diff_wl_bank),
        diffBankText: w.diff_wl_bank_text || '',
        province: thText(w.geocode?.province_name),
        amphoe: thText(w.geocode?.amphoe_name),
        basin: thText(w.basin?.basin_name),
        agency: thText(w.agency?.agency_shortname) || 'ThaiWater',
        time: time || new Date(),
      };
    })
    .filter(
      (s: WaterStation) =>
        s.lat &&
        s.lng &&
        s.level &&
        s.time &&
        s.time.getTime() > cutoff
    );

  // Process Rain Stations
  const rawRain = j.rain?.data?.data || [];
  const rain: RainStation[] = rawRain
    .map((r: any) => {
      const st = r.station || {};
      return {
        id: `rain-${st.id ?? r.id}`,
        name: thText(st.tele_station_name) || `สถานีวัดฝน ${st.id ?? r.id}`,
        lat: num(st.tele_station_lat) ?? 0,
        lng: num(st.tele_station_long) ?? 0,
        mm: num(r.rain_24h) ?? 0,
        mm1h: num(r.rain_1h),
        province: thText(r.geocode?.province_name),
        amphoe: thText(r.geocode?.amphoe_name),
        agency: thText(r.agency?.agency_shortname) || 'ThaiWater',
        time: parseBkkTime(r.rainfall_datetime),
      };
    })
    .filter(
      (r: RainStation) =>
        r.lat &&
        r.lng &&
        r.mm !== null &&
        r.time &&
        r.time.getTime() > cutoff
    );

  // Process Dams
  const rawDams = j.dam?.data?.data || [];
  const dams: DamData[] = rawDams
    .map((d: any) => {
      const dam = d.dam || {};
      return {
        id: `dam-${dam.id ?? d.id}`,
        name: thText(dam.dam_name) || `เขื่อน ${dam.id ?? d.id}`,
        lat: num(dam.dam_lat) ?? 0,
        lng: num(dam.dam_long) ?? 0,
        pct: num(d.dam_storage_percent) ?? 0,
        storage: num(d.dam_storage) ?? 0,
        inflow: num(d.dam_inflow) ?? 0,
        released: num(d.dam_released) ?? 0,
        normal: num(dam.normal_storage) ?? 0,
        province: thText(d.geocode?.province_name),
        date: d.dam_date || '',
      };
    })
    .filter((d: DamData) => d.lat && d.lng && d.pct !== null);

  return { stations, rain, dams };
}

export async function fetchGdacsAlerts(): Promise<GdacsAlert[]> {
  try {
    const res = await fetch(GDACS_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return [];
    const j = await res.json();
    const cutoff = Date.now() - 45 * 86400 * 1000;
    return (j.features || [])
      .map((f: any) => {
        const p = f.properties || {};
        return {
          id: `gdacs-${p.eventid}-${p.episodeid}`,
          name: p.name || 'เหตุการณ์น้ำท่วม',
          description: p.htmldescription || p.description || '',
          alertlevel: p.alertlevel || 'Green',
          fromdate: p.fromdate || '',
          todate: p.todate || '',
          reportUrl: p.url?.report || 'https://www.gdacs.org',
          lat: f.geometry?.coordinates?.[1] ?? 0,
          lng: f.geometry?.coordinates?.[0] ?? 0,
        };
      })
      .filter((e: GdacsAlert) => e.lat && e.lng && new Date(e.todate).getTime() > cutoff);
  } catch (err) {
    console.warn('GDACS fetch optional notice:', err);
    return [];
  }
}

export async function fetchNewsFeed(): Promise<FloodNews[]> {
  try {
    const res = await fetch(`${FEED_ENDPOINT}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return getDefaultNews();
    const j = await res.json();
    if (Array.isArray(j.news) && j.news.length > 0) {
      return j.news.map((item: any) => ({
        title: item.title,
        source: item.source || 'ข่าว',
        link: item.link || '#',
        published: item.published || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('Feed fetch fallback:', err);
  }
  return getDefaultNews();
}

function getDefaultNews(): FloodNews[] {
  return [
    {
      title: 'ปภ.เตือนเฝ้าระวังน้ำท่วมฉับพลัน น้ำป่าไหลหลาก และน้ำล้นตลิ่งในหลายจังหวัด',
      source: 'ปภ.',
      link: 'https://www.disaster.go.th',
      published: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
    {
      title: 'กรมชลประทานบริหารจัดการน้ำลุ่มเจ้าพระยาและลุ่มน้ำสำคัญเพื่อลดผลกระทบท้ายเขื่อน',
      source: 'กรมชลประทาน',
      link: 'https://www.rid.go.th',
      published: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    },
    {
      title: 'กทม. เตรียมพร้อมสถานีสูบน้ำและแนวคันกั้นน้ำรับมือน้ำเหนือและน้ำทะเลหนุน',
      source: 'สำนักการระบายน้ำ กทม.',
      link: 'https://dds.bangkok.go.th',
      published: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    },
    {
      title: 'ศูนย์บริหารจัดการน้ำส่วนหน้า สสน. ประเมินแนวโน้มฝนสะสมและพื้นที่เสี่ยงต่อเนื่อง',
      source: 'ThaiWater',
      link: 'https://www.thaiwater.net',
      published: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    },
  ];
}
