'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ColumnId, COLUMN_TITLES, Priority, PRIORITY_LABELS } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  column: ColumnId;
  onClose: () => void;
  onAdd: (title: string, description: string, column: ColumnId, priority: Priority) => void;
}

export function AddTaskModal({ isOpen, column, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
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
      onAdd(title.trim(), description.trim(), column, priority);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl geo-corner animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-0.5">
              new task
            </p>
            <h2 className="text-base font-medium text-[var(--text-primary)]">
              Add to {COLUMN_TITLES[column]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded-md hover:bg-[var(--bg-surface)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Title
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-colors"
                placeholder="What needs to be done?"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Description <span className="text-[var(--text-muted)] normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] resize-none transition-colors"
                placeholder="Add more details..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Priority
              </label>
              <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg p-1">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                    style={{
                      backgroundColor: priority === p ? `var(--priority-${p}-dim)` : 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: priority === p ? `var(--priority-${p})` : 'transparent',
                      color: priority === p ? `var(--priority-${p})` : 'var(--text-muted)',
                    }}
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: `var(--priority-${p})` }}
                    />
                    {PRIORITY_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-sm font-medium rounded-lg transition-all btn-press"
              style={{
                backgroundColor: title.trim() ? 'var(--accent-amber)' : 'var(--bg-surface)',
                color: title.trim() ? 'var(--bg-deep)' : 'var(--text-muted)',
                opacity: title.trim() ? 1 : 0.6,
              }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
