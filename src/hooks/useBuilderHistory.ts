import { useState, useCallback } from 'react';
import { HistoryState, PageSection, NavbarSettings, FooterSettings } from '@/types/builder';

const MAX_HISTORY = 50;

export function useBuilderHistory(
  initialSections: PageSection[] = [],
  initialNavbar: NavbarSettings = { enabled: false },
  initialFooter: FooterSettings = {}
) {
  const [history, setHistory] = useState<HistoryState[]>([{
    sections: initialSections,
    navbar: initialNavbar,
    footer: initialFooter
  }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = useCallback((newState: HistoryState) => {
    setHistory(prev => {
      // Remove any "future" states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentIndex
  };
}
