import React, { useState, useEffect } from 'react';
import { Share2, MessageSquare, ThumbsUp, Send, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { CommunityPost } from '../types';
import { ago } from '../utils/formatters';

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    platform: 'x',
    author: 'กู้ภัยร่วมกตัญญู จุดบางพลี',
    handle: 'ruamkatanyu_bp',
    category: 'rescue',
    province: 'สมุทรปราการ',
    text: 'แจ้งเตือนประชาชน ซอยวัดด่านสำโรง มีน้ำท่วมขังผิวจราจรสูง 30-40 ซม. รถเล็กควรหลีกเลี่ยง ทีมอาสาเข้าประจำจุดช่วยเข็นรถประชาชนแล้วครับ #น้ำท่วม',
    url: 'https://x.com/search?q=%23น้ำท่วม',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    likes: 128,
  },
  {
    id: 'post-2',
    platform: 'facebook',
    author: 'กลุ่มคนรักเมืองสองแคว พิษณุโลก',
    category: 'flood',
    province: 'พิษณุโลก',
    text: 'แม่น้ำน่านช่วงตัวเมืองพิษณุโลก ระดับน้ำเพิ่มขึ้นต่อเนื่องจากน้ำเหนือไหลหลบเข้าพื้นที่ลุ่มต่ำท้ายเขื่อนนเรศวร เทศบาลเตรียมกระสอบทรายแจกจ่ายจุดบริการชุมชน',
    url: 'https://facebook.com',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    likes: 85,
  },
  {
    id: 'post-3',
    platform: 'x',
    author: 'JS100 Radio',
    handle: 'js100radio',
    category: 'traffic',
    province: 'กรุงเทพมหานคร',
    text: '16:45 น. ฝนตกหนักแถบดอนเมือง-รังสิต ถนนวิภาวดีรังสิตขาออก หน้าอนุสรณ์สถาน มีน้ำท่วมเลนซ้าย การจราจรเคลื่อนตัวช้า สลับหยุดนิ่ง',
    url: 'https://x.com/js100radio',
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    likes: 342,
  },
  {
    id: 'post-4',
    platform: 'citizen',
    author: 'ชุมชนริมคลองเปรมประชากร',
    category: 'rescue',
    province: 'ปทุมธานี',
    text: 'ขอความช่วยเหลือ มีผู้สูงอายุติดอยู่ในบ้านริมคลองสะพานแดง ระดับน้ำท่วมบันไดชั้นล่าง ต้องการย้ายไปศูนย์พักพิงชั่วคราว ติดต่อศูนย์ประสานงานด่วน',
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    likes: 215,
  },
];

