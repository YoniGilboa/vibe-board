'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { KanbanTask } from '@/types';

interface KanbanCardProps {
  task: KanbanTask;
  onDelete: (id: string) => void;
  columnColor?: string;
}

export function KanbanCard({ task, onDelete, columnColor }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-lg p-3.5 mb-2
        group cursor-default card-hover shadow-[0_2px_6px_rgba(0,0,0,0.3)]
        ${isDragging ? 'drag-ghost shadow-xl border-[var(--accent-amber)]' : ''}
      `}
    >
      {/* Left color accent */}
      {columnColor && (
        <div
          className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
          style={{ backgroundColor: columnColor, opacity: 0.75 }}
        />
      )}

      <div className="flex items-start gap-2 pl-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-0.5 -ml-1 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <GripVertical size={13} />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-medium text-[var(--text-primary)] break-words leading-snug">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5 line-clamp-2 break-words leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
