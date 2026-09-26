import React from 'react';
import { RefreshCw, Sun, Moon, AlertOctagon, FileText, PhoneCall, Map, BarChart3, CloudRain, Users, LayoutGrid, Table, Calculator, Video } from 'lucide-react';
import { clock } from '../utils/formatters';

export type ViewMode = 'map' | 'analytics' | 'radar' | 'cctv' | 'table' | 'prep' | 'community' | 'all';

interface HeaderProps {
  updatedAt: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  overflowCount: number;
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenEmergencyModal: () => void;
  onOpenSummaryModal: () => void;
  onOpenSosModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  updatedAt,
  isLoading,
  onRefresh,
  isDark,
  onToggleTheme,
  overflowCount,
  currentView,
  onSelectView,
  onOpenEmergencyModal,
  onOpenSummaryModal,
  onOpenSosModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#112225]/95 backdrop-blur-md border-b border-[#d2dedd] dark:border-[#233a3d] transition-colors">
      <div className="max-w-[1560px] mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0a6c86] to-[#3fb6d3] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg className="w-5 h-5 stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 32 32">
              <path d="M2 20c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" />
              <path d="M2 26c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" />
              <path d="M16 3v10M12 9l4 4 4-4" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-[#0e2429] dark:text-[#e2eeee] font-display whitespace-nowrap">
              Thai Flood Watch
            </span>
            <span className="text-xs text-[#53676b] dark:text-[#91a6a9] font-medium hidden md:inline">
              เฝ้าระวังน้ำท่วมไทย
            </span>
          </div>

          {/* Quick live indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] text-[11px] text-[#53676b] dark:text-[#91a6a9] font-mono-num ml-1">
            <span className={`inline-block w-2 h-2 rounded-full ${overflowCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{isLoading ? 'กำลังโหลด…' : updatedAt ? clock(updatedAt) : 'สด'}</span>
          </div>
        </div>

        {/* Zone 2: Navigation & View Mode Switcher */}
        <nav className="flex items-center p-0.5 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] text-xs order-last lg:order-none w-full lg:w-auto overflow-x-auto py-1">
          <button
            onClick={() => onSelectView('map')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'map'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>แผนที่สด</span>
          </button>

          <button
            onClick={() => onSelectView('analytics')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'analytics'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>จังหวัด & เขื่อน</span>
          </button>

          <button
            onClick={() => onSelectView('radar')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'radar'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>เรดาร์ฝน</span>
          </button>

          <button
            onClick={() => onSelectView('cctv')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'cctv'
                ? 'bg-white dark:bg-[#112225] text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>กล้อง CCTV สด</span>
          </button>

          <button
            onClick={() => onSelectView('table')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'table'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>ตารางข้อมูล/Excel</span>
          </button>

          <button
            onClick={() => onSelectView('prep')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'prep'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>คำนวณกระสอบทราย</span>
          </button>

          <button
            onClick={() => onSelectView('community')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'community'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>แจ้งเหตุชุมชน</span>
          </button>

          <button
            onClick={() => onSelectView('all')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'all'
                ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-xs font-semibold'
                : 'text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>รวมทั้งหมด</span>
          </button>
        </nav>

        {/* Zone 3: Actions (SOS, Emergency, Summary, Refresh, Theme) */}
        <div className="flex items-center gap-1.5 text-xs">
          {/* SOS Beacon CTA */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs transition cursor-pointer whitespace-nowrap animate-pulse"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>ขอความช่วยเหลือ (SOS)</span>
          </button>

          {/* Emergency Assistance */}
          <button
            onClick={onOpenEmergencyModal}
            className="hidden sm:flex items-center gap-1 py-1.5 px-2 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold transition cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>สายด่วน 1784</span>
          </button>

          {/* Export Summary */}
          <button
            onClick={onOpenSummaryModal}
            className="hidden md:flex items-center gap-1 py-1.5 px-2 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#162b2e] hover:bg-[#f4f8f7] text-[#0e2429] dark:text-[#e2eeee] transition cursor-pointer whitespace-nowrap font-medium"
            title="คัดลอกสรุปสถานการณ์"
          >
            <FileText className="w-3.5 h-3.5 text-[#0a6c86] dark:text-[#3fb6d3]" />
            <span>สรุปข้อมูล</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#162b2e] hover:bg-[#f4f8f7] text-[#53676b] dark:text-[#91a6a9] transition cursor-pointer disabled:opacity-50"
            title="รีเฟรชข้อมูล"
            aria-label="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#162b2e] hover:bg-[#f4f8f7] text-[#53676b] dark:text-[#91a6a9] transition cursor-pointer"
            aria-label="เปลี่ยนธีม"
            title={isDark ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
