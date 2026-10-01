import React from 'react';
import { Trophy, Users, TrendingUp, TrendingDown, Minus, Sparkles, Tv2, Calendar, Film } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/boxoffice';
import { formatCurrency, formatNumber } from '../utils/dateUtils';

interface BoxOfficeHeroProps {
  movie: DailyBoxOfficeItem;
  onSelectMovie: (movieCd: string) => void;
}

export const BoxOfficeHero: React.FC<BoxOfficeHeroProps> = ({ movie, onSelectMovie }) => {
  const audiChangeNum = parseFloat(movie.audiChange || '0');
  const audiIntenNum = parseInt(movie.audiInten || '0', 10);
  const salesShareNum = parseFloat(movie.salesShare || '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Rank Badge & Movie Info */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25">
              <Trophy className="w-3.5 h-3.5" />
              1위 SPOTLIGHT
            </span>

            {movie.rankOldAndNew === 'NEW' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-fuchsia-400" />
                NEW 신규 진입
              </span>
            ) : (
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium bg-zinc-800/80 px-2.5 py-0.5 rounded-full">
                {parseInt(movie.rankInten, 10) === 0 ? (
                  <>
                    <Minus className="w-3 h-3 text-zinc-400" /> 순위 유지
                  </>
                ) : parseInt(movie.rankInten, 10) > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-rose-400" /> {movie.rankInten}계단 상승
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-blue-400" /> {Math.abs(parseInt(movie.rankInten, 10))}계단 하락
                  </>
                )}
              </span>
            )}

            {movie.openDt && (
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                개봉 {movie.openDt}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {movie.movieNm}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <span>영화코드: <span className="font-mono text-zinc-300">{movie.movieCd}</span></span>
              <span>•</span>
              <span>스크린 <span className="text-white font-medium">{formatNumber(movie.scrnCnt)}</span>개관</span>
              <span>•</span>
              <span>상영 <span className="text-white font-medium">{formatNumber(movie.showCnt)}</span>회</span>
            </p>
          </div>

          {/* Market Share Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">당일 박스오피스 매출 점유율</span>
              <span className="text-amber-400 font-bold">{salesShareNum.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(salesShareNum, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Key Numerical Metrics & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-between lg:justify-center">
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            {/* Daily Audience */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
              <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-400" />
                일일 관객수
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-black text-amber-300">
                {formatNumber(movie.audiCnt)}
                <span className="text-xs font-normal text-zinc-400 ml-1">명</span>
              </div>
              <div className="text-[11px] mt-0.5 flex items-center gap-1">
                {audiIntenNum > 0 ? (
                  <span className="text-rose-400 flex items-center font-semibold">
                    <TrendingUp className="w-3 h-3 mr-0.5" />+{formatNumber(audiIntenNum)} ({audiChangeNum}%)
                  </span>
                ) : audiIntenNum < 0 ? (
                  <span className="text-blue-400 flex items-center font-semibold">
                    <TrendingDown className="w-3 h-3 mr-0.5" />{formatNumber(audiIntenNum)} ({audiChangeNum}%)
                  </span>
                ) : (
                  <span className="text-zinc-400">- 0%</span>
                )}
              </div>
            </div>

            {/* Total Audience */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
              <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                <Film className="w-3 h-3 text-rose-400" />
                누적 관객수
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-black text-white">
                {formatNumber(movie.audiAcc)}
                <span className="text-xs font-normal text-zinc-400 ml-1">명</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                누적 {formatCurrency(movie.salesAcc)}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectMovie(movie.movieCd)}
            className="w-full mt-2 sm:mt-0 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Tv2 className="w-4 h-4" />
            <span>영화 상세정보 및 출연진 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
