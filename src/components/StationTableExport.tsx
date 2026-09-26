import React, { useState, useMemo } from 'react';
import { Table, Download, Search, Filter, TrendingUp, TrendingDown, Minus, ChevronRight, Eye } from 'lucide-react';
import { WaterStation } from '../types';
import { fmt, clock, ago, LEVELS } from '../utils/formatters';

interface StationTableExportProps {
  stations: WaterStation[];
  onSelectStation: (stationId: string) => void;
  onOpenStationDrawer?: (station: WaterStation) => void;
}

export const StationTableExport: React.FC<StationTableExportProps> = ({
  stations,
  onSelectStation,
  onOpenStationDrawer,
}) => {
  const [search, setSearch] = useState('');
  const [basinFilter, setBasinFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Extract all unique basins
  const basins = useMemo(() => {
    const set = new Set<string>();
    stations.forEach((s) => {
      if (s.basin) set.add(s.basin);
    });
    return Array.from(set).sort();
  }, [stations]);

  // Filtered stations
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stations
      .filter((s) => {
        if (basinFilter !== 'all' && s.basin !== basinFilter) return false;
        if (levelFilter === 'crit' && s.level < 4) return false;
        if (levelFilter === 'overflow' && s.level !== 5) return false;
        if (levelFilter === 'high' && s.level !== 4) return false;
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          s.province.toLowerCase().includes(q) ||
          s.amphoe.toLowerCase().includes(q) ||
          s.basin.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.level - a.level || (b.pct ?? 0) - (a.pct ?? 0));
  }, [stations, search, basinFilter, levelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageStations = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Export to CSV with UTF-8 BOM for Thai language Excel support
  const handleExportCsv = () => {
    const headers = [
      'ชื่อสถานี',
      'จังหวัด',
      'อำเภอ',
      'ลุ่มน้ำ',
      'ระดับเตือนภัย',
      'ความจุลำน้ำ(%)',
      'ระดับน้ำ(ม.รทก.)',
      'ตลิ่งต่ำสุด(ม.รทก.)',
      'ต่างจากตลิ่ง(ม.)',
      'แนวโน้ม24ชม.',
      'เวลาตรวจวัด',
      'หน่วยงาน',
    ];

    const rows = filtered.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.province}"`,
      `"${s.amphoe}"`,
      `"${s.basin}"`,
      `"${LEVELS[s.level]?.label || '-'}"`,
      s.pct !== null ? s.pct.toFixed(1) : '',
      s.msl !== null ? s.msl.toFixed(2) : '',
      s.bank !== null ? s.bank.toFixed(2) : '',
      s.diffBank !== null ? s.diffBank.toFixed(2) : '',
      s.delta !== null ? (s.delta > 0 ? `+${s.delta.toFixed(2)}` : s.delta.toFixed(2)) : 'ทรงตัว',
      `"${clock(s.time)}"`,
      `"${s.agency}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `thai-flood-water-stations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 space-y-3 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <Table className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
            ฐานข้อมูลระดับน้ำโทรมาตรรายสถานีทั่วประเทศ
          </h2>
          <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
            ตรวจสอบ คัดกรองตามลุ่มน้ำ และส่งออกรายงานเป็นไฟล์ Excel (CSV)
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-white dark:hover:bg-[#1b3438] text-[#0a6c86] dark:text-[#3fb6d3] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ดาวน์โหลด Excel/CSV ({filtered.length} รายการ)</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#53676b] dark:text-[#91a6a9] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อสถานี / จังหวัด / อำเภอ…"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
          />
        </div>

        <select
          value={basinFilter}
          onChange={(e) => {
            setBasinFilter(e.target.value);
            setPage(1);
          }}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
        >
          <option value="all">ทุกลุ่มน้ำ ({basins.length})</option>
          {basins.map((b) => (
            <option key={b} value={b}>
              ลุ่มน้ำ{b}
            </option>
          ))}
        </select>

        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            setPage(1);
          }}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
        >
          <option value="all">ทุกระดับน้ำ</option>
          <option value="crit">เฉพาะจุดวิกฤต (ล้นตลิ่ง + น้ำมาก)</option>
          <option value="overflow">ล้นตลิ่งอย่างเดียว (&gt;100%)</option>
          <option value="high">น้ำมาก (70–100%)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#d2dedd] dark:border-[#233a3d]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f4f8f7] dark:bg-[#162b2e] border-b border-[#d2dedd] dark:border-[#233a3d] text-[#53676b] dark:text-[#91a6a9] font-semibold">
            <tr>
              <th className="py-2.5 px-3">สถานีโทรมาตร</th>
              <th className="py-2.5 px-3">พื้นที่ / ลุ่มน้ำ</th>
              <th className="py-2.5 px-3 text-center">สถานะ</th>
              <th className="py-2.5 px-3 text-right">ความจุลำน้ำ</th>
              <th className="py-2.5 px-3 text-right">ระดับน้ำ</th>
              <th className="py-2.5 px-3 text-right">ต่างจากตลิ่ง</th>
              <th className="py-2.5 px-3 text-center">แนวโน้ม</th>
              <th className="py-2.5 px-3 text-right">เวลาตรวจวัด</th>
              <th className="py-2.5 px-3 text-center">แอ็กชัน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2dedd]/60 dark:divide-[#233a3d]">
            {currentPageStations.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#53676b] dark:text-[#91a6a9]">
                  ไม่พบสถานีที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              currentPageStations.map((s) => {
                const isLv5 = s.level === 5;
                const isHigh = s.level === 4;
                const lv = LEVELS[s.level] || LEVELS[3];

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-[#f4f8f7]/70 dark:hover:bg-[#162b2e]/60 transition"
                  >
                    <td className="py-2 px-3 font-semibold text-[#0e2429] dark:text-[#e2eeee]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isLv5 ? 'bg-red-500 animate-pulse' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="truncate max-w-[180px]">{s.name}</span>
                      </div>
                    </td>

                    <td className="py-2 px-3 text-[#53676b] dark:text-[#91a6a9]">
                      <div className="truncate max-w-[160px]">
                        {s.amphoe ? `อ.${s.amphoe} ` : ''}จ.{s.province}
                      </div>
                      <div className="text-[10px] opacity-75">{s.basin}</div>
                    </td>

                    <td className="py-2 px-3 text-center">
                      <span className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-semibold border ${lv.badgeClass}`}>
                        {lv.label}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-right font-mono-num font-bold">
                      <span className={isLv5 ? 'text-red-600' : isHigh ? 'text-amber-600' : ''}>
                        {fmt(s.pct, 1)}%
                      </span>
                    </td>

                    <td className="py-2 px-3 text-right font-mono-num">
                      {fmt(s.msl, 2)} ม.
                    </td>

                    <td className="py-2 px-3 text-right font-mono-num">
                      {s.diffBank !== null ? (
                        <span className={s.diffBank > 0 && isLv5 ? 'text-red-600 font-semibold' : ''}>
                          {fmt(s.diffBank, 2)} ม.
                        </span>
                      ) : (
                        '–'
                      )}
                    </td>

                    <td className="py-2 px-3 text-center font-mono-num text-[11px]">
                      {s.delta !== null && s.delta > 0 ? (
                        <span className="text-red-600 font-semibold flex items-center justify-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> +{fmt(s.delta, 2)}
                        </span>
                      ) : s.delta !== null && s.delta < 0 ? (
                        <span className="text-emerald-600 flex items-center justify-center gap-0.5">
                          <TrendingDown className="w-3 h-3" /> -{fmt(Math.abs(s.delta), 2)}
                        </span>
                      ) : (
                        <span className="text-[#53676b] flex items-center justify-center gap-0.5">
                          <Minus className="w-3 h-3" /> ทรงตัว
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-3 text-right font-mono-num text-[11px] text-[#53676b] dark:text-[#91a6a9]">
                      {clock(s.time)}
                    </td>

                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectStation(s.id)}
                          className="p-1 rounded text-[#0a6c86] hover:bg-black/5 dark:hover:bg-white/10"
                          title="ดูบนแผนที่"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onOpenStationDrawer && (
                          <button
                            onClick={() => onOpenStationDrawer(s)}
                            className="p-1 rounded text-[#53676b] hover:text-[#0a6c86] hover:bg-black/5 dark:hover:bg-white/10"
                            title="เปิดข้อมูลเจาะลึก"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-[#53676b] dark:text-[#91a6a9] pt-1">
        <span>
          แสดงหน้า {page} จาก {totalPages} (ทั้งหมด {fmt(filtered.length)} สถานี)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2.5 py-1 rounded border border-[#d2dedd] dark:border-[#233a3d] hover:bg-[#f4f8f7] disabled:opacity-40 cursor-pointer"
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2.5 py-1 rounded border border-[#d2dedd] dark:border-[#233a3d] hover:bg-[#f4f8f7] disabled:opacity-40 cursor-pointer"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>
  );
};
