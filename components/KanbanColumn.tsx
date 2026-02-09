'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Circle, Clock } from 'lucide-react';
import { KanbanTask, ColumnId, COLUMN_TITLES } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: ColumnId;
  tasks: KanbanTask[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: KanbanTask) => void;
  onAddClick: () => void;
}

const COLUMN_COLORS: Record<ColumnId, string> = {
  'todo': 'var(--col-todo)',
  'in-progress': 'var(--col-progress)',
};

const COLUMN_ICONS: Record<ColumnId, string> = {
  'todo': '\u25CB',
  'in-progress': '\u25D4',
};

const EMPTY_STATES: Record<ColumnId, { icon: typeof Circle; message: string }> = {
  'todo': { icon: Circle, message: 'No tasks yet \u2014 add one below' },
  'in-progress': { icon: Clock, message: 'Move tasks here to start working' },
};

export function KanbanColumn({ id, tasks, onDeleteTask, onEditTask, onAddClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const color = COLUMN_COLORS[id];
  const emptyState = EMPTY_STATES[id];

  return (
    <div className="flex-1 min-w-[280px] max-w-[500px]">
      {/* Column header */}
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <span
          className="text-xs"
          style={{ color }}
        >
          {COLUMN_ICONS[id]}
        </span>
        <h3
          className="text-sm font-bold uppercase tracking-[0.1em]"
          style={{ color }}
        >
          {COLUMN_TITLES[id]}
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{tasks.length}</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="relative min-h-[200px] p-2.5 rounded-lg border transition-all duration-200"
        style={{
          backgroundColor: isOver ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
          borderColor: isOver ? color : 'var(--border-default)',
          boxShadow: isOver ? `0 0 20px ${color}10` : '0 1px 4px rgba(0,0,0,0.2)',
        }}
      >
        {/* Top indicator bar */}
        <div
          className="col-indicator"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.7 }}
        />

        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} columnColor={color} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-20 gap-1.5">
            <emptyState.icon size={16} className="text-[var(--text-muted)]" style={{ opacity: 0.5 }} />
            <span className="text-[11px] text-[var(--text-tertiary)] italic">
              {emptyState.message}
            </span>
          </div>
        )}

        <button
          onClick={onAddClick}
          className="w-full py-2 px-3 mt-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-md flex items-center justify-center gap-1.5 transition-colors btn-press"
        >
          <Plus size={13} />
          Add task
        </button>
      </div>
    </div>
  );
}
