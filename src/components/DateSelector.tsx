import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, LayoutGrid, Table, RotateCcw, Clock } from 'lucide-react';
import { addDays, formatDateToInput, getToday, getYesterday, parseInputDate } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  multiMovieYn: string;
  onChangeMultiMovieYn: (val: string) => void;
  repNationCd: string;
  onChangeRepNationCd: (val: string) => void;
  viewMode: 'card' | 'table';
  onChangeViewMode: (mode: 'card' | 'table') => void;
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
  onRefresh,
  isLoading,
}) => {
  const today = getToday();
  const yesterday = getYesterday();
  const todayStr = formatDateToInput(today);
  const yesterdayStr = formatDateToInput(yesterday);
  const currentStr = formatDateToInput(selectedDate);

  // Maximum selectable date is today (no future dates)
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
    if (daysAgo === 0) {
      onChangeDate(getToday());
    } else if (daysAgo === 1) {
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
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Top row: Date navigation & shortcuts */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date picker controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrevDay}
              disabled={isLoading}
              title="이전 날짜로 이동 (1일 전)"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="date"
                value={currentStr}
                max={todayStr}
                onChange={handleDateInputChange}
                disabled={isLoading}
                title="오늘 및 이전 날짜를 선택할 수 있습니다"
                className="bg-transparent text-sm sm:text-base font-semibold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>

            <button
              onClick={handleNextDay}
              disabled={isMaxDate || isLoading}
              title={isMaxDate ? '오늘 이후 미래 날짜는 선택할 수 없습니다' : '다음 날짜로 이동'}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handlePreset(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentStr === yesterdayStr
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              어제 (최신 집계)
            </button>
            <button
              onClick={() => handlePreset(2)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              그저께 (2일 전)
            </button>
            <button
              onClick={() => handlePreset(3)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              3일 전
            </button>
            <button
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              1주 전
            </button>
            <button
              onClick={() => handlePreset(30)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              1개월 전
            </button>
            <button
              onClick={handleYearAgo}
              title="1년 전 같은 날짜"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              1년 전
            </button>
          </div>
        </div>

        {/* View toggle & Refresh */}
        <div className="flex items-center gap-2 justify-end">
          <div className="bg-zinc-950 p-1 border border-zinc-800 rounded-xl flex items-center">
            <button
              onClick={() => onChangeViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>카드형</span>
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
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
            className="p-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-medium text-zinc-400">영화 구분:</span>
            <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              <button
                onClick={() => onChangeMultiMovieYn('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  multiMovieYn === 'ALL' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => onChangeMultiMovieYn('N')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  multiMovieYn === 'N' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                상업영화
              </button>
              <button
                onClick={() => onChangeMultiMovieYn('Y')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  multiMovieYn === 'Y' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                다양성/예술영화
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400">국적 구분:</span>
            <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              <button
                onClick={() => onChangeRepNationCd('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  repNationCd === 'ALL' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => onChangeRepNationCd('K')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  repNationCd === 'K' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                한국영화
              </button>
              <button
                onClick={() => onChangeRepNationCd('F')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  repNationCd === 'F' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                외국영화
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>오늘 날짜 및 오늘 이전(과거) 날짜를 자유롭게 선택하여 조회할 수 있습니다.</span>
        </div>
      </div>
    </div>
  );
};
