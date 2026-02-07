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

export function KanbanColumn({ id, tasks, onDeleteTask, onAddClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[200px] max-w-[320px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-medium text-white/70">
          {COLUMN_TITLES[id]}
          <span className="ml-2 text-white/30">{tasks.length}</span>
        </h3>
      </div>
      <div
        ref={setNodeRef}
        className={`
          min-h-[200px] p-2 rounded-lg border border-white/5
          transition-colors
          ${isOver ? 'bg-white/5 border-white/10' : 'bg-[#111]'}
        `}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        {id !== 'complete' && (
          <button
            onClick={onAddClick}
            className="w-full py-2 px-3 mt-1 text-sm text-white/40 hover:text-white/60 hover:bg-white/5 rounded-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Plus size={14} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
