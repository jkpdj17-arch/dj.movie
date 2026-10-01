import React from 'react';
import { Film, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentDateText: string;
}

export const Header: React.FC<HeaderProps> = ({ currentDateText }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Film className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                일일 박스오피스
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  KOBIS
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              영화진흥위원회 영화관입장권통합전산망 공식 OpenAPI 연동
            </p>
          </div>
        </div>

        {/* Right Info / Security Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>서버 환경변수 API 키 보안 적용</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[140px] sm:max-w-none">{currentDateText}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
