import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Flame, Newspaper, AlertCircle, TrendingUp, TrendingDown, Minus, ChevronRight, Share2 } from 'lucide-react';
import { WaterStation, FloodNews } from '../types';
import { fmt, clock, ago, LEVELS } from '../utils/formatters';

interface SidePanelProps {
  stations: WaterStation[];
  news: FloodNews[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  externalSearchQuery?: string;
  onOpenStationDrawer?: (station: WaterStation) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  stations,
  news,
  selectedStationId,
  onSelectStation,
  externalSearchQuery = '',
  onOpenStationDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<'crit' | 'news' | 'x'>('crit');
  const [filterText, setFilterText] = useState(externalSearchQuery);

  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setFilterText(externalSearchQuery);
      if (externalSearchQuery) setActiveTab('crit');
    }
  }, [externalSearchQuery]);

  const criticalStations = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return stations
      .filter((s) => s.level >= 4)
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.province.toLowerCase().includes(q) ||
          s.amphoe.toLowerCase().includes(q) ||
          s.basin.toLowerCase().includes(q)
      )
      .sort((a, b) => b.level - a.level || (b.pct ?? 0) - (a.pct ?? 0));
  }, [stations, filterText]);

  const lv5Count = useMemo(() => stations.filter((s) => s.level === 5).length, [stations]);

  const trendingHashtags = [
    '#น้ำท่วม',
    '#น้ำท่วมกรุงเทพ',
    '#ขอความช่วยเหลือ',
    '#น้ำป่า',
    '#ฝนตกหนัก',
    '#น้ำท่วมเชียงใหม่',
    '#น้ำท่วมหาดใหญ่',
  ];

  return (
    <aside className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      {/* Tabs - Notion segment */}
      <div className="flex border-b border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#252525] p-1 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('crit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
            activeTab === 'crit'
              ? 'bg-white dark:bg-[#202020] text-[#e03e3e] dark:text-[#ff6464] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>จุดวิกฤต</span>
          {lv5Count > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#e03e3e] text-white text-[10px] font-mono-num font-bold">
              {lv5Count}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
            activeTab === 'news'
              ? 'bg-white dark:bg-[#202020] text-[#0075de] dark:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff]'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>ข่าวล่าสุด</span>
          {news.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#0075de]/15 text-[#0075de] dark:text-[#62aef0] text-[10px] font-mono-num">
              {news.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('x')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
            activeTab === 'x'
              ? 'bg-white dark:bg-[#202020] text-[#000000] dark:text-[#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold border border-[#e6e6e6] dark:border-[#383838]'
              : 'text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-[#ffffff]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#dd5b00]" />
          <span>X #น้ำท่วม</span>
        </button>
      </div>

      {/* Pane Body */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col">
        {/* Tab 1: จุดวิกฤต */}
        {activeTab === 'crit' && (
          <div className="flex-1 flex flex-col gap-2.5">
            {/* Search filter input - Notion text-input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#615d59] dark:text-[#9b9a97] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="ค้นหาจังหวัด / สถานี / ลุ่มน้ำ…"
                className="w-full pl-8 pr-12 py-1.5 text-xs bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xs text-[#000000] dark:text-[#ffffff] placeholder-[#a39e98] focus:outline-none focus:border-[#0075de]"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#615d59] hover:text-[#000000] cursor-pointer"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* List */}
            {criticalStations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-xs text-[#615d59] dark:text-[#9b9a97]">
                <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 opacity-60" />
                <p>{filterText ? 'ไม่พบสถานีที่ตรงกับคำค้นหา' : 'ไม่มีสถานีน้ำมากหรือล้นตลิ่งในขณะนี้'}</p>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto pr-1">
                {criticalStations.slice(0, 150).map((s) => {
                  const isLv5 = s.level === 5;
                  const isSelected = selectedStationId === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`w-full rounded-md border transition p-2.5 flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-[#0075de] bg-[#0075de]/5 dark:bg-[#0075de]/10 ring-1 ring-[#0075de]'
                          : isLv5
                          ? 'border-[#e03e3e]/30 bg-[#e03e3e]/5 hover:bg-[#e03e3e]/10'
                          : 'border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#f6f5f4] dark:hover:bg-[#252525]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectStation(s.id)}
                        className="min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isLv5 ? 'bg-[#e03e3e] animate-pulse' : 'bg-[#dd5b00]'
                            }`}
                          />
                          <span className="font-semibold text-xs text-[#000000] dark:text-[#ffffff] truncate">
                            {s.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97] truncate">
                          {s.amphoe ? `อ.${s.amphoe} ` : ''}{s.province ? `จ.${s.province}` : ''}
                          <span className="opacity-75 font-mono-num"> · {clock(s.time)}</span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span
                            className={`inline-block text-xs font-bold font-mono-num px-1.5 py-0.2 rounded-sm ${
                              isLv5
                                ? 'bg-[#e03e3e] text-white'
                                : 'bg-[#dd5b00]/15 text-[#dd5b00] dark:text-[#ff8c42]'
                            }`}
                          >
                            {fmt(s.pct, 0)}%
                          </span>
                          <div className="text-[10px] mt-0.5 font-mono-num">
                            {s.delta !== null && s.delta > 0 ? (
                              <span className="text-[#e03e3e] font-semibold flex items-center justify-end">
                                <TrendingUp className="w-2.5 h-2.5" /> +{fmt(s.delta, 2)}m
                              </span>
                            ) : s.delta !== null && s.delta < 0 ? (
                              <span className="text-[#1aae39] flex items-center justify-end">
                                <TrendingDown className="w-2.5 h-2.5" /> -{fmt(Math.abs(s.delta), 2)}m
                              </span>
                            ) : (
                              <span className="text-[#615d59] dark:text-[#9b9a97] flex items-center justify-end">
                                <Minus className="w-2.5 h-2.5" /> ทรงตัว
                              </span>
                            )}
                          </div>
                        </div>

                        {onOpenStationDrawer && (
                          <button
                            type="button"
                            onClick={() => onOpenStationDrawer(s)}
                            className="p-1 rounded-sm text-[#615d59] hover:text-[#0075de] hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                            title="เปิดข้อมูลเจาะลึก"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ข่าวล่าสุด */}
        {activeTab === 'news' && (
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
            {news.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[#615d59] dark:text-[#9b9a97]">
                กำลังโหลดข่าวสารล่าสุด…
              </div>
            ) : (
              news.map((item, idx) => {
                const pubDate = new Date(item.published);
                const isRecent = Date.now() - pubDate.getTime() < 3 * 3600 * 1000;

                return (
                  <article
                    key={idx}
                    className="p-2.5 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] transition"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <h4 className="text-xs font-semibold text-[#000000] dark:text-[#ffffff] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] line-clamp-2 leading-snug mb-1.5">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                        <div className="flex items-center gap-1.5">
                          {isRecent && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#e03e3e] text-white font-bold text-[9px]">
                              ใหม่
                            </span>
                          )}
                          <span className="font-medium text-[#0075de] dark:text-[#62aef0]">{item.source}</span>
                        </div>
                        <span className="font-mono-num">{ago(pubDate)}</span>
                      </div>
                    </a>
                  </article>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: X #น้ำท่วม */}
        {activeTab === 'x' && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-[#213183] text-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#62aef0] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  รายงานสดจากทวิตเตอร์ / X
                </span>
                <span className="text-[10px] opacity-75">เรียลไทม์</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90 mb-3">
                ติดตามโพสต์เตือนภัย ขอความช่วยเหลือ และภาพน้ำท่วมในพื้นที่จริง
              </p>
              <a
                href="https://x.com/search?q=%23%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%97%E0%B9%88%E0%B8%A7%E0%B8%A1&f=live"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-full bg-white text-[#000000] hover:bg-slate-100 font-medium text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>เปิดฟีด #น้ำท่วม สดบน X</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#615d59] dark:text-[#9b9a97] mb-2">
                แฮชแท็กติดตามสถานการณ์:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingHashtags.map((tag) => (
                  <a
                    key={tag}
                    href={`https://x.com/search?q=${encodeURIComponent(tag)}&f=live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-md bg-[#f6f5f4] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#0075de] dark:text-[#62aef0] hover:border-[#0075de] transition font-medium"
                  >
                    {tag} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
