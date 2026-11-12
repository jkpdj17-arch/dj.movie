import React, { useState } from 'react';
import { Bookmark, TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/boxoffice';
import { formatCurrency, formatNumber } from '../utils/dateUtils';
import heroBannerImg from '../assets/images/cinema_hero_banner_1794452980304.jpg';

interface BoxOfficeHeroProps {
  movie: DailyBoxOfficeItem;
  dateLabel: string;
  isBookmarked: boolean;
  onToggleBookmark: (movie: DailyBoxOfficeItem) => void;
  onSelectMovie: (movieCd: string) => void;
}

export const BoxOfficeHero: React.FC<BoxOfficeHeroProps> = ({
  movie,
  dateLabel,
  isBookmarked,
  onToggleBookmark,
  onSelectMovie,
}) => {
  const [imgError, setImgError] = useState(false);

  const audiChangeNum = parseFloat(movie.audiChange || '0');
  const audiIntenNum = parseInt(movie.audiInten || '0', 10);
  const salesShareNum = parseFloat(movie.salesShare || '0');
  const rankIntenNum = parseInt(movie.rankInten || '0', 10);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 min-h-[340px] flex items-end">
      {/* Background Image with Measured Contrast Scrim */}
      {!imgError ? (
        <img
          src={heroBannerImg}
          alt="극장 상영관 배경"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />

      {/* Content */}
      <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        {/* Left: Editorial Spotlight */}
        <div className="space-y-4 max-w-2xl">
          {/* Clean Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400">
            <span>박스오피스 1위</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">{dateLabel}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            {movie.rankOldAndNew === 'NEW' ? (
              <span className="text-amber-300 font-semibold">신규 진입</span>
            ) : rankIntenNum === 0 ? (
              <span className="inline-flex items-center gap-1 text-zinc-300">
                <Minus className="w-3 h-3" /> 순위 유지
              </span>
            ) : rankIntenNum > 0 ? (
              <span className="inline-flex items-center gap-1 text-rose-400">
                <TrendingUp className="w-3 h-3" /> {rankIntenNum}계단 상승
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sky-400">
                <TrendingDown className="w-3 h-3" /> {Math.abs(rankIntenNum)}계단 하락
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            {movie.movieNm}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
            {movie.openDt && (
              <>
                <span>개봉 {movie.openDt}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
              </>
            )}
            <span className="tabular-nums">스크린 {formatNumber(movie.scrnCnt)}개관</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="tabular-nums">상영 {formatNumber(movie.showCnt)}회</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono text-xs text-zinc-400">코드 {movie.movieCd}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectMovie(movie.movieCd)}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>영화 상세정보 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(movie)}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:border-zinc-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isBookmarked ? '찜 완료' : '관심 영화 찜하기'}</span>
            </button>
          </div>
        </div>

        {/* Right: Key Metrics */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800/80 shrink-0">
          <div>
            <div className="text-xs text-zinc-400">일일 관객수</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-white tabular-nums">
              {formatNumber(movie.audiCnt)}
              <span className="text-xs font-normal text-zinc-400 ml-0.5">명</span>
            </div>
            <div className="text-xs mt-0.5 tabular-nums">
              {audiIntenNum > 0 ? (
                <span className="text-rose-400">+{formatNumber(audiIntenNum)} ({audiChangeNum}%)</span>
              ) : audiIntenNum < 0 ? (
                <span className="text-sky-400">{formatNumber(audiIntenNum)} ({audiChangeNum}%)</span>
              ) : (
                <span className="text-zinc-500">변동 없음</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-400">누적 관객수</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-white tabular-nums">
              {formatNumber(movie.audiAcc)}
              <span className="text-xs font-normal text-zinc-400 ml-0.5">명</span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5 tabular-nums">
              누적 {formatCurrency(movie.salesAcc)}
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-400">매출 점유율</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
              {salesShareNum.toFixed(1)}%
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(salesShareNum, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
