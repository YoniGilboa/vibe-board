'use client';

import { Check, Trash2 } from 'lucide-react';
import { TodoItem as TodoItemType } from '@/types';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2.5 group py-1.5 px-1 rounded-md hover:bg-[var(--bg-elevated)] transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all"
        style={{
          backgroundColor: todo.completed ? 'var(--accent-amber)' : 'transparent',
          borderColor: todo.completed ? 'var(--accent-amber)' : 'var(--text-muted)',
          color: todo.completed ? 'var(--bg-deep)' : 'transparent',
        }}
      >
        {todo.completed && <Check size={10} strokeWidth={3} />}
      </button>
      <span
        className="flex-1 text-sm break-words transition-colors"
        style={{
          color: todo.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
          textDecoration: todo.completed ? 'line-through' : 'none',
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1 text-[var(--text-muted)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Delete todo"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
