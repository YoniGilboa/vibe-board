'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'vibe-board-notes';
const DEBOUNCE_MS = 500;

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<string>(STORAGE_KEY, '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateNotes = useCallback((text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setNotes(text);
    }, DEBOUNCE_MS);
  }, [setNotes]);

  const setNotesImmediate = useCallback((text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotes(text);
  }, [setNotes]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    notes,
    updateNotes,
    setNotesImmediate,
  };
}
