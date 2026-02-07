'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ColumnId, COLUMN_TITLES } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  column: ColumnId;
  onClose: () => void;
  onAdd: (title: string, description: string, column: ColumnId) => void;
}

export function AddTaskModal({ isOpen, column, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim(), column);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-lg w-full max-w-md mx-4 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-white/90">
            Add to {COLUMN_TITLES[column]}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Title</label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20"
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Description <span className="text-white/30">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
                placeholder="Add more details..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:text-white/30 text-white rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
