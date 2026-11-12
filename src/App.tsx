/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header, NavSection } from './components/Header';
import { DateSelector, SortOption } from './components/DateSelector';
import { BoxOfficeHero } from './components/BoxOfficeHero';
import { BoxOfficeStats } from './components/BoxOfficeStats';
import { BoxOfficeList } from './components/BoxOfficeList';
import { MovieDetailModal } from './components/MovieDetailModal';
import { Footer } from './components/Footer';
import {
  formatDateToYYYYMMDD,
  formatKoreanDate,
  getYesterday,
  getToday,
  isSameDate,
} from './utils/dateUtils';
import { BoxOfficeApiResponse, DailyBoxOfficeItem } from './types/boxoffice';
import {
  Film,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

const BOOKMARKS_STORAGE_KEY = 'cine_kobis_bookmarks_v1';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('boxoffice');
  const [selectedDate, setSelectedDate] = useState<Date>(() => getYesterday());
  const [multiMovieYn, setMultiMovieYn] = useState<string>('ALL');
  const [repNationCd, setRepNationCd] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');

  const [boxOfficeList, setBoxOfficeList] = useState<DailyBoxOfficeItem[]>([]);
  const [showRange, setShowRange] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);

  // Bookmarks persisted in localStorage
  const [bookmarks, setBookmarks] = useState<DailyBoxOfficeItem[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.movieCd)),
    [bookmarks]
  );

  const handleToggleBookmark = useCallback((movie: DailyBoxOfficeItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.movieCd === movie.movieCd);
      if (exists) {
        return prev.filter((item) => item.movieCd !== movie.movieCd);
      }
      return [movie, ...prev];
    });
  }, []);

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

  const handleJumpToLatest = useCallback(() => {
    setSelectedDate(getYesterday());
    setActiveSection('boxoffice');
  }, []);

  // Filter & Sort Box Office List
  const filteredAndSortedList = useMemo(() => {
    let list = [...boxOfficeList];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => item.movieNm.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'audiCnt':
          return (parseInt(b.audiCnt, 10) || 0) - (parseInt(a.audiCnt, 10) || 0);
        case 'audiAcc':
          return (parseInt(b.audiAcc, 10) || 0) - (parseInt(a.audiAcc, 10) || 0);
        case 'salesShare':
          return (parseFloat(b.salesShare) || 0) - (parseFloat(a.salesShare) || 0);
        case 'rank':
        default:
          return (parseInt(a.rank, 10) || 0) - (parseInt(b.rank, 10) || 0);
      }
    });

    return list;
  }, [boxOfficeList, searchQuery, sortBy]);

  const top1Movie = boxOfficeList.length > 0 ? boxOfficeList[0] : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      <Header
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        bookmarkCount={bookmarks.length}
        onJumpToLatest={handleJumpToLatest}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Bookmarks Section */}
        {activeSection === 'bookmarks' ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">내 관심 영화 찜 목록</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  저장한 영화 {bookmarks.length}편 · 영화를 클릭하면 상세정보를 확인할 수 있습니다.
                </p>
              </div>
            </div>

            {bookmarks.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center space-y-3">
                <Bookmark className="w-10 h-10 mx-auto text-zinc-600 stroke-[1.5]" />
                <h3 className="text-base font-semibold text-zinc-200">찜한 영화가 없습니다</h3>
                <p className="text-xs text-zinc-500">
                  박스오피스 목록에서 관심 있는 영화의 북마크 아이콘을 눌러 저장해 보세요.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveSection('boxoffice')}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    박스오피스 보러가기
                  </button>
                </div>
              </div>
            ) : (
              <BoxOfficeList
                items={bookmarks}
                viewMode={viewMode}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            )}
          </section>
        ) : (
          <>
            {/* Wide Cinematic Hero Banner (shown on Box Office tab when #1 exists) */}
            {activeSection === 'boxoffice' && !isLoading && !error && top1Movie && (
              <BoxOfficeHero
                movie={top1Movie}
                dateLabel={formatKoreanDate(selectedDate)}
                isBookmarked={bookmarkedIds.has(top1Movie.movieCd)}
                onToggleBookmark={handleToggleBookmark}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            )}

            {/* Date Selector, Search, Sort & Filters */}
            <DateSelector
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              multiMovieYn={multiMovieYn}
              onChangeMultiMovieYn={setMultiMovieYn}
              repNationCd={repNationCd}
              onChangeRepNationCd={setRepNationCd}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              onRefresh={fetchBoxOffice}
              isLoading={isLoading}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="font-semibold text-white">
                    {formatKoreanDate(selectedDate)} 박스오피스 조회 중
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    영화진흥위원회 전산망에서 데이터를 수신하고 있습니다.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-base">데이터 조회 오류</h4>
                    <p className="text-xs text-rose-300/90 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={fetchBoxOffice}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>다시 시도</span>
                </button>
              </div>
            )}

            {/* Today's in-progress compilation notice */}
            {!isLoading && !error && isSelectedToday && boxOfficeList.length === 0 && (
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="max-w-lg mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    오늘({formatKoreanDate(today)}) 박스오피스 집계 진행 중
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    일일 박스오피스는 전국 영화관의 당일 상영 종료 후 정산되므로, 공식 확정 순위는 익일 새벽에 반영됩니다.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedDate(yesterday)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors cursor-pointer"
                  >
                    <span>어제({formatKoreanDate(yesterday)}) 박스오피스 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Stats Section */}
            {!isLoading && !error && boxOfficeList.length > 0 && (
              <BoxOfficeStats
                items={boxOfficeList}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            )}

            {/* Box Office Ranking List */}
            {activeSection === 'boxoffice' && !isLoading && !error && boxOfficeList.length > 0 && (
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      일일 박스오피스 순위
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5 tabular-nums">
                      집계 기간: {showRange || formatDateToYYYYMMDD(selectedDate)} · 총 {filteredAndSortedList.length}편
                    </p>
                  </div>
                </div>

                <BoxOfficeList
                  items={filteredAndSortedList}
                  viewMode={viewMode}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
                />
              </section>
            )}

            {/* Empty list for past dates */}
            {!isLoading && !error && !isSelectedToday && boxOfficeList.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400 space-y-3">
                <Film className="w-10 h-10 mx-auto text-zinc-600 stroke-[1.5]" />
                <h4 className="text-base font-semibold text-zinc-200">
                  {formatKoreanDate(selectedDate)}에 조회된 박스오피스 데이터가 없습니다.
                </h4>
                <p className="text-xs text-zinc-500">
                  필터 조건을 초기화하거나 다른 날짜를 선택해 보세요.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMultiMovieYn('ALL');
                      setRepNationCd('ALL');
                      setSelectedDate(yesterday);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    필터 초기화 및 어제 박스오피스 조회
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <MovieDetailModal
        movieCd={selectedMovieCd}
        onClose={() => setSelectedMovieCd(null)}
      />

      <Footer
        onSelectSection={setActiveSection}
        onJumpToLatest={handleJumpToLatest}
      />
    </div>
  );
}
