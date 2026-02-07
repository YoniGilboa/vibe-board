'use client';

import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';

export function NotesPanel() {
  const { notes, updateNotes, setNotesImmediate } = useNotes();
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleChange = (value: string) => {
    setLocalNotes(value);
    updateNotes(value);
  };

  const handleBlur = () => {
    setNotesImmediate(localNotes);
  };

  return (
    <div className="relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex-1 flex flex-col geo-corner">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1.5 h-1.5 rounded-sm bg-[var(--col-progress)] opacity-50 rotate-45" />
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Notes
        </h3>
      </div>
      <textarea
        value={localNotes}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write notes here..."
        className="flex-1 min-h-[150px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-3 text-sm text-[var(--text-secondary)] resize-none transition-colors leading-relaxed"
      />
    </div>
  );
}
