import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header, ViewMode } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { FloodMap } from './components/FloodMap';
import { SidePanel } from './components/SidePanel';
import { WindyEmbed } from './components/WindyEmbed';
import { WaterFlowTracker } from './components/WaterFlowTracker';
import { GoogleEarthSoilWeather } from './components/GoogleEarthSoilWeather';
import { WeatherForecastViewer } from './components/WeatherForecastViewer';
import { CctvViewer } from './components/CctvViewer';
import { CitizenAidHub } from './components/CitizenAidHub';
import { WatchlistProvinces } from './components/WatchlistProvinces';
import { BasinSummary } from './components/BasinSummary';
import { MajorDams } from './components/MajorDams';
import { StationTableExport } from './components/StationTableExport';
import { SandbagCalculator } from './components/SandbagCalculator';
import { EmergencyHotlines } from './components/EmergencyHotlines';
import { OfficialResources } from './components/OfficialResources';
import { CommunityPosts } from './components/CommunityPosts';
import { MyLocationRisk } from './components/MyLocationRisk';
import { StationDetailDrawer } from './components/StationDetailDrawer';
import { EmergencyModal } from './components/EmergencyModal';
import { SosBeaconModal } from './components/SosBeaconModal';
import { SituationSummaryModal } from './components/SituationSummaryModal';
import { DataSourceAttributionModal } from './components/DataSourceAttributionModal';
import { ThaiRiverNetwork } from './components/ThaiRiverNetwork';
import { ProvinceFilterBar } from './components/ProvinceFilterBar';
import { Footer } from './components/Footer';
import { fetchThaiWater, fetchGdacsAlerts, fetchNewsFeed } from './services/api';
import { WaterStation, RainStation, DamData, GdacsAlert, FloodNews } from './types';
import { AlertTriangle, ArrowRight, PhoneCall, AlertOctagon } from 'lucide-react';
import { fmt } from './utils/formatters';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const [stations, setStations] = useState<WaterStation[]>([]);
  const [rain, setRain] = useState<RainStation[]>([]);
  const [dams, setDams] = useState<DamData[]>([]);
  const [gdacs, setGdacs] = useState<GdacsAlert[]>([]);
  const [news, setNews] = useState<FloodNews[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View mode tab
  const [currentView, setCurrentView] = useState<ViewMode>('map');

  // Light / Dark mode - Default to Notion Light Warm Paper Daylight theme as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('thai_flood_theme_mode');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      // Default to Notion light theme
      localStorage.setItem('thai_flood_theme_mode', 'light');
      localStorage.setItem('thai_flood_theme', 'light');
      return false;
    } catch {
      return false;
    }
  });

  // Map & Panel synchronization
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [drawerStation, setDrawerStation] = useState<WaterStation | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [flyToBoundsTarget, setFlyToBoundsTarget] = useState<[number, number][] | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState<boolean>(false);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('thai_flood_theme_mode', 'dark');
        localStorage.setItem('thai_flood_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('thai_flood_theme_mode', 'light');
        localStorage.setItem('thai_flood_theme', 'light');
      } catch {}
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Load telemetry data
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [waterRes, gdacsRes, newsRes] = await Promise.allSettled([
        fetchThaiWater(),
        fetchGdacsAlerts(),
        fetchNewsFeed(),
      ]);

      if (waterRes.status === 'fulfilled') {
        setStations(waterRes.value.stations);
        setRain(waterRes.value.rain);
        setDams(waterRes.value.dams);
      } else {
        throw waterRes.reason;
      }

      if (gdacsRes.status === 'fulfilled') {
        setGdacs(gdacsRes.value);
      }

      if (newsRes.status === 'fulfilled') {
        setNews(newsRes.value);
      }

      setUpdatedAt(new Date());
    } catch (err: any) {
      console.error('Error fetching flood data:', err);
      setError(err?.message || 'ไม่สามารถเชื่อมต่อคลังข้อมูลน้ำได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadAllData]);

  // Handle station selection
  const handleSelectStation = (stationId: string) => {
    setSelectedStationId(stationId);
    const target = stations.find((s) => s.id === stationId);
    if (target) {
      setDrawerStation(target);
    }
    setFlyToTarget(null);
    setFlyToBoundsTarget(null);
  };

  // Handle province click from Watchlist or filter bar
  const handleSelectProvince = (provinceName: string, points?: [number, number][]) => {
    setSelectedProvince(provinceName);
    if (points && points.length > 0) {
      setFlyToBoundsTarget(points);
      setSelectedStationId(null);
      setFlyToTarget(null);
    } else if (provinceName) {
      const matchingPoints = stations
        .filter((s) => s.province && s.province.includes(provinceName))
        .map((s) => [s.lat, s.lng] as [number, number]);
      if (matchingPoints.length > 0) {
        setFlyToBoundsTarget(matchingPoints);
      }
    }
    if (currentView !== 'map' && currentView !== 'all') {
      setCurrentView('map');
    }
  };

  // Handle basin click from BasinSummary
  const handleSelectBasin = (basinName: string, points: [number, number][]) => {
    if (points.length > 0) {
      setFlyToBoundsTarget(points);
      setSelectedStationId(null);
      setFlyToTarget(null);
    }
    if (currentView !== 'map' && currentView !== 'all') {
      setCurrentView('map');
    }
  };

  // Handle coordinate flyTo
  const handleFlyToCoords = (lat: number, lng: number, zoom = 12) => {
    setFlyToTarget({ lat, lng, zoom });
    setSelectedStationId(null);
    setFlyToBoundsTarget(null);
    if (currentView !== 'map' && currentView !== 'all') {
      setCurrentView('map');
    }
  };

  const lv5Stations = useMemo(() => stations.filter((s) => s.level === 5), [stations]);
  const overflowCount = lv5Stations.length;

  const topOverflowProvinces = useMemo(() => {
    const pSet = new Set<string>();
    lv5Stations.forEach((s) => {
      if (s.province) pSet.add(s.province);
    });
    return Array.from(pSet).slice(0, 4);
  }, [lv5Stations]);

  return (
    <div className="min-h-screen bg-[#f6f5f4] dark:bg-[#191919] text-[#000000] dark:text-[#ffffff] flex flex-col transition-colors duration-200">
      {/* 1. Header & Navigation */}
      <Header
        updatedAt={updatedAt}
        isLoading={isLoading}
        onRefresh={loadAllData}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        overflowCount={overflowCount}
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenAttributionModal={() => setIsAttributionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-[1560px] mx-auto w-full px-3 sm:px-6 py-4 flex-1 space-y-4">
        {/* Notion Document Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">🌊</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000] dark:text-[#ffffff] font-display">
                สถานการณ์น้ำท่วมประเทศไทย (ThaiFlood.online)
              </h1>
              <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                ระบบติดตามระดับน้ำ ฝนสะสม 24 ชม. ปริมาตรเขื่อน กล้องสด เส้นทางน้ำท่วม และศูนย์ช่วยเหลือ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsAttributionModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#9b9a97] hover:text-[#0075de] dark:hover:text-[#62aef0] hover:border-[#0075de]/30 flex items-center gap-1.5 font-mono-num transition cursor-pointer shadow-2xs"
              title="คลิกเพื่อดูที่มาของข้อมูลและลิขสิทธิ์"
            >
              <span className="w-2 h-2 rounded-full bg-[#1aae39] animate-pulse" />
              <span>ข้อมูลสด: คลังข้อมูลน้ำ สสน. • ที่มา & ลิขสิทธิ์</span>
            </button>
          </div>
        </div>

        {/* Network Error Notice */}
        {error && (
          <div className="p-3.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e03e3e]/30 text-[#e03e3e] dark:text-[#ff6464] text-xs flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>โหลดข้อมูลไม่สำเร็จ ({error}) ระบบจะลองใหม่อัตโนมัติทุก 5 นาที</span>
            </div>
            <button
              onClick={loadAllData}
              className="px-2.5 py-1 rounded-md bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] font-medium hover:bg-white text-xs cursor-pointer"
            >
              ลองใหม่ทันที
            </button>
          </div>
        )}

        {/* VIEW 1: MAP & SIDE PANEL (Overview with Warning Banner, KPI Cards, Telemetry + GPS) */}
        {(currentView === 'map' || currentView === 'all') && (
          <section className="space-y-3.5">
            {/* Urgent Overflow Alert Banner - Notion Callout style */}
            {overflowCount > 0 && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#e03e3e] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e03e3e]/10 text-[#e03e3e] flex items-center justify-center shrink-0 font-bold">
                    🚨
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#e03e3e] dark:text-[#ff6464]">แจ้งเตือนระดับน้ำล้นตลิ่งวิกฤต: </span>
                    <span className="text-[#31302e] dark:text-[#d4d4d4]">
                      พบสถานีน้ำล้นตลิ่ง <b className="font-mono-num text-[#e03e3e]">{fmt(overflowCount)}</b> จุด ในพื้นที่{' '}
                      {topOverflowProvinces.map((p) => `จ.${p}`).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
                  <button
                    onClick={() => {
                      setCurrentView('map');
                      if (lv5Stations[0]) handleSelectStation(lv5Stations[0].id);
                    }}
                    className="py-1.5 px-3.5 rounded-full bg-[#0075de] hover:bg-[#005bab] text-white font-medium flex items-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    <span>ดูจุดล้นตลิ่ง</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsSosModalOpen(true)}
                    className="py-1.5 px-3.5 rounded-full bg-[#e03e3e] hover:bg-[#c92a2a] text-white font-medium flex items-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>ขอความช่วยเหลือ (SOS)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Rain Radar right after Urgent Overflow Alert Banner */}
            <WindyEmbed
              title="📡 เรดาร์ตรวจจับกลุ่มฝนและพายุสด (Real-Time Rain Radar)"
              defaultOverlay="radar"
              defaultViewKey="thailand"
            />

            {/* Top Summary KPI Cards */}
            <KpiCards
              stations={stations}
              rain={rain}
              dams={dams}
              onSelectOverflow={() => {
                setCurrentView('map');
                if (lv5Stations[0]) handleSelectStation(lv5Stations[0].id);
              }}
              onSelectHighRain={(lat, lng) => handleFlyToCoords(lat, lng, 12)}
              onSelectHighDams={() => setCurrentView('analytics')}
            />

            {/* GPS My Location Risk Widget */}
            <MyLocationRisk
              stations={stations}
              rain={rain}
              dams={dams}
              onFlyToCoords={handleFlyToCoords}
              onSelectStation={handleSelectStation}
            />

            {/* Quick Province Risk Filter Bar */}
            <ProvinceFilterBar
              stations={stations}
              selectedProvince={selectedProvince}
              onSelectProvince={(prov) => handleSelectProvince(prov)}
              onClear={() => setSelectedProvince('')}
            />

            {/* Quick Link to สายน้ำประเทศไทย */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/60 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="w-7 h-7 rounded-lg bg-[#0075de] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🌊
                </span>
                <div>
                  <span className="font-bold text-[#000000] dark:text-white">
                    ระบบสืบค้นโครงข่ายสายน้ำประเทศไทย:
                  </span>
                  <span className="text-[#615d59] dark:text-[#9b9a97] ml-1.5 hidden sm:inline">
                    สำรวจ 15,146 ลำน้ำ, 1,843 คลอง, 46 เขื่อน และเช็คว่าพิกัดของเราอยู่ใกล้แม่น้ำลำคลองไหน
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentView('rivers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-1.5 px-3 rounded-lg bg-[#0075de] hover:bg-[#005bab] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <span>เปิดดูโครงข่ายสายน้ำ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Map & Side Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              <div className="lg:col-span-7 xl:col-span-8 h-[400px] sm:h-[520px] md:h-[600px] lg:h-[640px]">
                <FloodMap
                  stations={stations}
                  rain={rain}
                  dams={dams}
                  gdacs={gdacs}
                  isDark={isDark}
                  selectedStationId={selectedStationId}
                  flyToTarget={flyToTarget}
                  flyToBoundsTarget={flyToBoundsTarget}
                  onSelectStation={handleSelectStation}
                  filterProvince={selectedProvince}
                />
              </div>

              <div className="lg:col-span-5 xl:col-span-4 h-[440px] sm:h-[520px] md:h-[600px] lg:h-[640px]">
                <SidePanel
                  stations={stations}
                  news={news}
                  selectedStationId={selectedStationId}
                  onSelectStation={handleSelectStation}
                  externalSearchQuery={selectedProvince}
                  onOpenStationDrawer={(s) => setDrawerStation(s)}
                />
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: ANALYTICS & RIVER BASINS & MAJOR DAMS */}
        {(currentView === 'analytics' || currentView === 'all') && (
          <section className="space-y-4">
            <BasinSummary
              stations={stations}
              onSelectBasin={handleSelectBasin}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <WatchlistProvinces
                stations={stations}
                rain={rain}
                onSelectProvince={(prov, pts) => handleSelectProvince(prov, pts)}
              />
              <MajorDams
                dams={dams}
                onSelectDamCoords={(lat, lng) => handleFlyToCoords(lat, lng, 11)}
                onOpenAttributionModal={() => setIsAttributionModalOpen(true)}
              />
            </div>
          </section>
        )}

        {/* VIEW: THAI RIVER NETWORK (สายน้ำประเทศไทย - แม่น้ำ ลำน้ำสาขา คลอง เขื่อน) */}
        {(currentView === 'rivers' || currentView === 'all') && (
          <section className="space-y-4">
            <ThaiRiverNetwork
              stations={stations}
              dams={dams}
              onFlyToCoords={handleFlyToCoords}
              onOpenAttributionModal={() => setIsAttributionModalOpen(true)}
            />
          </section>
        )}

        {/* VIEW: WATER FLOW PROGRESSION (เส้นทางมวลน้ำ & ทิศทางการไหล & ระดับน้ำแต่ละจุด) */}
        {(currentView === 'flow' || currentView === 'all') && (
          <section className="space-y-4">
            <WaterFlowTracker
              stations={stations}
              onFlyToCoords={handleFlyToCoords}
              onSelectStation={handleSelectStation}
            />
          </section>
        )}

        {/* VIEW: GOOGLE EARTH & GLOFAS SOIL MOISTURE & HYDROLOGY FORECAST */}
        {(currentView === 'soil' || currentView === 'all') && (
          <section className="space-y-4">
            <GoogleEarthSoilWeather
              initialProvinceName={selectedProvince || 'กรุงเทพมหานคร'}
              onFlyToCoords={handleFlyToCoords}
            />
          </section>
        )}

        {/* VIEW: WEATHER FORECAST (Open-Meteo 100% Free, Hourly, Today, Tomorrow, 5-Day) */}
        {(currentView === 'forecast' || currentView === 'all') && (
          <section className="space-y-4">
            <WeatherForecastViewer
              initialProvinceName={selectedProvince || 'กรุงเทพมหานคร'}
              onFlyToCoords={handleFlyToCoords}
            />
            <WindyEmbed />
          </section>
        )}

        {/* VIEW 4: CCTV LIVE STREAMS & TRAFFIC CAMERAS */}
        {(currentView === 'cctv' || currentView === 'all') && (
          <section className="space-y-4">
            <CctvViewer onFlyToCoords={handleFlyToCoords} />
          </section>
        )}

        {/* VIEW: CITIZEN AID HUB, ROAD CLOSURES, SHELTERS & COMPENSATION */}
        {(currentView === 'aid' || currentView === 'all') && (
          <section className="space-y-4">
            <CitizenAidHub onFlyToCoords={handleFlyToCoords} />
          </section>
        )}

        {/* VIEW 5: TABLE DATABASE & EXCEL/CSV EXPORT */}
        {(currentView === 'table' || currentView === 'all') && (
          <section className="space-y-4">
            <StationTableExport
              stations={stations}
              onSelectStation={(id) => {
                handleSelectStation(id);
                setCurrentView('map');
              }}
              onOpenStationDrawer={(s) => setDrawerStation(s)}
            />
          </section>
        )}

        {/* VIEW 5: FLOOD PREPARATION & SANDBAG CALCULATOR */}
        {(currentView === 'prep' || currentView === 'all') && (
          <section className="space-y-4">
            <SandbagCalculator />
          </section>
        )}

        {/* VIEW 6: COMMUNITY, RESCUE & EMERGENCY */}
        {(currentView === 'community' || currentView === 'all') && (
          <section className="space-y-4">
            <EmergencyHotlines />
            <CommunityPosts />
            <OfficialResources />
          </section>
        )}

        {/* Footer */}
        <Footer
          onOpenAttributionModal={() => setIsAttributionModalOpen(true)}
          updatedAt={updatedAt || new Date()}
        />
      </main>

      {/* Drawer: Detailed Station Telemetry */}
      <StationDetailDrawer
        station={drawerStation}
        onClose={() => setDrawerStation(null)}
      />

      {/* Modal: Emergency Assistance & Guide */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Modal: SOS Beacon with GPS */}
      <SosBeaconModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* Modal: 1-Click Situation Summary */}
      <SituationSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        stations={stations}
        rain={rain}
        dams={dams}
        updatedAt={updatedAt}
      />

      {/* Modal: Data Sources & Attribution */}
      <DataSourceAttributionModal
        isOpen={isAttributionModalOpen}
        onClose={() => setIsAttributionModalOpen(false)}
        updatedAt={updatedAt || new Date()}
      />
    </div>
  );
}
