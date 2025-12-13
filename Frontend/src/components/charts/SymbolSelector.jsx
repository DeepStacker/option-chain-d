import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Premium Symbol Selector - Searchable dropdown with categories
 * Features: Search, Indices/Equities grouping, keyboard navigation, glassmorphism
 */
const SymbolSelector = ({ symbols, currentSymbol, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Group symbols by type
  const groupedSymbols = useMemo(() => {
    const indices = [];
    const equities = [];
    
    symbols.forEach(s => {
      // Check if symbol name contains index-like patterns or is known index
      const isIndex = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX', 'BANKEX', 'NIFTYNXT50'].includes(s.symbol);
      if (isIndex) {
        indices.push(s);
      } else {
        equities.push(s);
      }
    });
    
    return { indices, equities };
  }, [symbols]);

  // Filter symbols based on search
  const filteredGroups = useMemo(() => {
    const query = search.toLowerCase();
    return {
      indices: groupedSymbols.indices.filter(s => 
        s.symbol.toLowerCase().includes(query) || 
        (s.name || '').toLowerCase().includes(query)
      ),
      equities: groupedSymbols.equities.filter(s => 
        s.symbol.toLowerCase().includes(query) || 
        (s.name || '').toLowerCase().includes(query)
      ),
    };
  }, [groupedSymbols, search]);

  // Flat list for keyboard navigation
  const flatList = useMemo(() => [
    ...filteredGroups.indices,
    ...filteredGroups.equities,
  ], [filteredGroups]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
        break;
      case 'Enter':
        if (flatList[highlightedIndex]) {
          onSelect(flatList[highlightedIndex]);
          setIsOpen(false);
          setSearch('');
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
      default:
        break;
    }
  };

  const handleSelect = (symbol) => {
    onSelect(symbol);
    setIsOpen(false);
    setSearch('');
  };

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm
          font-semibold text-sm transition-all duration-200 min-w-[160px]
          ${isDark 
            ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700/80 hover:border-slate-600' 
            : 'bg-white/80 border-gray-200 text-gray-900 hover:bg-gray-50/80 hover:border-gray-300'}
          ${isOpen ? (isDark ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-400/50') : ''}
          backdrop-blur-sm
        `}
      >
        {/* Icon */}
        <span className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {groupedSymbols.indices.some(s => s.symbol === currentSymbol?.symbol) ? '📈' : '🏢'}
        </span>
        
        {/* Symbol Name */}
        <span className="font-bold tracking-wide">{currentSymbol?.symbol || 'Select'}</span>
        
        {/* Chevron */}
        <svg 
          className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={`
            absolute top-full left-0 mt-2 w-72 max-h-96 rounded-xl border shadow-2xl z-50
            overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200
            ${isDark 
              ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl' 
              : 'bg-white/95 border-gray-200 backdrop-blur-xl'}
          `}
        >
          {/* Search Input */}
          <div className={`p-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
            <div className="relative">
              <svg 
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search symbols..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlightedIndex(0); }}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg text-sm
                  focus:outline-none focus:ring-2 transition-all
                  ${isDark 
                    ? 'bg-slate-800 text-white placeholder-gray-500 focus:ring-blue-500/50' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-blue-400/50'}
                `}
              />
            </div>
          </div>

          {/* Symbol List */}
          <div className="overflow-y-auto max-h-72 p-2">
            {/* Indices Section */}
            {filteredGroups.indices.length > 0 && (
              <div className="mb-2">
                <div className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  📊 Indices
                </div>
                {filteredGroups.indices.map((s, idx) => (
                  <SymbolItem 
                    key={s.symbol} 
                    symbol={s} 
                    isSelected={currentSymbol?.symbol === s.symbol}
                    isHighlighted={highlightedIndex === idx}
                    onClick={() => handleSelect(s)}
                    isDark={isDark}
                    icon="📈"
                  />
                ))}
              </div>
            )}

            {/* Equities Section */}
            {filteredGroups.equities.length > 0 && (
              <div>
                <div className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  🏢 Equities
                </div>
                {filteredGroups.equities.map((s, idx) => (
                  <SymbolItem 
                    key={s.symbol} 
                    symbol={s} 
                    isSelected={currentSymbol?.symbol === s.symbol}
                    isHighlighted={highlightedIndex === (filteredGroups.indices.length + idx)}
                    onClick={() => handleSelect(s)}
                    isDark={isDark}
                    icon="🏢"
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {flatList.length === 0 && (
              <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No symbols found for "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual Symbol Item
 */
const SymbolItem = ({ symbol, isSelected, isHighlighted, onClick, isDark, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
        transition-all duration-150
        ${isSelected 
          ? (isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-700')
          : isHighlighted 
            ? (isDark ? 'bg-slate-700/50' : 'bg-gray-100')
            : (isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50')
        }
      `}
    >
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {symbol.symbol}
        </div>
        {symbol.name && symbol.name !== symbol.symbol && (
          <div className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {symbol.name}
          </div>
        )}
      </div>
      {isSelected && (
        <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default SymbolSelector;
