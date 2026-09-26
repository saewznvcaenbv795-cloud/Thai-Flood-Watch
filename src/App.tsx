import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header, ViewMode } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { FloodMap } from './components/FloodMap';
import { SidePanel } from './components/SidePanel';
import { WindyEmbed } from './components/WindyEmbed';
import { LiveRadarViewer } from './components/LiveRadarViewer';
import { CctvViewer } from './components/CctvViewer';
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

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('thai_flood_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('thai_flood_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
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
    <div className="min-h-screen bg-[#eef3f2] dark:bg-[#0b1517] text-[#0e2429] dark:text-[#e2eeee] flex flex-col transition-colors duration-200">
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
      />

      {/* Main Content Area */}
      <main className="max-w-[1560px] mx-auto w-full px-3 sm:px-6 py-4 flex-1 space-y-4">
        {/* Network Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
            <span>⚠️ โหลดข้อมูลไม่สำเร็จ ({error}) ระบบจะลองใหม่อัตโนมัติทุก 5 นาที</span>
            <button
              onClick={loadAllData}
              className="underline font-semibold hover:text-red-700 cursor-pointer"
            >
              ลองใหม่ทันที
            </button>
          </div>
        )}

        {/* Urgent Overflow Alert Banner */}
        {overflowCount > 0 && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold">แจ้งเตือนสถานการณ์น้ำล้นตลิ่งวิกฤต: </span>
                <span>
                  พบสถานีน้ำล้นตลิ่ง <b className="font-mono-num">{fmt(overflowCount)}</b> จุด ในพื้นที่{' '}
                  {topOverflowProvinces.map((p) => `จ.${p}`).join(', ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  setCurrentView('map');
                  if (lv5Stations[0]) handleSelectStation(lv5Stations[0].id);
                }}
                className="py-1 px-3 rounded-lg bg-white text-red-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>ดูจุดล้นตลิ่ง</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsSosModalOpen(true)}
                className="py-1 px-3 rounded-lg bg-red-950/60 hover:bg-red-950/80 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-amber-300" />
                <span>ขอความช่วยเหลือ (SOS)</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Top Summary KPI Cards */}
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

        {/* VIEW 1: MAP & SIDE PANEL (Real-time telemetry + GPS location) */}
        {(currentView === 'map' || currentView === 'all') && (
          <section className="space-y-3.5">
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

            {/* Map & Side Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              <div className="lg:col-span-7 xl:col-span-8 h-[520px] sm:h-[640px]">
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

              <div className="lg:col-span-5 xl:col-span-4 h-[520px] sm:h-[640px]">
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
              />
            </div>
          </section>
        )}

        {/* VIEW 3: RADARS & FORECAST (Windy + TMD & BMA Weather Radars) */}
        {(currentView === 'radar' || currentView === 'all') && (
          <section className="space-y-4">
            <LiveRadarViewer />
            <WindyEmbed />
          </section>
        )}

        {/* VIEW 4: CCTV LIVE STREAMS & TRAFFIC CAMERAS */}
        {(currentView === 'cctv' || currentView === 'all') && (
          <section className="space-y-4">
            <CctvViewer onFlyToCoords={handleFlyToCoords} />
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
        <Footer />
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
    </div>
  );
}
