import React from 'react';

export type NavSection = 'boxoffice' | 'stats' | 'bookmarks';

interface HeaderProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  bookmarkCount: number;
  onJumpToLatest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  bookmarkCount,
  onJumpToLatest,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          onClick={() => onSelectSection('boxoffice')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          CINE KOBIS
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectSection('boxoffice')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'boxoffice'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            박스오피스
          </button>
          <button
            onClick={() => onSelectSection('stats')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'stats'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            점유율 통계
          </button>
          <button
            onClick={() => onSelectSection('bookmarks')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'bookmarks'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            내 찜 목록 ({bookmarkCount})
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onJumpToLatest}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            최신 박스오피스
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-zinc-800/70 px-4 py-2 flex items-center justify-around text-xs font-medium bg-zinc-950">
        <button
          onClick={() => onSelectSection('boxoffice')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeSection === 'boxoffice' ? 'text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          박스오피스
        </button>
        <button
          onClick={() => onSelectSection('stats')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeSection === 'stats' ? 'text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          점유율 통계
        </button>
        <button
          onClick={() => onSelectSection('bookmarks')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeSection === 'bookmarks' ? 'text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          내 찜 목록 ({bookmarkCount})
        </button>
      </div>
    </header>
  );
};
