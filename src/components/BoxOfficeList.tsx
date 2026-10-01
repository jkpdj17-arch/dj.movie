import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  Calendar,
  Users,
  Eye,
  Film
} from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/boxoffice';
import { formatCurrency, formatNumber } from '../utils/dateUtils';

interface BoxOfficeListProps {
  items: DailyBoxOfficeItem[];
  viewMode: 'card' | 'table';
  onSelectMovie: (movieCd: string) => void;
}

export const BoxOfficeList: React.FC<BoxOfficeListProps> = ({
  items,
  viewMode,
  onSelectMovie,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
        <Film className="w-12 h-12 mx-auto mb-3 text-zinc-600 stroke-[1.5]" />
        <p className="text-base font-semibold text-zinc-200">조회된 박스오피스 정보가 없습니다.</p>
        <p className="text-xs text-zinc-500 mt-1">다른 날짜를 선택하거나 필터 조건을 변경해 보세요.</p>
      </div>
    );
  }

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
          <Sparkles className="w-2.5 h-2.5 text-fuchsia-400" />
          NEW
        </span>
      );
    }
    const inten = parseInt(item.rankInten, 10);
    if (isNaN(inten) || inten === 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-zinc-500">
          <Minus className="w-3 h-3 mr-0.5" /> 0
        </span>
      );
    }
    if (inten > 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-rose-400">
          <TrendingUp className="w-3 h-3 mr-0.5" /> +{inten}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-bold text-blue-400">
        <TrendingDown className="w-3 h-3 mr-0.5" /> {inten}
      </span>
    );
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case '1':
        return 'bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black shadow-lg shadow-amber-500/30 border border-amber-300';
      case '2':
        return 'bg-gradient-to-br from-slate-200 to-slate-400 text-zinc-950 font-black shadow-lg shadow-slate-400/20 border border-slate-100';
      case '3':
        return 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 font-black shadow-lg shadow-amber-900/30 border border-amber-600';
      default:
        return 'bg-zinc-800 text-zinc-300 font-bold border border-zinc-700';
    }
  };

  if (viewMode === 'table') {
    return (
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/80 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 text-center w-16">순위</th>
                <th className="py-3.5 px-3 text-center w-16">변동</th>
                <th className="py-3.5 px-4">영화명</th>
                <th className="py-3.5 px-4 text-center">개봉일</th>
                <th className="py-3.5 px-4 text-right">일일 관객수</th>
                <th className="py-3.5 px-4 text-right">누적 관객수</th>
                <th className="py-3.5 px-4 text-right">점유율</th>
                <th className="py-3.5 px-4 text-right">스크린 / 상영수</th>
                <th className="py-3.5 px-4 text-center w-24">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {items.map((item) => {
                const audiChangeNum = parseFloat(item.audiChange || '0');
                const salesShareNum = parseFloat(item.salesShare || '0');

                return (
                  <tr
                    key={item.movieCd}
                    onClick={() => onSelectMovie(item.movieCd)}
                    className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${getRankBadgeClass(
                          item.rank
                        )}`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Rank Change */}
                    <td className="py-3.5 px-3 text-center">{renderRankChange(item)}</td>

                    {/* Movie Title */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <span>{item.movieNm}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        코드: {item.movieCd}
                      </div>
                    </td>

                    {/* Open Date */}
                    <td className="py-3.5 px-4 text-center text-xs text-zinc-400">
                      {item.openDt || '-'}
                    </td>

                    {/* Daily Audience */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-amber-300">
                        {formatNumber(item.audiCnt)}명
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {audiChangeNum > 0 ? (
                          <span className="text-rose-400">▲ {audiChangeNum}%</span>
                        ) : audiChangeNum < 0 ? (
                          <span className="text-blue-400">▼ {Math.abs(audiChangeNum)}%</span>
                        ) : (
                          <span>- 0%</span>
                        )}
                      </div>
                    </td>

                    {/* Acc Audience */}
                    <td className="py-3.5 px-4 text-right font-medium text-zinc-200">
                      <div>{formatNumber(item.audiAcc)}명</div>
                      <div className="text-[11px] text-zinc-500">
                        {formatCurrency(item.salesAcc)}
                      </div>
                    </td>

                    {/* Sales Share */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-zinc-200">{salesShareNum.toFixed(1)}%</span>
                      <div className="w-16 ml-auto bg-zinc-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1 rounded-full"
                          style={{ width: `${Math.min(salesShareNum, 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Screens & Shows */}
                    <td className="py-3.5 px-4 text-right text-xs text-zinc-400">
                      <div>{formatNumber(item.scrnCnt)}관</div>
                      <div className="text-zinc-500">{formatNumber(item.showCnt)}회</div>
                    </td>

                    {/* Detail action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMovie(item.movieCd);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-xs font-medium text-zinc-300 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>보기</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Card View Mode
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {items.map((item) => {
        const audiChangeNum = parseFloat(item.audiChange || '0');
        const salesShareNum = parseFloat(item.salesShare || '0');

        return (
          <div
            key={item.movieCd}
            onClick={() => onSelectMovie(item.movieCd)}
            className="group relative bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Rank badge, rank shift, open date */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-sm ${getRankBadgeClass(
                      item.rank
                    )}`}
                  >
                    {item.rank}
                  </span>
                  <div>{renderRankChange(item)}</div>
                </div>

                {item.openDt && (
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-950/60 px-2 py-0.5 rounded-md border border-zinc-800/60">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>개봉 {item.openDt}</span>
                  </div>
                )}
              </div>

              {/* Movie Title */}
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
                {item.movieNm}
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                영화코드: {item.movieCd}
              </p>
            </div>

            {/* Metrics Section */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
              {/* Daily audience & Change */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-400" />
                    일일 관객수
                  </div>
                  <div className="text-lg font-black text-amber-300">
                    {formatNumber(item.audiCnt)}
                    <span className="text-xs font-normal text-zinc-400 ml-0.5">명</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400">누적 관객수</div>
                  <div className="text-sm font-bold text-zinc-200">
                    {formatNumber(item.audiAcc)}명
                  </div>
                </div>
              </div>

              {/* Progress bar for Sales Share */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-500">매출 점유율</span>
                  <span className="text-zinc-300 font-semibold">{salesShareNum.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full"
                    style={{ width: `${Math.min(salesShareNum, 100)}%` }}
                  />
                </div>
              </div>

              {/* Screens & Shows summary */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>
                  스크린 <strong className="text-zinc-200">{formatNumber(item.scrnCnt)}</strong>관 / 상영{' '}
                  <strong className="text-zinc-200">{formatNumber(item.showCnt)}</strong>회
                </span>
                <span className="text-zinc-500">{formatCurrency(item.salesAcc)}</span>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="mt-4 pt-3 border-t border-zinc-800/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMovie(item.movieCd);
                }}
                className="w-full py-2 px-3 rounded-xl bg-zinc-800/90 group-hover:bg-amber-500 group-hover:text-zinc-950 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>영화 상세정보 및 출연진</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
