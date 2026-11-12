import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
  Film,
  ArrowUpRight,
} from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/boxoffice';
import { formatCurrency, formatNumber } from '../utils/dateUtils';

interface BoxOfficeListProps {
  items: DailyBoxOfficeItem[];
  viewMode: 'card' | 'table';
  bookmarkedIds: Set<string>;
  onToggleBookmark: (movie: DailyBoxOfficeItem) => void;
  onSelectMovie: (movieCd: string) => void;
}

export const BoxOfficeList: React.FC<BoxOfficeListProps> = ({
  items,
  viewMode,
  bookmarkedIds,
  onToggleBookmark,
  onSelectMovie,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400">
        <Film className="w-10 h-10 mx-auto mb-3 text-zinc-600 stroke-[1.5]" />
        <p className="text-base font-semibold text-zinc-200">조건에 맞는 영화가 없습니다.</p>
        <p className="text-xs text-zinc-500 mt-1">검색어나 필터 조건을 변경해 보세요.</p>
      </div>
    );
  }

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return <span className="text-[11px] font-bold text-amber-400">NEW</span>;
    }
    const inten = parseInt(item.rankInten, 10);
    if (isNaN(inten) || inten === 0) {
      return (
        <span className="inline-flex items-center text-[11px] text-zinc-500 tabular-nums">
          <Minus className="w-3 h-3 mr-0.5" /> 0
        </span>
      );
    }
    if (inten > 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-rose-400 tabular-nums">
          <TrendingUp className="w-3 h-3 mr-0.5" /> +{inten}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-semibold text-sky-400 tabular-nums">
        <TrendingDown className="w-3 h-3 mr-0.5" /> {inten}
      </span>
    );
  };

  if (viewMode === 'table') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 text-xs font-semibold border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 text-center w-14">순위</th>
                <th className="py-3.5 px-3 text-center w-16">변동</th>
                <th className="py-3.5 px-4">영화명</th>
                <th className="py-3.5 px-4 text-center">개봉일</th>
                <th className="py-3.5 px-4 text-right">일일 관객수</th>
                <th className="py-3.5 px-4 text-right">누적 관객수</th>
                <th className="py-3.5 px-4 text-right">점유율</th>
                <th className="py-3.5 px-4 text-right">스크린 / 상영</th>
                <th className="py-3.5 px-4 text-center w-20">찜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {items.map((item) => {
                const audiChangeNum = parseFloat(item.audiChange || '0');
                const salesShareNum = parseFloat(item.salesShare || '0');
                const isBookmarked = bookmarkedIds.has(item.movieCd);

                return (
                  <tr
                    key={item.movieCd}
                    onClick={() => onSelectMovie(item.movieCd)}
                    className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center font-bold tabular-nums text-white">
                      <span className={item.rank === '1' ? 'text-amber-400' : ''}>{item.rank}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">{renderRankChange(item)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {item.movieNm}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        {item.movieCd}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-zinc-400 tabular-nums">
                      {item.openDt || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <div className="font-semibold text-white">{formatNumber(item.audiCnt)}명</div>
                      <div className="text-[11px] text-zinc-400">
                        {audiChangeNum > 0 ? (
                          <span className="text-rose-400">+{audiChangeNum}%</span>
                        ) : audiChangeNum < 0 ? (
                          <span className="text-sky-400">{audiChangeNum}%</span>
                        ) : (
                          <span>0%</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <div className="font-medium text-zinc-200">{formatNumber(item.audiAcc)}명</div>
                      <div className="text-[11px] text-zinc-500">{formatCurrency(item.salesAcc)}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span className="font-semibold text-amber-400">{salesShareNum.toFixed(1)}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-zinc-400 tabular-nums">
                      <div>{formatNumber(item.scrnCnt)}관</div>
                      <div className="text-zinc-500">{formatNumber(item.showCnt)}회</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(item);
                        }}
                        aria-label={isBookmarked ? '찜 해제' : '찜하기'}
                        className="p-2 rounded-lg hover:bg-zinc-700/60 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {items.map((item) => {
        const salesShareNum = parseFloat(item.salesShare || '0');
        const isBookmarked = bookmarkedIds.has(item.movieCd);

        return (
          <article
            key={item.movieCd}
            onClick={() => onSelectMovie(item.movieCd)}
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-colors cursor-pointer flex flex-col justify-between"
          >
            {/* Top: Rank + Clean Unboxed Metadata + Bookmark */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-extrabold text-base tabular-nums ${
                      item.rank === '1' ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {item.rank}위
                  </span>
                  <span aria-hidden="true" className="text-zinc-700">·</span>
                  {renderRankChange(item)}
                  {item.openDt && (
                    <>
                      <span aria-hidden="true" className="text-zinc-700">·</span>
                      <span className="text-zinc-400 tabular-nums">{item.openDt} 개봉</span>
                    </>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(item);
                  }}
                  aria-label={isBookmarked ? '찜 해제' : '찜하기'}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {item.movieNm}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 tabular-nums">
                스크린 {formatNumber(item.scrnCnt)}개관 · 상영 {formatNumber(item.showCnt)}회
              </p>
            </div>

            {/* Metrics */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-end justify-between tabular-nums">
                <div>
                  <div className="text-xs text-zinc-400">일일 관객수</div>
                  <div className="text-lg font-bold text-white">
                    {formatNumber(item.audiCnt)}
                    <span className="text-xs font-normal text-zinc-400 ml-0.5">명</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-400">누적 관객수</div>
                  <div className="text-sm font-semibold text-zinc-200">
                    {formatNumber(item.audiAcc)}명
                  </div>
                </div>
              </div>

              {/* Share Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs tabular-nums">
                  <span className="text-zinc-500">매출 점유율</span>
                  <span className="text-amber-400 font-semibold">{salesShareNum.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${Math.min(salesShareNum, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
              <span>상세정보 및 출연진</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </article>
        );
      })}
    </div>
  );
};
