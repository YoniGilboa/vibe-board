'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Pencil } from 'lucide-react';
import { KanbanTask, PRIORITY_LABELS } from '@/types';

function formatCreatedAt(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(date);
}

function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function isDueUrgent(dueDate: number): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dueDayStart = new Date(new Date(dueDate).getFullYear(), new Date(dueDate).getMonth(), new Date(dueDate).getDate()).getTime();
  return dueDayStart <= today;
}

interface KanbanCardProps {
  task: KanbanTask;
  onDelete: (id: string) => void;
  onEdit: (task: KanbanTask) => void;
  columnColor?: string;
}

export function KanbanCard({ task, onDelete, onEdit, columnColor }: KanbanCardProps) {
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

      {/* Action buttons - absolute so they don't eat layout space */}
      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onEdit(task)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-amber)]"
          aria-label="Edit task"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--danger)]"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex items-start gap-2 pl-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1.5 -ml-1.5 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={14} />
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
          <div className="flex items-center flex-nowrap gap-1.5 mt-2">
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ backgroundColor: `var(--priority-${task.priority ?? 'medium'})` }}
            />
            <span
              className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
              style={{ color: `var(--priority-${task.priority ?? 'medium'})` }}
            >
              {PRIORITY_LABELS[task.priority ?? 'medium']}
            </span>
            <span className="text-[var(--text-muted)] text-[10px] flex-shrink-0">·</span>
            <span className="text-[10px] font-mono text-[var(--accent-amber)] whitespace-nowrap">
              {formatCreatedAt(task.createdAt)}
            </span>
            {task.dueDate && (
              <>
                <span className="text-[var(--text-muted)] text-[10px] flex-shrink-0">·</span>
                <span
                  className="text-[10px] font-mono whitespace-nowrap"
                  style={{ color: isDueUrgent(task.dueDate) ? 'var(--danger)' : 'var(--text-tertiary)' }}
                >
                  Due {formatDueDate(task.dueDate)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
