import React from 'react';
import { NavSection } from './Header';

interface FooterProps {
  onSelectSection: (section: NavSection) => void;
  onJumpToLatest: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, onJumpToLatest }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-zinc-900">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="text-lg font-extrabold tracking-tight text-white">CINE KOBIS</div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              영화진흥위원회(KOBIS) 영화관입장권통합전산망 공식 OpenAPI를 기반으로 일일 박스오피스 순위와 영화 상세정보를 제공하는 시네마 데이터 매거진입니다.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-300">서비스 메뉴</div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onSelectSection('boxoffice')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  일일 박스오피스 순위
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('stats')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  매출 점유율 통계
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('bookmarks')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  내 관심 영화 찜 목록
                </button>
              </li>
              <li>
                <button
                  onClick={onJumpToLatest}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  최신 집계 바로가기
                </button>
              </li>
            </ul>
          </div>

          {/* Data & Policy Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-300">데이터 출처 및 안내</div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>데이터 제공: 영화진흥위원회 통합전산망 (KOBIS)</li>
              <li>집계 기준: 당일 상영 종료 후 익일 새벽 공식 반영</li>
              <li>조회 가능 범위: 오늘 및 오늘 이전 과거 모든 날짜</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© 2026 CINE KOBIS. All rights reserved.</span>
          <span>KOBIS OpenAPI Proxy Secured</span>
        </div>
      </div>
    </footer>
  );
};
