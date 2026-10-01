/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { BoxOfficeHero } from './components/BoxOfficeHero';
import { BoxOfficeList } from './components/BoxOfficeList';
import { MovieDetailModal } from './components/MovieDetailModal';
import {
  formatDateToYYYYMMDD,
  formatKoreanDate,
  formatNumber,
  formatCurrency,
  getYesterday,
  getToday,
  isSameDate,
} from './utils/dateUtils';
import { BoxOfficeApiResponse, DailyBoxOfficeItem } from './types/boxoffice';
import {
  Film,
  AlertCircle,
  RefreshCw,
  Users,
  Coins,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => getYesterday());
  const [multiMovieYn, setMultiMovieYn] = useState<string>('ALL');
  const [repNationCd, setRepNationCd] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const [boxOfficeList, setBoxOfficeList] = useState<DailyBoxOfficeItem[]>([]);
  const [showRange, setShowRange] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected movie for detail modal
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);

  const today = getToday();
  const yesterday = getYesterday();
  const isSelectedToday = isSameDate(selectedDate, today);

  const fetchBoxOffice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDt = formatDateToYYYYMMDD(selectedDate);
      const params = new URLSearchParams({ targetDt });

      if (multiMovieYn !== 'ALL') {
        params.append('multiMovieYn', multiMovieYn);
      }
      if (repNationCd !== 'ALL') {
        params.append('repNationCd', repNationCd);
      }

      const res = await fetch(`/api/boxoffice?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`박스오피스 데이터를 불러오는데 실패했습니다. (${res.statusText})`);
      }

      const data: BoxOfficeApiResponse = await res.json();

      if (data.faultInfo) {
        throw new Error(data.faultInfo.message || 'KOBIS API 호출 오류가 발생했습니다.');
      }

      if (data.boxOfficeResult) {
        setBoxOfficeList(data.boxOfficeResult.dailyBoxOfficeList || []);
        setShowRange(data.boxOfficeResult.showRange || '');
      } else {
        setBoxOfficeList([]);
      }
    } catch (err: any) {
      console.error('박스오피스 로딩 에러:', err);
      setError(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
      setBoxOfficeList([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, multiMovieYn, repNationCd]);

  useEffect(() => {
    fetchBoxOffice();
  }, [fetchBoxOffice]);

  // Aggregate statistics for the day
  const totalDailyAudi = boxOfficeList.reduce(
    (acc, cur) => acc + (parseInt(cur.audiCnt, 10) || 0),
    0
  );
  const totalDailySales = boxOfficeList.reduce(
    (acc, cur) => acc + (parseInt(cur.salesAmt, 10) || 0),
    0
  );
  const newMoviesCount = boxOfficeList.filter((item) => item.rankOldAndNew === 'NEW').length;

  const top1Movie = boxOfficeList.length > 0 ? boxOfficeList[0] : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Header */}
      <Header currentDateText={formatKoreanDate(selectedDate)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Date Selector & Filters */}
        <DateSelector
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          multiMovieYn={multiMovieYn}
          onChangeMultiMovieYn={setMultiMovieYn}
          repNationCd={repNationCd}
          onChangeRepNationCd={setRepNationCd}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onRefresh={fetchBoxOffice}
          isLoading={isLoading}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-zinc-800 rounded-full" />
              <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">
                {formatKoreanDate(selectedDate)} 박스오피스 조회 중...
              </p>
              <p className="text-xs text-zinc-500 mt-1">영화진흥위원회 전산망에서 데이터를 수신하고 있습니다.</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {!isLoading && error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-base">데이터 조회 오류</h4>
                <p className="text-xs text-rose-300/90 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchBoxOffice}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 시도</span>
            </button>
          </div>
        )}

        {/* Today's in-progress compilation notice (if today is selected and data is empty) */}
        {!isLoading && !error && isSelectedToday && boxOfficeList.length === 0 && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                오늘({formatKoreanDate(today)}) 박스오피스 집계 진행 중
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                영화진흥위원회(KOBIS) 일일 박스오피스는 전국 영화관의 당일 상영 종료 후 정산되므로, 공식 확정 순위는 익일(내일) 새벽에 반영됩니다.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedDate(yesterday)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>최신 집계 완료된 어제({formatKoreanDate(yesterday)}) 박스오피스 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content Loaded */}
        {!isLoading && !error && boxOfficeList.length > 0 && (
          <>
            {/* Quick Summary Chips */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">상위 10개작 일일 관객수</div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {formatNumber(totalDailyAudi)}
                    <span className="text-xs font-normal text-zinc-400 ml-0.5">명</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">상위 10개작 일일 매출액</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-300">
                    {formatCurrency(totalDailySales)}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">신규 순위권 진입</div>
                  <div className="text-base sm:text-lg font-bold text-fuchsia-300">
                    {newMoviesCount}
                    <span className="text-xs font-normal text-zinc-400 ml-0.5">편</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-rose-400" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-zinc-400 font-medium">1위 점유율</div>
                  <div className="text-base sm:text-lg font-bold text-white truncate">
                    {top1Movie?.salesShare || 0}%
                    <span className="text-xs font-normal text-zinc-400 ml-1 truncate">
                      ({top1Movie?.movieNm})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank #1 Movie Spotlight */}
            {top1Movie && (
              <BoxOfficeHero
                movie={top1Movie}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            )}

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>일일 박스오피스 순위</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {boxOfficeList.length}편 집계
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  집계 기간: {showRange || formatDateToYYYYMMDD(selectedDate)} • 카드를 클릭하면 영화 상세정보와 출연진을 확인할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>KOBIS 실시간 연동</span>
              </div>
            </div>

            {/* Ranking List (Cards or Table) */}
            <BoxOfficeList
              items={boxOfficeList}
              viewMode={viewMode}
              onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
            />
          </>
        )}

        {/* Empty list for dates other than today */}
        {!isLoading && !error && !isSelectedToday && boxOfficeList.length === 0 && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400 space-y-3">
            <Film className="w-12 h-12 mx-auto text-zinc-600 stroke-[1.5]" />
            <h4 className="text-base font-semibold text-zinc-200">
              {formatKoreanDate(selectedDate)}에 조회된 박스오피스 데이터가 없습니다.
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              상업/다양성 또는 국적 필터 조건이 걸려있는지 확인하시거나, 다른 날짜를 선택해 보세요.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMultiMovieYn('ALL');
                  setRepNationCd('ALL');
                  setSelectedDate(yesterday);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                필터 초기화 및 어제 박스오피스 조회
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movieCd={selectedMovieCd}
        onClose={() => setSelectedMovieCd(null)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <Film className="w-4 h-4 text-amber-500" />
            <span>본 서비스는 영화진흥위원회(KOBIS) 오픈API를 활용하여 제공됩니다.</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              API 키 보안 환경변수 처리
            </span>
            <span>•</span>
            <span>오늘 및 오늘 이전(과거) 일별 데이터 제공</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
