import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Sun, Moon, AlertOctagon, FileText, PhoneCall, Map, BarChart3, CloudRain, Users, LayoutGrid, Table, Calculator, Video, ShieldAlert, CloudSun, Waves, Globe, ChevronDown, MoreHorizontal, Check, Compass } from 'lucide-react';
import { clock } from '../utils/formatters';

export type ViewMode = 'map' | 'rivers' | 'flow' | 'soil' | 'forecast' | 'analytics' | 'cctv' | 'aid' | 'table' | 'prep' | 'community' | 'all';

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
  onOpenAttributionModal?: () => void;
}

interface SecondaryViewItem {
  id: ViewMode;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  desc: string;
}

const SECONDARY_VIEWS: SecondaryViewItem[] = [
  {
    id: 'analytics',
    label: 'จังหวัด & เขื่อน',
    shortLabel: 'จว. & เขื่อน',
    icon: <BarChart3 className="w-4 h-4 text-[#0075de]" />,
    desc: 'จัดอันดับจังหวัดเสี่ยง และสถานการณ์กักเก็บเขื่อนหลัก',
  },
  {
    id: 'cctv',
    label: 'กล้อง CCTV สด',
    shortLabel: 'CCTV สด',
    icon: <Video className="w-4 h-4 text-[#ff64c8]" />,
    desc: 'ภาพสดจากกล้อง กทม., กรมชลฯ และกรมทางหลวง',
  },
  {
    id: 'table',
    label: 'ตารางข้อมูลสถานี',
    shortLabel: 'ตารางข้อมูล',
    icon: <Table className="w-4 h-4 text-[#615d59]" />,
    desc: 'ค้นหา กรอง และส่งออกข้อมูล Excel / CSV',
  },
  {
    id: 'prep',
    label: 'คำนวณกระสอบทราย',
    shortLabel: 'กระสอบทราย',
    icon: <Calculator className="w-4 h-4 text-[#dd5b00]" />,
    desc: 'คำนวณจำนวนกระสอบและแนววางป้องกันน้ำ',
  },
  {
    id: 'community',
    label: 'แจ้งเหตุชุมชน',
    shortLabel: 'แจ้งเหตุชุมชน',
    icon: <Users className="w-4 h-4 text-[#2a9d99]" />,
    desc: 'โพสต์แจ้งเตือนระดับน้ำจากประชาชนในพื้นที่',
  },
  {
    id: 'all',
    label: 'รวมทุกมุมมอง (All Views)',
    shortLabel: 'รวมทั้งหมด',
    icon: <LayoutGrid className="w-4 h-4 text-[#9065b0]" />,
    desc: 'แสดงข้อมูลทุกโมดูลพร้อมกันในหน้าเดียว',
  },
];

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
  onOpenAttributionModal,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left?: number; right?: number }>({
    top: 52,
    right: 16,
  });

  const updatePopoverPos = () => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        setPopoverPos({
          top: rect.bottom + 6,
          right: 12,
        });
      } else {
        const left = Math.min(rect.left, window.innerWidth - 310);
        setPopoverPos({
          top: rect.bottom + 6,
          left: Math.max(12, left),
        });
      }
    }
  };

  const handleToggleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMoreOpen) {
      updatePopoverPos();
      setIsMoreOpen(true);
    } else {
      setIsMoreOpen(false);
    }
  };

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(target)
      ) {
        setIsMoreOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isMoreOpen) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isMoreOpen]);

  // Find if active view is in secondary views
  const activeSecondaryItem = SECONDARY_VIEWS.find((item) => item.id === currentView);
  const isSecondaryActive = Boolean(activeSecondaryItem);

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

        {/* Zone 2: Navigation & View Mode Switcher - 5 Essential Primary Tabs + Secondary Dropdown */}
        <nav className="flex items-center p-1 rounded-lg bg-[#f6f5f4] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs order-last lg:order-none w-full lg:w-auto overflow-x-auto gap-0.5 scrollbar-none">
          {/* Primary 1: แผนที่สด */}
          <button
            onClick={() => onSelectView('map')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'map'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>แผนที่สด</span>
          </button>

          {/* Primary 2: สายน้ำประเทศไทย */}
          <button
            onClick={() => onSelectView('rivers')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'rivers'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
            title="สายน้ำประเทศไทย: แม่น้ำ ลำน้ำสาขา คลอง และเขื่อน"
          >
            <Compass className="w-3.5 h-3.5 text-[#0075de]" />
            <span>สายน้ำประเทศไทย</span>
          </button>

          {/* Primary 3: เส้นทางมวลน้ำ & การไหล */}
          <button
            onClick={() => onSelectView('flow')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'flow'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-[#0075de]" />
            <span>เส้นทางมวลน้ำ</span>
          </button>

          {/* Primary 3: ดิน & น้ำ Google */}
          <button
            onClick={() => onSelectView('soil')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'soil'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#2a9d99]" />
            <span>ดิน & น้ำ Google</span>
          </button>

          {/* Primary 4: พยากรณ์อากาศ 5 วัน */}
          <button
            onClick={() => onSelectView('forecast')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'forecast'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5 text-[#dd5b00]" />
            <span>พยากรณ์อากาศ</span>
          </button>

          {/* Primary 5: ศูนย์ช่วยเหลือ & ถนนน้ำท่วม */}
          <button
            onClick={() => onSelectView('aid')}
            className={`shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              currentView === 'aid'
                ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#2a9d99]" />
            <span>ศูนย์ช่วยเหลือ</span>
          </button>

          {/* Secondary Submenu Dropdown: เมนูย่อยเครื่องมือเพิ่มเติม */}
          <div className="shrink-0">
            <button
              ref={moreButtonRef}
              onClick={handleToggleMore}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
                isSecondaryActive || isMoreOpen
                  ? 'bg-white dark:bg-[#252525] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-white/60 dark:hover:bg-[#252525]'
              }`}
            >
              {isSecondaryActive ? (
                <>
                  <span className="scale-90">{activeSecondaryItem?.icon}</span>
                  <span>{activeSecondaryItem?.shortLabel}</span>
                </>
              ) : (
                <>
                  <MoreHorizontal className="w-3.5 h-3.5 text-[#615d59]" />
                  <span>เพิ่มเติม</span>
                </>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180 text-[#0075de]' : 'opacity-70'}`} />
            </button>

            {/* Notion-style Floating Popover Submenu with fixed positioning */}
            {isMoreOpen && (
              <div
                ref={dropdownRef}
                style={{
                  position: 'fixed',
                  top: `${popoverPos.top}px`,
                  ...(popoverPos.left !== undefined ? { left: `${popoverPos.left}px` } : {}),
                  ...(popoverPos.right !== undefined ? { right: `${popoverPos.right}px` } : {}),
                }}
                className="w-72 sm:w-80 bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl z-[9999] p-1.5 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-[#615d59] dark:text-[#9b9a97] border-b border-[#e6e6e6] dark:border-[#2f2f2f] mb-1 flex items-center justify-between">
                  <span>เครื่องมือ & ฐานข้อมูลเพิ่มเติม</span>
                  <span className="text-[10px] text-[#0075de] font-medium">{SECONDARY_VIEWS.length} เมนู</span>
                </div>

                <div className="space-y-0.5 max-h-[72vh] overflow-y-auto">
                  {SECONDARY_VIEWS.map((item) => {
                    const isItemActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectView(item.id);
                          setIsMoreOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition cursor-pointer ${
                          isItemActive
                            ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-semibold'
                            : 'hover:bg-[#f6f5f4] dark:hover:bg-[#252525] text-[#31302e] dark:text-[#d4d4d4]'
                        }`}
                      >
                        <div className="p-1 rounded-md bg-[#f6f5f4] dark:bg-[#282828] shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{item.label}</span>
                            {isItemActive && <Check className="w-3.5 h-3.5 text-[#0075de] shrink-0 ml-1" />}
                          </div>
                          <p className="text-[10px] text-[#615d59] dark:text-[#9b9a97] line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {onOpenAttributionModal && (
                  <div className="border-t border-[#e6e6e6] dark:border-[#2f2f2f] pt-1 mt-1">
                    <button
                      onClick={() => {
                        onOpenAttributionModal();
                        setIsMoreOpen(false);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition cursor-pointer hover:bg-[#f6f5f4] dark:hover:bg-[#252525] text-[#31302e] dark:text-[#d4d4d4]"
                    >
                      <div className="p-1 rounded-md bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] shrink-0 mt-0.5">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">ที่มาข้อมูล & ลิขสิทธิ์</span>
                          <span className="text-[10px] bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] px-1.5 py-0.2 rounded font-mono font-semibold">สสน./OSM</span>
                        </div>
                        <p className="text-[10px] text-[#615d59] dark:text-[#9b9a97] line-clamp-1 mt-0.5">
                          คลังข้อมูลน้ำ สสน., HydroRIVERS, OSM, SRTM, Wikipedia
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
