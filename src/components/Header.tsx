import React from 'react';
import { RefreshCw, Sun, Moon, AlertOctagon, FileText, PhoneCall, Map, BarChart3, CloudRain, Users, LayoutGrid, Table, Calculator, Video, ShieldAlert, CloudSun, Waves, Globe } from 'lucide-react';
import { clock } from '../utils/formatters';

export type ViewMode = 'map' | 'flow' | 'soil' | 'forecast' | 'analytics' | 'cctv' | 'aid' | 'table' | 'prep' | 'community' | 'all';

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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#191919]/95 backdrop-blur-md border-b border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors">
      <div className="max-w-[1560px] mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Zone 1: Notion-style Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0075de] text-white flex items-center justify-center shadow-xs shrink-0 font-bold text-sm">
            🌊
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-[#000000] dark:text-[#ffffff] font-display whitespace-nowrap">
              ThaiFlood<span className="text-[#0075de]">.online</span>
            </span>
            <span className="text-xs text-[#615d59] dark:text-[#9b9a97] font-medium hidden md:inline">
              เฝ้าระวังน้ำท่วมไทย
            </span>
          </div>

          {/* Quick live indicator - Notion badge-pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[11px] text-[#615d59] dark:text-[#9b9a97] font-mono-num ml-1">
            <span className={`inline-block w-2 h-2 rounded-full ${overflowCount > 0 ? 'bg-[#e03e3e] animate-pulse' : 'bg-[#1aae39]'}`} />
            <span>{isLoading ? 'กำลังโหลด…' : updatedAt ? clock(updatedAt) : 'สด'}</span>
          </div>
        </div>

        {/* Zone 2: Navigation & View Mode Switcher - Notion style segment */}
        <nav className="flex items-center p-1 rounded-lg bg-[#f6f5f4] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs order-last lg:order-none w-full lg:w-auto overflow-x-auto gap-0.5 scrollbar-none">
          <button
            onClick={() => onSelectView('map')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'map'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>แผนที่สด</span>
          </button>

          <button
            onClick={() => onSelectView('flow')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'flow'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-[#0075de]" />
            <span>เส้นทางมวลน้ำ & การไหล</span>
          </button>

          <button
            onClick={() => onSelectView('soil')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'soil'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#2a9d99]" />
            <span>ดิน & น้ำ Google</span>
          </button>

          <button
            onClick={() => onSelectView('forecast')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'forecast'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5 text-[#dd5b00]" />
            <span>พยากรณ์อากาศ 5 วัน</span>
          </button>

          <button
            onClick={() => onSelectView('analytics')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'analytics'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>จังหวัด & เขื่อน</span>
          </button>

          <button
            onClick={() => onSelectView('cctv')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'cctv'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#ff64c8]" />
            <span>กล้อง CCTV สด</span>
          </button>

          <button
            onClick={() => onSelectView('aid')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'aid'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#2a9d99]" />
            <span>ศูนย์ช่วยเหลือ & ถนนน้ำท่วม</span>
          </button>

          <button
            onClick={() => onSelectView('table')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'table'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>ตารางข้อมูล</span>
          </button>

          <button
            onClick={() => onSelectView('prep')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'prep'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>คำนวณกระสอบทราย</span>
          </button>

          <button
            onClick={() => onSelectView('community')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'community'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>แจ้งเหตุชุมชน</span>
          </button>

          <button
            onClick={() => onSelectView('all')}
            className={`shrink-0 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'all'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>รวมทั้งหมด</span>
          </button>
        </nav>

        {/* Zone 3: Notion-style Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
          {/* Primary Action: Notion Blue or Red Pill CTA */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-full bg-[#e03e3e] hover:bg-[#c92a2a] text-white font-medium shadow-xs transition cursor-pointer whitespace-nowrap active:scale-95 text-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">ขอความช่วยเหลือ (SOS)</span>
            <span className="xs:hidden">SOS</span>
          </button>

          {/* Emergency Assistance - Notion button-utility */}
          <button
            onClick={onOpenEmergencyModal}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#31302e] dark:text-[#d4d4d4] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] font-medium transition cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0075de]" />
            <span>สายด่วน 1784</span>
          </button>

          {/* Export Summary - Notion button-utility */}
          <button
            onClick={onOpenSummaryModal}
            className="hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] text-[#31302e] dark:text-[#d4d4d4] transition cursor-pointer whitespace-nowrap font-medium"
            title="คัดลอกสรุปสถานการณ์"
          >
            <FileText className="w-3.5 h-3.5 text-[#0075de]" />
            <span>สรุปข้อมูล</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] transition cursor-pointer disabled:opacity-50"
            title="รีเฟรชข้อมูล"
            aria-label="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] text-[#615d59] dark:text-[#9b9a97] transition cursor-pointer"
            aria-label="เปลี่ยนธีม"
            title={isDark ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-[#f2cb38]" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
