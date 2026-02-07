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
    <div className="bg-[#111] border border-white/5 rounded-lg p-4 flex-1 flex flex-col">
      <h3 className="text-sm font-medium text-white/70 mb-3">Notes</h3>
      <textarea
        value={localNotes}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write notes here..."
        className="flex-1 min-h-[150px] bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
      />
    </div>
  );
}
