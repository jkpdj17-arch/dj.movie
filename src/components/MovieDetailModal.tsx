import React, { useEffect, useState } from 'react';
import {
  X,
  Film,
  Calendar,
  Clock,
  Globe,
  Award,
  Users,
  Building2,
  ExternalLink,
  Clapperboard,
  Layers,
  AlertCircle
} from 'lucide-react';
import { MovieInfo, MovieInfoApiResponse } from '../types/boxoffice';

interface MovieDetailModalProps {
  movieCd: string | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movieCd, onClose }) => {
  const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieCd) {
      setMovieInfo(null);
      return;
    }

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/movie-info?movieCd=${encodeURIComponent(movieCd)}`);
        if (!response.ok) {
          throw new Error(`상세정보 조회 실패 (${response.statusText})`);
        }
        const data: MovieInfoApiResponse = await response.json();
        if (data.faultInfo) {
          throw new Error(data.faultInfo.message || '영화 정보를 찾을 수 없습니다.');
        }
        if (data.movieInfoResult?.movieInfo) {
          setMovieInfo(data.movieInfoResult.movieInfo);
        } else {
          throw new Error('영화 상세 정보가 비어있습니다.');
        }
      } catch (err: any) {
        console.error('Failed to fetch movie detail:', err);
        setError(err.message || '상세정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieCd]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movieCd) return null;

  const getWatchGradeBadge = (watchGradeNm?: string) => {
    if (!watchGradeNm) return null;
    let badgeColor = 'bg-zinc-700 text-zinc-200 border-zinc-600';
    if (watchGradeNm.includes('전체')) {
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    } else if (watchGradeNm.includes('12')) {
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else if (watchGradeNm.includes('15')) {
      badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    } else if (watchGradeNm.includes('청소년') || watchGradeNm.includes('18')) {
      badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    } else if (watchGradeNm.includes('제한')) {
      badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }

    return (
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeColor}`}
      >
        {watchGradeNm}
      </span>
    );
  };

  const primaryAudit = movieInfo?.audits?.[0]?.watchGradeNm;

  const naverSearchUrl = movieInfo
    ? `https://search.naver.com/search.naver?query=${encodeURIComponent('영화 ' + movieInfo.movieNm)}`
    : '#';
  const daumSearchUrl = movieInfo
    ? `https://search.daum.net/search?w=tot&q=${encodeURIComponent('영화 ' + movieInfo.movieNm)}`
    : '#';
  const youtubeSearchUrl = movieInfo
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent('영화 ' + movieInfo.movieNm + ' 예고편')}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-800 bg-zinc-950/60 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              영화 상세 정보 (KOBIS)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-zinc-400">영화 상세 정보를 불러오는 중입니다...</p>
            </div>
          )}

          {error && (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">상세 정보를 불러올 수 없습니다</p>
                <p className="text-xs text-rose-300/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && movieInfo && (
            <>
              {/* Title & Metadata Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {getWatchGradeBadge(primaryAudit)}
                  {movieInfo.prdtStatNm && (
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium">
                      {movieInfo.prdtStatNm}
                    </span>
                  )}
                  {movieInfo.typeNm && (
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium">
                      {movieInfo.typeNm}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 font-mono">
                    코드: {movieInfo.movieCd}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {movieInfo.movieNm}
                  </h2>
                  {movieInfo.movieNmEn && (
                    <p className="text-sm text-zinc-400 font-medium mt-0.5">
                      {movieInfo.movieNmEn}
                    </p>
                  )}
                </div>

                {/* Key Spec Badges */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                  {movieInfo.openDt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      개봉일: <strong className="text-white">{movieInfo.openDt}</strong>
                    </span>
                  )}
                  {movieInfo.showTm && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      러닝타임: <strong className="text-white">{movieInfo.showTm}분</strong>
                    </span>
                  )}
                  {movieInfo.prdtYear && (
                    <span className="flex items-center gap-1.5">
                      제작연도: <strong className="text-white">{movieInfo.prdtYear}년</strong>
                    </span>
                  )}
                  {movieInfo.nations && movieInfo.nations.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      국가: <strong className="text-white">{movieInfo.nations.map((n) => n.nationNm).join(', ')}</strong>
                    </span>
                  )}
                </div>

                {/* Genres */}
                {movieInfo.genres && movieInfo.genres.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs text-zinc-400 mr-1">장르:</span>
                    {movieInfo.genres.map((g, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-xs font-medium"
                      >
                        {g.genreNm}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Directors Section */}
              {movieInfo.directors && movieInfo.directors.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5" />
                    감독
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {movieInfo.directors.map((director, i) => (
                      <div key={i} className="text-sm font-semibold text-white">
                        {director.peopleNm}
                        {director.peopleNmEn && (
                          <span className="text-xs font-normal text-zinc-400 ml-1">
                            ({director.peopleNmEn})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast & Actors Section */}
              {movieInfo.actors && movieInfo.actors.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    출연진 ({movieInfo.actors.length}명)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {movieInfo.actors.map((actor, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex flex-col justify-center"
                      >
                        <span className="text-sm font-bold text-white truncate">
                          {actor.peopleNm}
                        </span>
                        {actor.cast && (
                          <span className="text-xs text-amber-400/90 truncate">
                            {actor.cast} 역
                          </span>
                        )}
                        {actor.peopleNmEn && !actor.cast && (
                          <span className="text-[11px] text-zinc-500 truncate">
                            {actor.peopleNmEn}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screening Types (IMAX, 2D, 4DX etc.) */}
              {movieInfo.showTypes && movieInfo.showTypes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    상영 포맷
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {movieInfo.showTypes.map((st, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium"
                      >
                        {st.showTypeGroupNm} {st.showTypeNm && `(${st.showTypeNm})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Section */}
              {movieInfo.companys && movieInfo.companys.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    참여 영화사
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {movieInfo.companys.slice(0, 6).map((comp, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between gap-2"
                      >
                        <span className="text-zinc-200 font-medium truncate">
                          {comp.companyNm}
                        </span>
                        <span className="text-zinc-500 text-[11px] shrink-0 px-1.5 py-0.5 rounded bg-zinc-800">
                          {comp.companyPartNm || '회사'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Search Shortcuts */}
              <div className="pt-2 border-t border-zinc-800">
                <div className="text-xs text-zinc-400 mb-2 font-medium">더 알아보기:</div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={naverSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>네이버 검색</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={daumSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>다음 검색</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={youtubeSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>유튜브 예고편</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-500">
          <span>제공: 영화진흥위원회 통합전산망</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
