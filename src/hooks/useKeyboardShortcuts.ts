import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onOpenCommandPalette?: () => void;
  onOpenAi?: () => void;
  onOpenStudentModal?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onOpenCommandPalette,
  onEscape
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandPalette?.();
      } else if (e.key === '/') {
        e.preventDefault();
        onOpenCommandPalette?.();
      } else if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette, onEscape]);
}
