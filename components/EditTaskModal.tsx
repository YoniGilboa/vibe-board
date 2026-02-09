'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { KanbanTask, Priority, PRIORITY_LABELS } from '@/types';

interface EditTaskModalProps {
  isOpen: boolean;
  task: KanbanTask | null;
  onClose: () => void;
  onSave: (id: string, updates: { title: string; description?: string; priority: Priority; dueDate?: number }) => void;
}

export function EditTaskModal({ isOpen, task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority ?? 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, task]);

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
    if (title.trim() && task) {
      onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate + 'T00:00:00').getTime() : undefined,
      });
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="flex min-h-full items-end sm:items-center justify-center p-4">
      <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl w-full max-w-md p-6 shadow-2xl geo-corner animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-0.5">
              modify
            </p>
            <h2 className="text-base font-medium text-[var(--text-primary)]">
              Edit Task
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
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Due Date <span className="text-[var(--text-muted)] normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-colors"
                style={{ colorScheme: 'dark' }}
              />
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
