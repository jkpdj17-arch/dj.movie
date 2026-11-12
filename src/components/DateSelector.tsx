import React from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table,
  RotateCcw,
  Search,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { addDays, formatDateToInput, getToday, getYesterday, parseInputDate } from '../utils/dateUtils';

export type SortOption = 'rank' | 'audiCnt' | 'audiAcc' | 'salesShare';

interface DateSelectorProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  multiMovieYn: string;
  onChangeMultiMovieYn: (val: string) => void;
  repNationCd: string;
  onChangeRepNationCd: (val: string) => void;
  viewMode: 'card' | 'table';
  onChangeViewMode: (mode: 'card' | 'table') => void;
  searchQuery: string;
  onChangeSearchQuery: (q: string) => void;
  sortBy: SortOption;
  onChangeSortBy: (sort: SortOption) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onChangeDate,
  multiMovieYn,
  onChangeMultiMovieYn,
  repNationCd,
  onChangeRepNationCd,
  viewMode,
  onChangeViewMode,
  searchQuery,
  onChangeSearchQuery,
  sortBy,
  onChangeSortBy,
  onRefresh,
  isLoading,
}) => {
  const today = getToday();
  const yesterday = getYesterday();
  const todayStr = formatDateToInput(today);
  const yesterdayStr = formatDateToInput(yesterday);
  const currentStr = formatDateToInput(selectedDate);

  const isMaxDate = currentStr >= todayStr;

  const handlePrevDay = () => {
    onChangeDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    if (!isMaxDate) {
      onChangeDate(addDays(selectedDate, 1));
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (val > todayStr) {
      onChangeDate(today);
    } else {
      onChangeDate(parseInputDate(val));
    }
  };

  const handlePreset = (daysAgo: number) => {
    if (daysAgo === 1) {
      onChangeDate(getYesterday());
    } else {
      const d = getToday();
      d.setDate(d.getDate() - daysAgo);
      onChangeDate(d);
    }
  };

  const handleYearAgo = () => {
    const d = new Date(selectedDate);
    d.setFullYear(d.getFullYear() - 1);
    onChangeDate(d);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4">
      {/* Row 1: Date Picker + Quick Presets + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={handlePrevDay}
              disabled={isLoading}
              title="이전 날짜로 이동"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="date"
                value={currentStr}
                max={todayStr}
                onChange={handleDateInputChange}
                disabled={isLoading}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer [color-scheme:dark] tabular-nums"
              />
            </div>

            <button
              onClick={handleNextDay}
              disabled={isMaxDate || isLoading}
              title={isMaxDate ? '오늘 이후 미래 날짜는 선택할 수 없습니다' : '다음 날짜로 이동'}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handlePreset(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentStr === yesterdayStr
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              어제 (최신)
            </button>
            <button
              onClick={() => handlePreset(2)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              그저께
            </button>
            <button
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              1주 전
            </button>
            <button
              onClick={() => handlePreset(30)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              1개월 전
            </button>
            <button
              onClick={handleYearAgo}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              1년 전
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-64 shrink-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="영화명 검색..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearchQuery('')}
              aria-label="검색어 지우기"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Filters, Sort, View Toggle */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium whitespace-nowrap">영화 구분</span>
            <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              {[
                { id: 'ALL', label: '전체' },
                { id: 'N', label: '상업' },
                { id: 'Y', label: '다양성' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeMultiMovieYn(opt.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    multiMovieYn === opt.id
                      ? 'bg-zinc-800 text-amber-400 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium whitespace-nowrap">국적</span>
            <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              {[
                { id: 'ALL', label: '전체' },
                { id: 'K', label: '한국' },
                { id: 'F', label: '외국' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeRepNationCd(opt.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    repNationCd === opt.id
                      ? 'bg-zinc-800 text-amber-400 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort + View Mode + Refresh */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="rank" className="bg-zinc-900">순위순</option>
              <option value="audiCnt" className="bg-zinc-900">일일 관객수순</option>
              <option value="audiAcc" className="bg-zinc-900">누적 관객수순</option>
              <option value="salesShare" className="bg-zinc-900">매출 점유율순</option>
            </select>
          </div>

          <div className="bg-zinc-950 p-0.5 border border-zinc-800 rounded-lg flex items-center">
            <button
              onClick={() => onChangeViewMode('card')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'card' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>카드형</span>
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>목록형</span>
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="새로고침"
            className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