export const CommunityPosts: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('thai_flood_community_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_POSTS;
  });

  const [filter, setFilter] = useState<'all' | 'rescue' | 'flood' | 'traffic' | 'x' | 'facebook'>('all');
  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState<'rescue' | 'flood' | 'traffic' | 'general'>('flood');
  const [inputProvince, setInputProvince] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thai_flood_community_posts', JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setStatusMsg({ text: 'กรุณากรอกรายละเอียดสถานการณ์หรือพื้นที่', error: true });
      return;
    }

    const platform = inputUrl.includes('x.com') || inputUrl.includes('twitter.com')
      ? 'x'
      : inputUrl.includes('facebook.com')
      ? 'facebook'
      : 'citizen';

    const newPost: CommunityPost = {
      id: `user-post-${Date.now()}`,
      platform,
      author: platform === 'citizen' ? 'ประชาชนผู้แจ้งเหตุ' : platform === 'x' ? 'โพสต์จาก X' : 'โพสต์จาก Facebook',
      category: inputCategory,
      province: inputProvince.trim() || 'ไม่ระบุจังหวัด',
      text: inputText.trim(),
      url: inputUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      likes: 1,
    };

    setPosts([newPost, ...posts]);
    setInputUrl('');
    setInputText('');
    setInputProvince('');
    setStatusMsg({ text: 'บันทึกรายงานสถานการณ์ของท่านเรียบร้อยแล้ว ทุกคนที่เปิดเว็บจะเห็นทันที' });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'x' || filter === 'facebook') return p.platform === filter;
    return p.category === filter;
  });

  const getCategoryBadge = (cat: CommunityPost['category']) => {
    switch (cat) {
      case 'rescue':
        return { label: 'ขอความช่วยเหลือ', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' };
      case 'traffic':
        return { label: 'สภาพจราจร/ถนน', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      case 'flood':
        return { label: 'น้ำท่วมขัง', cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' };
      default:
        return { label: 'รายงานทั่วไป', cls: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col">
      {/* Head */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
            โพสต์จากชุมชนและแจ้งเตือนจากประชาชน
          </h2>
          <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
            แชร์ลิงก์โพสต์ X / Facebook หรือรายงานจุดน้ำท่วมและขอความช่วยเหลือในพื้นที่
          </p>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              filter === 'all'
                ? 'bg-[#0a6c86] text-white'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#e9efee]'
            }`}
          >
            ทั้งหมด ({posts.length})
          </button>
          <button
            onClick={() => setFilter('rescue')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              filter === 'rescue'
                ? 'bg-red-500 text-white'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
            }`}
          >
            ขอความช่วยเหลือ ({posts.filter((p) => p.category === 'rescue').length})
          </button>
          <button
            onClick={() => setFilter('traffic')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              filter === 'traffic'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            การจราจร ({posts.filter((p) => p.category === 'traffic').length})
          </button>
          <button
            onClick={() => setFilter('x')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              filter === 'x'
                ? 'bg-slate-800 text-white'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9]'
            }`}
          >
            X
          </button>
          <button
            onClick={() => setFilter('facebook')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              filter === 'facebook'
                ? 'bg-blue-600 text-white'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#53676b] dark:text-[#91a6a9]'
            }`}
          >
            Facebook
          </button>
        </div>
      </div>

      {/* Share / Report Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] mb-4 space-y-2.5"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="วางลิงก์โพสต์ เช่น https://x.com/…/status/… หรือ https://facebook.com/… (ถ้ามี)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] placeholder-[#53676b] focus:outline-none focus:border-[#0a6c86]"
          />
          <input
            type="text"
            value={inputProvince}
            onChange={(e) => setInputProvince(e.target.value)}
            placeholder="จังหวัด / อำเภอ เช่น จ.เชียงใหม่ อ.สารภี"
            className="sm:w-56 px-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] placeholder-[#53676b] focus:outline-none focus:border-[#0a6c86]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            maxLength={280}
            placeholder="รายละเอียดสถานการณ์ เช่น ระดับน้ำท่วมทางสัญจร, บ้านเรือนที่ต้องการความช่วยเหลือ, จุดเสี่ยง…"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] placeholder-[#53676b] focus:outline-none focus:border-[#0a6c86]"
          />

          <select
            value={inputCategory}
            onChange={(e: any) => setInputCategory(e.target.value)}
            className="sm:w-44 px-3 py-1.5 text-xs rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-[#0e2429] dark:text-[#e2eeee] focus:outline-none focus:border-[#0a6c86]"
          >
            <option value="flood">น้ำท่วมขังในพื้นที่</option>
            <option value="rescue">ขอความช่วยเหลือเร่งด่วน</option>
            <option value="traffic">ถนน/การจราจรติดขัด</option>
            <option value="general">รายงานเหตุทั่วไป</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#0a6c86] hover:bg-[#095f76] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>แชร์โพสต์ / แจ้งเหตุ</span>
          </button>
        </div>

        {statusMsg && (
          <div
            className={`text-xs p-2 rounded-md ${
              statusMsg.error
                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {statusMsg.text}
          </div>
        )}
      </form>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[460px] pr-1">
        {filteredPosts.map((p) => {
          const badge = getCategoryBadge(p.category);
          return (
            <article
              key={p.id}
              className="p-3.5 rounded-xl border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7]/50 dark:bg-[#162b2e]/50 flex flex-col justify-between hover:border-[#0a6c86]/50 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                    {p.province && (
                      <span className="text-[11px] text-[#53676b] dark:text-[#91a6a9] font-medium">
                        📍 {p.province}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#53676b] dark:text-[#91a6a9] font-mono-num">
                    {ago(p.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-[#0e2429] dark:text-[#e2eeee] leading-relaxed mb-3">
                  {p.text}
                </p>
              </div>

              <div className="pt-2 border-t border-[#d2dedd]/60 dark:border-[#233a3d] flex items-center justify-between text-xs text-[#53676b] dark:text-[#91a6a9]">
                <div className="flex items-center gap-1.5 text-[11px] font-medium truncate max-w-[200px]">
                  <span>{p.author}</span>
                  {p.handle && <span className="opacity-60">@{p.handle}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(p.id)}
                    className="flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="font-mono-num">{p.likes}</span>
                  </button>

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0a6c86] dark:text-[#3fb6d3] hover:underline flex items-center gap-0.5"
                    >
                      <span>เปิดโพสต์</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
