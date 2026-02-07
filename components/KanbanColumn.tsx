'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { KanbanTask, ColumnId, COLUMN_TITLES } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: ColumnId;
  tasks: KanbanTask[];
  onDeleteTask: (id: string) => void;
  onAddClick: () => void;
}

const COLUMN_COLORS: Record<ColumnId, string> = {
  'todo': 'var(--col-todo)',
  'in-progress': 'var(--col-progress)',
  'complete': 'var(--col-complete)',
};

const COLUMN_ICONS: Record<ColumnId, string> = {
  'todo': '\u25CB',
  'in-progress': '\u25D4',
  'complete': '\u25CF',
};

export function KanbanColumn({ id, tasks, onDeleteTask, onAddClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const color = COLUMN_COLORS[id];

  return (
    <div className="flex-1 min-w-[220px] max-w-[340px]">
      {/* Column header */}
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <span
          className="text-xs"
          style={{ color }}
        >
          {COLUMN_ICONS[id]}
        </span>
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          {COLUMN_TITLES[id]}
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">{tasks.length}</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="relative min-h-[200px] p-2.5 rounded-lg border transition-all duration-200"
        style={{
          backgroundColor: isOver ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          borderColor: isOver ? color : 'var(--border-subtle)',
          boxShadow: isOver ? `0 0 20px ${color}10` : 'none',
        }}
      >
        {/* Top indicator bar */}
        <div
          className="col-indicator"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.4 }}
        />

        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} onDelete={onDeleteTask} columnColor={color} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-[11px] text-[var(--text-muted)] italic">
            Drop tasks here
          </div>
        )}

        {id !== 'complete' && (
          <button
            onClick={onAddClick}
            className="w-full py-2 px-3 mt-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] rounded-md flex items-center justify-center gap-1.5 transition-colors btn-press"
          >
            <Plus size={13} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
