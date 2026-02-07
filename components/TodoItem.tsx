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
    <div className="flex items-center gap-2 group py-1.5">
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
          ${todo.completed
            ? 'bg-slate-600 border-slate-600 text-white'
            : 'border-white/20 hover:border-white/40'
          }
        `}
      >
        {todo.completed && <Check size={12} />}
      </button>
      <span
        className={`
          flex-1 text-sm break-words
          ${todo.completed ? 'text-white/40 line-through' : 'text-white/80'}
        `}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1 text-white/20 hover:text-red-400/80 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete todo"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
