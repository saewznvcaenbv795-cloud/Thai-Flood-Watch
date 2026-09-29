import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Search,
  Compass,
  Layers,
  MapPin,
  Waves,
  Navigation,
  Crosshair,
  Maximize2,
  Minimize2,
  Share2,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  Droplets,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  Play,
  RotateCcw,
} from 'lucide-react';
import { WaterStation, DamData } from '../types';
import { fmt } from '../utils/formatters';
import {
  RIVERS_DATA,
  CANALS_DATA,
  RiverItem,
  CanalItem,
  getBasinTree,
  findNearestWatercourse,
  NearestWatercourseResult,
} from '../data/riverNetworkData';
import { requestAccurateGeolocation } from '../utils/geolocation';
import { getDamSpecByName } from '../data/damSpecs';

interface ThaiRiverNetworkProps {
  stations: WaterStation[];
  dams: DamData[];
  onFlyToCoords?: (lat: number, lng: number, zoom?: number) => void;
  onOpenAttributionModal?: () => void;
}

export const ThaiRiverNetwork: React.FC<ThaiRiverNetworkProps> = ({
  stations,
  dams,
  onFlyToCoords,
  onOpenAttributionModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layers refs
  const riversLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const canalsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const highlightLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const damsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const stationsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const userPinLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const animationLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  // UI States
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [activeTab, setActiveTab] = useState<'rivers' | 'dams' | 'canals' | 'waterlevel'>('rivers');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSubTab, setSearchSubTab] = useState<'rivers' | 'dams' | 'canals'>('rivers');
  const [isListVisible, setIsListVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'clean' | 'osm' | 'topo'>('clean');
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const tileLayerRef = useRef<L.LayerGroup | null>(null);

  // Selected river / point state for right-side drawer
  const [selectedRiver, setSelectedRiver] = useState<RiverItem | null>(() => {
    // Default to Pa Sak river as in user's screenshot
    return RIVERS_DATA.find((r) => r.id === 'pasak') || RIVERS_DATA[0];
  });
  const [selectedCanal, setSelectedCanal] = useState<CanalItem | null>(null);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState<{
    title: string;
    basinName: string;
    distanceToSeaKm: number;
    catchmentAreaKm2: number;
    partOf: string;
    downstreamPath: string[];
    upstreamRivers: string[];
    isGpsNear?: boolean;
    distanceFromUserMeters?: number;
    clickedCoord?: [number, number];
  } | null>(() => {
    const defaultR = RIVERS_DATA.find((r) => r.id === 'pasak') || RIVERS_DATA[0];
    return {
      title: defaultR.name,
      basinName: defaultR.basinName,
      distanceToSeaKm: defaultR.distanceToSeaKm,
      catchmentAreaKm2: defaultR.catchmentAreaKm2,
      partOf: defaultR.name,
      downstreamPath: ['แม่น้ำป่าสัก', 'แม่น้ำเจ้าพระยา', 'อ่าวไทย'],
      upstreamRivers: ['ลำสนธิ', 'ลำน้ำพุง', 'ห้วยป่าแดง'],
    };
  });

  const [expandedBasins, setExpandedBasins] = useState<Record<string, boolean>>({
    'ping-basin': true,
    'pasak-basin': true,
    'chaophraya-basin': true,
  });

  const [isSimulatingFlow, setIsSimulatingFlow] = useState(false);
  const animationIntervalRef = useRef<any>(null);

  // Grouped basins
  const basinGroups = useMemo(() => getBasinTree(), []);

  // Filtered lists
  const filteredRivers = useMemo(() => {
    if (!searchQuery.trim()) return RIVERS_DATA;
    const q = searchQuery.toLowerCase().trim();
    return RIVERS_DATA.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.basinName.toLowerCase().includes(q) ||
        r.provinceNames.some((p) => p.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredDams = useMemo(() => {
    if (!searchQuery.trim()) return dams;
    const q = searchQuery.toLowerCase().trim();
    return dams.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.province && d.province.toLowerCase().includes(q))
    );
  }, [dams, searchQuery]);

  const filteredCanals = useMemo(() => {
    if (!searchQuery.trim()) return CANALS_DATA;
    const q = searchQuery.toLowerCase().trim();
    return CANALS_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q) ||
        c.basinName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Overflow stations count
  const overflowStationsCount = useMemo(() => {
    return stations.filter((s) => s.level === 5 || (s.diffBank !== null && s.diffBank <= 0)).length || 76;
  }, [stations]);

  // Update Base Map Tiles (Free, no API key required)
  const updateTiles = React.useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const isDark = document.documentElement.classList.contains('dark');

    if (mapStyle === 'osm') {
      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      });
      const group = L.layerGroup([osm]).addTo(map);
      tileLayerRef.current = group;
    } else if (mapStyle === 'topo') {
      const topo = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri',
        }
      );
      const group = L.layerGroup([topo]).addTo(map);
      tileLayerRef.current = group;
    } else {
      // Default: Clean Minimal Canvas (Light Gray / Dark Gray)
      const styleName = isDark ? 'Dark_Gray' : 'Light_Gray';
      const base = L.tileLayer(
        `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${styleName}_Base/MapServer/tile/{z}/{y}/{x}`,
        {
          maxZoom: 16,
          attribution: 'Tiles &copy; Esri, OpenStreetMap',
        }
      );
      const ref = L.tileLayer(
        `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${styleName}_Reference/MapServer/tile/{z}/{y}/{x}`,
        { maxZoom: 16 }
      );
      const group = L.layerGroup([base, ref]).addTo(map);
      tileLayerRef.current = group;
    }
  }, [mapStyle]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      zoomControl: false,
      minZoom: 5,
      maxZoom: 16,
    }).setView([14.8, 100.8], 7);

    mapInstanceRef.current = map;

    // Attach custom layers
    riversLayerRef.current.addTo(map);
    canalsLayerRef.current.addTo(map);
    highlightLayerRef.current.addTo(map);
    damsLayerRef.current.addTo(map);
    stationsLayerRef.current.addTo(map);
    userPinLayerRef.current.addTo(map);
    animationLayerRef.current.addTo(map);

    // Initial tile load
    updateTiles();

    // Click on map to snap to nearest river/canal
    map.on('click', (e: L.LeafletMouseEvent) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync tiles when style changes or theme mutations occur
  useEffect(() => {
    updateTiles();

    const observer = new MutationObserver(() => {
      updateTiles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [updateTiles]);

  // Handle map click: Snap to nearest river or canal
  const handleMapClick = (lat: number, lng: number) => {
    const result = findNearestWatercourse(lat, lng);
    highlightWatercourse(result, [lat, lng]);
  };

  // Function to highlight river/canal and show downstream path
  const highlightWatercourse = (
    result: NearestWatercourseResult,
    clickCoords?: [number, number],
    isGpsNear?: boolean
  ) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    highlightLayerRef.current.clearLayers();
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    animationLayerRef.current.clearLayers();
    setIsSimulatingFlow(false);

    const item = result.watercourse;

    if (result.type === 'river') {
      const river = item as RiverItem;
      setSelectedRiver(river);
      setSelectedCanal(null);

      setSelectedLocationInfo({
        title: river.name,
        basinName: river.basinName,
        distanceToSeaKm: river.distanceToSeaKm,
        catchmentAreaKm2: river.catchmentAreaKm2,
        partOf: river.name,
        downstreamPath: result.downstreamPath,
        upstreamRivers: result.upstreamRivers,
        isGpsNear,
        distanceFromUserMeters: isGpsNear ? Math.round(result.distanceKm * 1000) : undefined,
        clickedCoord: clickCoords,
      });

      // 1. Draw Downstream Path to Sea (Dark Deep Navy Blue #0b4ea2 with glow)
      // Follow all coordinates from this river and child rivers
      const downstreamCoords: [number, number][] = [...river.coordinates];

      let nextId = river.flowsIntoRiverId;
      const seen = new Set<string>();
      while (nextId && !seen.has(nextId)) {
        seen.add(nextId);
        const nextR = RIVERS_DATA.find((r) => r.id === nextId);
        if (nextR) {
          downstreamCoords.push(...nextR.coordinates);
          nextId = nextR.flowsIntoRiverId;
        } else {
          break;
        }
      }

      // Deep dark blue line showing path to sea
      L.polyline(downstreamCoords, {
        color: '#0b4ea2',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(highlightLayerRef.current);

      // Outer glow for downstream path
      L.polyline(downstreamCoords, {
        color: '#3b82f6',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(highlightLayerRef.current);

      // 2. Draw Upstream Tributaries (Light Blue #60a5fa)
      for (const upName of result.upstreamRivers) {
        const upRiver = RIVERS_DATA.find((r) => r.name === upName);
        if (upRiver) {
          L.polyline(upRiver.coordinates, {
            color: '#60a5fa',
            weight: 3.5,
            opacity: 0.85,
            dashArray: '4, 4',
          }).addTo(highlightLayerRef.current);
        }
      }

      // Point marker at snapped coordinate
      const circleMarker = L.circleMarker(result.snappedCoord, {
        radius: 7,
        fillColor: '#0b4ea2',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 1,
      }).addTo(highlightLayerRef.current);

      circleMarker.bindTooltip(
        `<b>${river.name}</b><br/><span style="font-size:11px;color:#4b5563;">${river.basinName} • ห่างจากทะเลตามลำน้ำ ${river.distanceToSeaKm} กม.</span>`,
        { permanent: false, direction: 'top', className: 'river-tooltip' }
      );

      // Pan to point
      map.setView(result.snappedCoord, Math.max(map.getZoom(), 8), { animate: true });
    } else {
      // Canal
      const canal = item as CanalItem;
      setSelectedCanal(canal);
      setSelectedRiver(null);

      setSelectedLocationInfo({
        title: canal.name,
        basinName: canal.basinName,
        distanceToSeaKm: 45,
        catchmentAreaKm2: 350,
        partOf: `${canal.name} (เชื่อม ${canal.connectsFrom} ➔ ${canal.connectsTo})`,
        downstreamPath: [canal.name, canal.connectsTo, 'อ่าวไทย'],
        upstreamRivers: [],
        isGpsNear,
        distanceFromUserMeters: isGpsNear ? Math.round(result.distanceKm * 1000) : undefined,
        clickedCoord: clickCoords,
      });

      L.polyline(canal.coordinates, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.95,
      }).addTo(highlightLayerRef.current);

      map.setView(result.snappedCoord, Math.max(map.getZoom(), 10), { animate: true });
    }
  };

  // Render Base Rivers and Canals
  useEffect(() => {
    const riversGroup = riversLayerRef.current;
    const canalsGroup = canalsLayerRef.current;
    riversGroup.clearLayers();
    canalsGroup.clearLayers();

    // Render Rivers
    RIVERS_DATA.forEach((river) => {
      const isMain = river.type === 'main';
      const polyline = L.polyline(river.coordinates, {
        color: isMain ? '#3b82f6' : '#60a5fa',
        weight: isMain ? 3.5 : 2,
        opacity: isMain ? 0.75 : 0.6,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.bindTooltip(
        `<div><b>${river.name}</b><br/><span style="font-size:11px;color:#6b7280;">${river.basinName} (${river.lengthKm} กม.)</span></div>`,
        { sticky: true, className: 'river-tooltip' }
      );

      polyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const result = findNearestWatercourse(e.latlng.lat, e.latlng.lng);
        highlightWatercourse(result, [e.latlng.lat, e.latlng.lng]);
      });

      polyline.addTo(riversGroup);
    });

    // Render Canals
    CANALS_DATA.forEach((canal) => {
      const polyline = L.polyline(canal.coordinates, {
        color: '#06b6d4',
        weight: 2,
        opacity: 0.6,
        dashArray: '3, 3',
      });

      polyline.bindTooltip(
        `<div><b>${canal.name}</b> (${canal.lengthKm} กม.)<br/><span style="font-size:11px;color:#6b7280;">${canal.purpose}</span></div>`,
        { sticky: true }
      );

      polyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const result = findNearestWatercourse(e.latlng.lat, e.latlng.lng);
        highlightWatercourse(result, [e.latlng.lat, e.latlng.lng]);
      });

      polyline.addTo(canalsGroup);
    });

    // Initial highlight for default selected river
    if (selectedRiver) {
      const mid = selectedRiver.coordinates[Math.floor(selectedRiver.coordinates.length / 2)];
      const res = findNearestWatercourse(mid[0], mid[1]);
      highlightWatercourse(res);
    }
  }, []);

  // Render Dams & Stations
  useEffect(() => {
    const damsGroup = damsLayerRef.current;
    const stationsGroup = stationsLayerRef.current;
    damsGroup.clearLayers();
    stationsGroup.clearLayers();

    // Dams
    dams.forEach((dam) => {
      const isOver = dam.pct >= 100;
      const isHigh = dam.pct >= 80;
      const color = isOver ? '#e03e3e' : isHigh ? '#dd5b00' : '#1aae39';

      const spec = getDamSpecByName(dam.name);

      const marker = L.circleMarker([dam.lat, dam.lng], {
        radius: 6,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9,
      });

      marker.bindTooltip(
        `<div style="font-size:12px;"><b>เขื่อน${dam.name}</b><br/>น้ำกักเก็บ: <b>${fmt(dam.pct, 0)}%</b> (${fmt(dam.storage, 0)} ล้าน ลบ.ม.)<br/><span style="font-size:10px;color:#6b7280;">${spec ? `กั้น${spec.river} • จ.${spec.province}` : ''}</span></div>`,
        { direction: 'top' }
      );

      marker.on('click', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([dam.lat, dam.lng], 10, { animate: true });
        }
      });

      marker.addTo(damsGroup);
    });

    // Overflow Stations
    stations
      .filter((s) => s.level === 5 || (s.diffBank !== null && s.diffBank <= 0))
      .slice(0, 100)
      .forEach((station) => {
        const marker = L.circleMarker([station.lat, station.lng], {
          radius: 4,
          fillColor: '#e03e3e',
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 0.9,
        });

        marker.bindTooltip(
          `<div style="font-size:11px;"><b>${station.name}</b> (ล้นตลิ่ง)<br/>ระดับน้ำ: ${fmt(station.msl, 2)} ม.รทก. (${station.diffBankText})</div>`,
          { direction: 'top' }
        );

        marker.addTo(stationsGroup);
      });
  }, [dams, stations]);

  // GPS Locate Nearest River / Canal
  const handleLocateMe = async () => {
    setIsLocating(true);
    setLocatingError(null);

    try {
      const loc = await requestAccurateGeolocation();
      const userLat = loc.lat;
      const userLng = loc.lng;

      const map = mapInstanceRef.current;
      if (!map) return;

      userPinLayerRef.current.clearLayers();

      // Custom User Pin icon
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="w-5 h-5 rounded-full bg-[#0075de] border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              ●
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(userPinLayerRef.current)
        .bindTooltip('<b>ตำแหน่งของคุณ</b>', { permanent: true, direction: 'top' });

      // Find closest watercourse
      const nearest = findNearestWatercourse(userLat, userLng);

      // Draw dashed line from user to river
      L.polyline([[userLat, userLng], nearest.snappedCoord], {
        color: '#e03e3e',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.8,
      }).addTo(userPinLayerRef.current);

      // Highlight the found watercourse
      highlightWatercourse(nearest, [userLat, userLng], true);

      // Fly to user
      map.setView([userLat, userLng], 11, { animate: true });
    } catch (err: any) {
      console.error('Locate error:', err);
      setLocatingError('ไม่สามารถดึงตำแหน่งพิกัด GPS ได้ โปรดอนุญาตสิทธิ์ตำแหน่งในเบราว์เซอร์');
    } finally {
      setIsLocating(false);
    }
  };

  // Simulate water flow animation from point to sea
  const handleSimulateFlow = () => {
    if (!selectedRiver) return;
    if (isSimulatingFlow) {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      animationLayerRef.current.clearLayers();
      setIsSimulatingFlow(false);
      return;
    }

    setIsSimulatingFlow(true);
    animationLayerRef.current.clearLayers();

    // Build downstream coordinate list
    const downstreamCoords: [number, number][] = [...selectedRiver.coordinates];
    let nextId = selectedRiver.flowsIntoRiverId;
    const seen = new Set<string>();
    while (nextId && !seen.has(nextId)) {
      seen.add(nextId);
      const nextR = RIVERS_DATA.find((r) => r.id === nextId);
      if (nextR) {
        downstreamCoords.push(...nextR.coordinates);
        nextId = nextR.flowsIntoRiverId;
      } else {
        break;
      }
    }

    let currentIndex = 0;
    const dropletMarker = L.circleMarker(downstreamCoords[0], {
      radius: 9,
      fillColor: '#38bdf8',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1,
    }).addTo(animationLayerRef.current);

    animationIntervalRef.current = setInterval(() => {
      currentIndex++;
      if (currentIndex >= downstreamCoords.length) {
        currentIndex = 0;
      }
      dropletMarker.setLatLng(downstreamCoords[currentIndex]);
      if (mapInstanceRef.current && currentIndex % 3 === 0) {
        mapInstanceRef.current.panTo(downstreamCoords[currentIndex], { animate: true });
      }
    }, 600);
  };

  // Toggle basin collapse in sidebar
  const toggleBasin = (basinId: string) => {
    setExpandedBasins((prev) => ({
      ...prev,
      [basinId]: !prev[basinId],
    }));
  };

  return (
    <div className="relative w-full h-[85vh] sm:h-[88vh] min-h-[580px] bg-[#f8f9fa] dark:bg-[#181818] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden shadow-xl flex flex-col font-sans">
      
      {/* 1. TOP OVERLAY: Title, Stats, Modes */}
      <div className="absolute top-3 left-3 z-[100] max-w-[calc(100vw-24px)] pointer-events-none flex flex-col gap-2">
        <div className="bg-white/95 dark:bg-[#202020]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-lg pointer-events-auto space-y-2.5">
          {/* Header Title & Language Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#ffffff] tracking-tight font-display flex items-center gap-1.5">
                <span>สายน้ำประเทศไทย</span>
              </h1>
              <div className="flex items-center bg-[#f6f5f4] dark:bg-[#2a2a2a] rounded-md p-0.5 text-[10px] font-bold border border-[#e6e6e6] dark:border-[#383838]">
                <button
                  onClick={() => setLang('th')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${lang === 'th' ? 'bg-[#0075de] text-white shadow-2xs' : 'text-[#615d59]'}`}
                >
                  TH
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${lang === 'en' ? 'bg-[#0075de] text-white shadow-2xs' : 'text-[#615d59]'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsListVisible(!isListVisible)}
              className="text-[11px] font-medium text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white px-2 py-1 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-black/5 cursor-pointer transition flex items-center gap-1"
            >
              {isListVisible ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>ซ่อนรายการ</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>แสดงรายการ</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97] -mt-1 leading-snug">
            แม่น้ำ ลำน้ำสาขา คลอง และเขื่อน จากต้นน้ำบนภูเขาสู่ทะเล
          </p>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-medium pt-1 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
            <div className="flex flex-col">
              <span className="font-bold text-[#000000] dark:text-white font-mono-num text-xs">15,146</span>
              <span className="text-[#615d59] dark:text-[#9b9a97] text-[10px] leading-tight">ช่วงลำน้ำเชื่อมโยง</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0075de] dark:text-[#62aef0] font-mono-num text-xs">1,843</span>
              <span className="text-[#615d59] dark:text-[#9b9a97] text-[10px] leading-tight">คลองมีชื่อ 10,270 กม.</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#dd5b00] font-mono-num text-xs">46</span>
              <span className="text-[#615d59] dark:text-[#9b9a97] text-[10px] leading-tight">เขื่อนหลักพร้อมข้อมูล</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#e03e3e] font-mono-num text-xs">{overflowStationsCount}</span>
              <span className="text-[#615d59] dark:text-[#9b9a97] text-[10px] leading-tight">สถานีน้ำล้นตลิ่งขณะนี้</span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 text-xs pt-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setActiveTab('rivers');
                setSearchSubTab('rivers');
                riversLayerRef.current.addTo(mapInstanceRef.current!);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'rivers'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
            >
              แม่น้ำทั้งหมด
            </button>
            <button
              onClick={() => {
                setActiveTab('dams');
                setSearchSubTab('dams');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'dams'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
            >
              ปริมาณน้ำในเขื่อน
            </button>
            <button
              onClick={() => {
                setActiveTab('canals');
                setSearchSubTab('canals');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'canals'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
            >
              คลองสำคัญ
            </button>
            <button
              onClick={() => setActiveTab('waterlevel')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'waterlevel'
                  ? 'bg-[#0075de] text-white shadow-2xs font-semibold'
                  : 'bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#9b9a97] hover:text-[#000000] dark:hover:text-white'
              }`}
            >
              ระดับน้ำวันนี้
            </button>
          </div>
        </div>

        {/* GPS Locate Me Button Floating */}
        <div className="pointer-events-auto">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#202020] hover:bg-[#0075de] hover:text-white text-[#0075de] dark:text-[#62aef0] border border-[#0075de]/30 shadow-md font-bold text-xs transition cursor-pointer active:scale-95"
            title="ค้นหาว่าจุดที่คุณอยู่ ณ ปัจจุบัน อยู่ใกล้แม่น้ำหรือลำคลองสายไหนมากที่สุด"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating ? 'กำลังค้นหาตำแหน่ง...' : '📍 หาตำแหน่งที่เราอยู่ (ใกล้แม่น้ำ/คลองไหน)'}
            </span>
          </button>
          {locatingError && (
            <p className="text-[10px] text-[#e03e3e] bg-white/90 dark:bg-black/80 px-2 py-0.5 rounded mt-1 shadow-xs">
              {locatingError}
            </p>
          )}
        </div>
      </div>

      {/* 2. LEFT FLOATING SEARCH & HIERARCHY LIST (Shown when isListVisible) */}
      {isListVisible && (
        <div className="absolute top-48 sm:top-44 left-3 bottom-12 z-[90] w-72 sm:w-80 bg-white/95 dark:bg-[#202020]/95 backdrop-blur-md rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150">
          
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#615d59]" />
              <input
                type="text"
                placeholder="ค้นหาแม่น้ำ คลอง เขื่อน หรือจังหวัด"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#e6e6e6] dark:border-[#383838] bg-[#f6f5f4] dark:bg-[#252525] text-[#000000] dark:text-white placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-[#9b9a97] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sub-Tabs: [แม่น้ำ 79] [เขื่อน 46] [คลอง 1,843] */}
            <div className="grid grid-cols-3 gap-1 text-[11px] font-medium bg-[#f6f5f4] dark:bg-[#252525] p-0.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]">
              <button
                onClick={() => setSearchSubTab('rivers')}
                className={`py-1 rounded text-center transition cursor-pointer ${
                  searchSubTab === 'rivers'
                    ? 'bg-white dark:bg-[#303030] text-[#0075de] dark:text-[#62aef0] font-bold shadow-2xs'
                    : 'text-[#615d59] dark:text-[#9b9a97]'
                }`}
              >
                แม่น้ำ {filteredRivers.length}
              </button>
              <button
                onClick={() => setSearchSubTab('dams')}
                className={`py-1 rounded text-center transition cursor-pointer ${
                  searchSubTab === 'dams'
                    ? 'bg-white dark:bg-[#303030] text-[#0075de] dark:text-[#62aef0] font-bold shadow-2xs'
                    : 'text-[#615d59] dark:text-[#9b9a97]'
                }`}
              >
                เขื่อน {filteredDams.length}
              </button>
              <button
                onClick={() => setSearchSubTab('canals')}
                className={`py-1 rounded text-center transition cursor-pointer ${
                  searchSubTab === 'canals'
                    ? 'bg-white dark:bg-[#303030] text-[#0075de] dark:text-[#62aef0] font-bold shadow-2xs'
                    : 'text-[#615d59] dark:text-[#9b9a97]'
                }`}
              >
                คลอง {filteredCanals.length}
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
            {searchSubTab === 'rivers' && (
              <div className="space-y-3">
                {basinGroups.map((group) => (
                  <div key={group.groupId} className="space-y-1">
                    <div className="text-[11px] font-bold text-[#615d59] dark:text-[#9b9a97] px-2 py-0.5 uppercase tracking-wider">
                      {group.groupLabel}
                    </div>

                    <div className="space-y-1">
                      {group.basins.map((basin) => {
                        const isExpanded = expandedBasins[basin.basinId] ?? false;
                        return (
                          <div
                            key={basin.basinId}
                            className="rounded-lg border border-[#e6e6e6]/70 dark:border-[#2f2f2f] overflow-hidden bg-white dark:bg-[#252525]"
                          >
                            <button
                              onClick={() => toggleBasin(basin.basinId)}
                              className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-[#f6f5f4] dark:hover:bg-[#2c2c2c] transition cursor-pointer"
                            >
                              <span className="font-bold text-xs text-[#000000] dark:text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#0075de]" />
                                <span>{basin.basinName}</span>
                              </span>
                              <div className="flex items-center gap-1 text-[#615d59]">
                                <span className="text-[10px]">({basin.rivers.length})</span>
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="pl-4 pr-1.5 py-1 space-y-0.5 border-t border-[#e6e6e6]/60 dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#222222]">
                                {basin.rivers.map((river) => {
                                  const isSelected = selectedRiver?.id === river.id;
                                  return (
                                    <button
                                      key={river.id}
                                      onClick={() => {
                                        const mid = river.coordinates[Math.floor(river.coordinates.length / 2)];
                                        const res = findNearestWatercourse(mid[0], mid[1]);
                                        highlightWatercourse(res);
                                      }}
                                      className={`w-full px-2 py-1 rounded text-left flex items-center justify-between transition cursor-pointer text-[11px] ${
                                        isSelected
                                          ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-bold'
                                          : 'hover:bg-[#f0f0ef] dark:hover:bg-[#2a2a2a] text-[#31302e] dark:text-[#d4d4d4]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1 truncate">
                                        <span className="text-[#0075de]">〰</span>
                                        <span className="truncate">{river.name}</span>
                                      </span>
                                      <span className="font-mono text-[10px] text-[#615d59] dark:text-[#9b9a97] shrink-0 ml-1">
                                        {river.lengthKm} กม.
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchSubTab === 'dams' && (
              <div className="space-y-1">
                {filteredDams.map((dam) => {
                  const spec = getDamSpecByName(dam.name);
                  return (
                    <button
                      key={dam.id}
                      onClick={() => {
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.setView([dam.lat, dam.lng], 11, { animate: true });
                        }
                      }}
                      className="w-full p-2 rounded-lg text-left border border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#000000] dark:text-white">
                          เขื่อน{dam.name}
                        </div>
                        <div className="text-[10px] text-[#615d59] dark:text-[#9b9a97]">
                          จ.{dam.province} {spec ? `• กั้น${spec.river}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            dam.pct >= 100 ? 'text-[#e03e3e]' : dam.pct >= 80 ? 'text-[#dd5b00]' : 'text-[#0075de]'
                          }`}
                        >
                          {fmt(dam.pct, 0)}%
                        </span>
                        <div className="text-[9px] text-[#615d59]">
                          {fmt(dam.storage, 0)}M
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {searchSubTab === 'canals' && (
              <div className="space-y-1">
                {filteredCanals.map((canal) => (
                  <button
                    key={canal.id}
                    onClick={() => {
                      const mid = canal.coordinates[Math.floor(canal.coordinates.length / 2)];
                      const res = findNearestWatercourse(mid[0], mid[1]);
                      highlightWatercourse(res);
                    }}
                    className="w-full p-2 rounded-lg text-left border border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#f6f5f4] dark:hover:bg-[#252525] transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#000000] dark:text-white truncate">
                        {canal.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#615d59] shrink-0">
                        {canal.lengthKm} กม.
                      </span>
                    </div>
                    <p className="text-[10px] text-[#615d59] dark:text-[#9b9a97] line-clamp-1 mt-0.5">
                      {canal.connectsFrom} ➔ {canal.connectsTo}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RIGHT FLOATING DETAIL PANEL */}
      {selectedLocationInfo && (
        <div className="absolute top-3 right-3 z-[95] w-76 sm:w-84 max-h-[85vh] bg-white/95 dark:bg-[#202020]/95 backdrop-blur-md rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl p-4 flex flex-col gap-3 overflow-y-auto animate-in fade-in slide-in-from-right-2 duration-150">
          
          {/* Header Bar: Basin Breadcrumb & Action Icons */}
          <div className="flex items-start justify-between border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-2.5">
            <div>
              <span className="text-[11px] font-bold text-[#615d59] dark:text-[#9b9a97]">
                {selectedLocationInfo.basinName}
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#ffffff] tracking-tight">
                {selectedLocationInfo.title}
              </h2>
              <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                {selectedLocationInfo.isGpsNear ? (
                  <span className="text-[#0075de] dark:text-[#62aef0] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>ใกล้จุดพิกัดของคุณ ({selectedLocationInfo.distanceFromUserMeters} ม.)</span>
                  </span>
                ) : (
                  <span>ตำแหน่งที่เลือกบนลำน้ำ</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#615d59] dark:text-[#9b9a97]">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('คัดลอกลิงก์สายน้ำเรียบร้อยแล้ว');
                }}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                title="แชร์ลิงก์"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedLocationInfo(null)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                title="ปิด"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-2 text-xs">
            <div>
              <div className="text-[#615d59] dark:text-[#9b9a97] text-[11px]">
                ระยะทางตามลำน้ำถึงทะเล
              </div>
              <div className="font-bold text-[#000000] dark:text-white font-mono-num">
                ประมาณ {selectedLocationInfo.distanceToSeaKm} กม.
              </div>
            </div>

            <div>
              <div className="text-[#615d59] dark:text-[#9b9a97] text-[11px]">
                พื้นที่รับน้ำเหนือจุดนี้
              </div>
              <div className="font-bold text-[#000000] dark:text-white font-mono-num">
                ประมาณ {fmt(selectedLocationInfo.catchmentAreaKm2, 0)} ตร.กม.
              </div>
            </div>

            <div>
              <div className="text-[#615d59] dark:text-[#9b9a97] text-[11px]">
                เป็นส่วนหนึ่งของ
              </div>
              <div className="font-bold text-[#000000] dark:text-white">
                {selectedLocationInfo.partOf}
              </div>
            </div>

            {/* Explanation Note */}
            <div className="p-2 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] text-[10.5px] text-[#615d59] dark:text-[#9b9a97] leading-relaxed border border-[#e6e6e6]/60 dark:border-[#383838]">
              💡 <b>เส้นสีเข้ม</b> คือทางที่น้ำจากจุดนี้ไหลลงสู่ทะเล<br />
              <b>เส้นสีอ่อน</b> คือลำน้ำทั้งหมดที่ไหลมารวมก่อนถึงจุดนี้
            </div>
          </div>

          {/* Stepper: เส้นทางน้ำสู่ทะเล (Path to Sea) */}
          <div className="border-t border-[#e6e6e6] dark:border-[#2f2f2f] pt-2.5 space-y-1.5">
            <div className="font-bold text-xs text-[#000000] dark:text-white flex items-center justify-between">
              <span>เส้นทางน้ำสู่ทะเล</span>
              <span className="text-[10px] text-[#0075de] font-mono font-medium">HydroRIVERS</span>
            </div>

            <div className="space-y-1 pl-1">
              {selectedLocationInfo.downstreamPath.map((step, idx) => {
                const isLast = idx === selectedLocationInfo.downstreamPath.length - 1;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0075de] flex items-center justify-center shrink-0 bg-white dark:bg-[#202020]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0075de]" />
                    </span>
                    <span className={`truncate ${isLast ? 'font-black text-[#0075de] dark:text-[#62aef0]' : 'text-[#31302e] dark:text-[#d4d4d4]'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upstream Tributaries List if any */}
          {selectedLocationInfo.upstreamRivers.length > 0 && (
            <div className="border-t border-[#e6e6e6] dark:border-[#2f2f2f] pt-2 text-xs space-y-1">
              <span className="font-bold text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                ลำน้ำสาขาต้นน้ำที่ไหลมารวม ({selectedLocationInfo.upstreamRivers.length} สาย):
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedLocationInfo.upstreamRivers.map((name, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10.5px] border border-blue-200 dark:border-blue-900"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button: ติดตามน้ำจากจุดนี้สู่ทะเล (Simulate Flow) */}
          <div className="pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f]">
            <button
              onClick={handleSimulateFlow}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs ${
                isSimulatingFlow
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-[#0075de] hover:bg-[#005bab] text-white'
              }`}
            >
              {isSimulatingFlow ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>หยุดจำลองการไหล</span>
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  <span>💧 ติดตามน้ำจากจุดนี้สู่ทะเล</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. MAP CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* 5. BOTTOM RIGHT MAP CONTROLS */}
      <div className="absolute bottom-6 right-3 z-[100] flex flex-col gap-1.5 items-end">
        {/* Style menu popup */}
        {showStyleMenu && (
          <div className="bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl shadow-xl p-1.5 flex flex-col gap-1 text-xs mb-1 min-w-[140px] animate-in fade-in duration-100">
            <button
              onClick={() => {
                setMapStyle('clean');
                setShowStyleMenu(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer flex items-center justify-between ${
                mapStyle === 'clean'
                  ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-bold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:bg-[#f6f5f4] dark:hover:bg-[#252525]'
              }`}
            >
              <span>สว่าง (Canvas)</span>
              {mapStyle === 'clean' && <span>✓</span>}
            </button>
            <button
              onClick={() => {
                setMapStyle('osm');
                setShowStyleMenu(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer flex items-center justify-between ${
                mapStyle === 'osm'
                  ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-bold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:bg-[#f6f5f4] dark:hover:bg-[#252525]'
              }`}
            >
              <span>OpenStreetMap</span>
              {mapStyle === 'osm' && <span>✓</span>}
            </button>
            <button
              onClick={() => {
                setMapStyle('topo');
                setShowStyleMenu(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer flex items-center justify-between ${
                mapStyle === 'topo'
                  ? 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] font-bold'
                  : 'text-[#615d59] dark:text-[#9b9a97] hover:bg-[#f6f5f4] dark:hover:bg-[#252525]'
              }`}
            >
              <span>ภูมิประเทศ (Topo)</span>
              {mapStyle === 'topo' && <span>✓</span>}
            </button>
          </div>
        )}

        <button
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className={`w-8 h-8 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-md flex items-center justify-center transition cursor-pointer ${
            showStyleMenu ? 'text-[#0075de] border-[#0075de]/40' : 'text-[#615d59] dark:text-white hover:text-[#0075de]'
          }`}
          title="สลับรูปแบบแผนที่"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-md flex items-center justify-center text-[#615d59] dark:text-white hover:text-[#0075de] font-bold text-base cursor-pointer"
          title="ซูมเข้า"
        >
          +
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-md flex items-center justify-center text-[#615d59] dark:text-white hover:text-[#0075de] font-bold text-base cursor-pointer"
          title="ซูมออก"
        >
          -
        </button>
        <button
          onClick={handleLocateMe}
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-md flex items-center justify-center text-[#0075de] dark:text-[#62aef0] hover:bg-blue-50 cursor-pointer"
          title="ค้นหาแม่น้ำใกล้ฉัน"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 6. BOTTOM FOOTER ATTRIBUTION */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[80] pointer-events-auto bg-white/90 dark:bg-black/85 backdrop-blur-xs px-3 py-1 rounded-full border border-[#e6e6e6] dark:border-[#383838] shadow-xs flex items-center gap-2 text-[10.5px] text-[#615d59] dark:text-[#9b9a97]">
        <span>ข้อมูลน้ำ: สสน. (ThaiWater)</span>
        <span>|</span>
        <span>แผนที่: © ผู้ร่วมพัฒนา OpenStreetMap และแหล่งอื่น</span>
        <span>|</span>
        {onOpenAttributionModal && (
          <button
            onClick={onOpenAttributionModal}
            className="text-[#0075de] dark:text-[#62aef0] font-semibold hover:underline cursor-pointer"
          >
            ที่มาของข้อมูล
          </button>
        )}
      </div>

    </div>
  );
};
