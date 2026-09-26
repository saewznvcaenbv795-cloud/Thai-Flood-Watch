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
    <aside className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs overflow-hidden flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/70 p-1 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('crit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'crit'
              ? 'bg-white dark:bg-[#112225] text-red-600 dark:text-red-400 shadow-2xs'
              : 'text-[#53676b] dark:text-[#91a6a9] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>จุดวิกฤต</span>
          {lv5Count > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono-num font-bold">
              {lv5Count}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'news'
              ? 'bg-white dark:bg-[#112225] text-[#0a6c86] dark:text-[#3fb6d3] shadow-2xs'
              : 'text-[#53676b] dark:text-[#91a6a9] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>ข่าวล่าสุด</span>
          {news.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#0a6c86]/15 dark:bg-[#3fb6d3]/20 text-[#0a6c86] dark:text-[#3fb6d3] text-[10px] font-mono-num">
              {news.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('x')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'x'
              ? 'bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] shadow-2xs'
              : 'text-[#53676b] dark:text-[#91a6a9] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>X #น้ำท่วม</span>
        </button>
      </div>

      {/* Pane Body */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col">
        {/* Tab 1: จุดวิกฤต */}
        {activeTab === 'crit' && (
          <div className="flex-1 flex flex-col gap-2.5">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#53676b] dark:text-[#91a6a9] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="ค้นหาจังหวัด / สถานี / ลุ่มน้ำ…"
                className="w-full pl-8 pr-12 py-1.5 text-xs bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] rounded-lg text-[#0e2429] dark:text-[#e2eeee] placeholder-[#53676b] focus:outline-none focus:border-[#0a6c86]"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#53676b] hover:text-[#0e2429] cursor-pointer"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* List */}
            {criticalStations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-xs text-[#53676b] dark:text-[#91a6a9]">
                <AlertCircle className="w-8 h-8 text-slate-400 mb-2 opacity-60" />
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
                      className={`w-full rounded-lg border transition p-2.5 flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-[#0a6c86] bg-[#0a6c86]/5 dark:bg-[#3fb6d3]/10 ring-1 ring-[#0a6c86]'
                          : isLv5
                          ? 'border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/40'
                          : 'border-[#d2dedd]/70 dark:border-[#233a3d] hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e]'
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
                              isLv5 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                            }`}
                          />
                          <span className="font-semibold text-xs text-[#0e2429] dark:text-[#e2eeee] truncate">
                            {s.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] truncate">
                          {s.amphoe ? `อ.${s.amphoe} ` : ''}{s.province ? `จ.${s.province}` : ''}
                          <span className="opacity-75 font-mono-num"> · {clock(s.time)}</span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span
                            className={`inline-block text-xs font-bold font-mono-num px-1.5 py-0.2 rounded ${
                              isLv5
                                ? 'bg-red-500 text-white'
                                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {fmt(s.pct, 0)}%
                          </span>
                          <div className="text-[10px] mt-0.5 font-mono-num">
                            {s.delta !== null && s.delta > 0 ? (
                              <span className="text-red-500 font-semibold flex items-center justify-end">
                                <TrendingUp className="w-2.5 h-2.5" /> +{fmt(s.delta, 2)}m
                              </span>
                            ) : s.delta !== null && s.delta < 0 ? (
                              <span className="text-emerald-500 flex items-center justify-end">
                                <TrendingDown className="w-2.5 h-2.5" /> -{fmt(Math.abs(s.delta), 2)}m
                              </span>
                            ) : (
                              <span className="text-[#53676b] dark:text-[#91a6a9] flex items-center justify-end">
                                <Minus className="w-2.5 h-2.5" /> ทรงตัว
                              </span>
                            )}
                          </div>
                        </div>

                        {onOpenStationDrawer && (
                          <button
                            type="button"
                            onClick={() => onOpenStationDrawer(s)}
                            className="p-1 rounded-md text-[#53676b] hover:text-[#0a6c86] dark:hover:text-[#3fb6d3] hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
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
              <div className="flex-1 flex items-center justify-center text-xs text-[#53676b] dark:text-[#91a6a9]">
                กำลังโหลดข่าวสารล่าสุด…
              </div>
            ) : (
              news.map((item, idx) => {
                const pubDate = new Date(item.published);
                const isRecent = Date.now() - pubDate.getTime() < 3 * 3600 * 1000;

                return (
                  <article
                    key={idx}
                    className="p-2.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] transition"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <h4 className="text-xs font-semibold text-[#0e2429] dark:text-[#e2eeee] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3] line-clamp-2 leading-snug mb-1.5">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-[#53676b] dark:text-[#91a6a9]">
                        <div className="flex items-center gap-1.5">
                          {isRecent && (
                            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold text-[9px]">
                              ใหม่
                            </span>
                          )}
                          <span className="font-medium text-[#0a6c86] dark:text-[#3fb6d3]">{item.source}</span>
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
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
                className="w-full py-2 px-3 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>เปิดฟีด #น้ำท่วม สดบน X</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-2">
                แฮชแท็กติดตามสถานการณ์:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingHashtags.map((tag) => (
                  <a
                    key={tag}
                    href={`https://x.com/search?q=${encodeURIComponent(tag)}&f=live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-md bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] text-[#0a6c86] dark:text-[#3fb6d3] hover:border-[#0a6c86] transition font-medium"
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
