import React from 'react';
import { DailyBoxOfficeItem } from '../types/boxoffice';
import { formatCurrency, formatNumber } from '../utils/dateUtils';

interface BoxOfficeStatsProps {
  items: DailyBoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
}

export const BoxOfficeStats: React.FC<BoxOfficeStatsProps> = ({ items, onSelectMovie }) => {
  if (!items || items.length === 0) return null;

  const totalDailyAudi = items.reduce((acc, cur) => acc + (parseInt(cur.audiCnt, 10) || 0), 0);
  const totalDailySales = items.reduce((acc, cur) => acc + (parseInt(cur.salesAmt, 10) || 0), 0);
  const newMoviesCount = items.filter((item) => item.rankOldAndNew === 'NEW').length;
  const top1Movie = items[0];

  const top5 = items.slice(0, 5);
  const maxShare = Math.max(...top5.map((m) => parseFloat(m.salesShare || '0')), 1);

  return (
    <section className="space-y-6">
      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400">상위 {items.length}개작 일일 관객수</div>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums">
            {formatNumber(totalDailyAudi)}
            <span className="text-xs font-normal text-zinc-400 ml-1">명</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400">상위 {items.length}개작 일일 매출액</div>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums">
            {formatCurrency(totalDailySales)}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400">신규 순위권 진입</div>
          <div className="mt-2 text-2xl font-bold text-amber-400 tabular-nums">
            {newMoviesCount}
            <span className="text-xs font-normal text-zinc-400 ml-1">편</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400">1위 매출 점유율</div>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums truncate">
            {parseFloat(top1Movie?.salesShare || '0').toFixed(1)}%
            <span className="text-xs font-normal text-zinc-400 ml-1.5">
              ({top1Movie?.movieNm})
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Market Share Visualization */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Top 5 매출 점유율 분포</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              당일 극장가 상위 5개 작품의 매출 점유율 및 일일 관객수 비교
            </p>
          </div>
          <span className="text-xs text-zinc-500 tabular-nums">단위: % / 명</span>
        </div>

        <div className="space-y-3.5 pt-2">
          {top5.map((movie) => {
            const share = parseFloat(movie.salesShare || '0');
            const barWidth = Math.max((share / maxShare) * 100, 4);

            return (
              <div
                key={movie.movieCd}
                onClick={() => onSelectMovie(movie.movieCd)}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-zinc-400 font-mono font-semibold tabular-nums">
                      {movie.rank}.
                    </span>
                    <span className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                      {movie.movieNm}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 tabular-nums text-xs">
                    <span className="text-zinc-400">{formatNumber(movie.audiCnt)}명</span>
                    <span className="font-bold text-amber-400 w-12 text-right">
                      {share.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      movie.rank === '1'
                        ? 'bg-amber-400'
                        : 'bg-zinc-600 group-hover:bg-amber-500/70'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
