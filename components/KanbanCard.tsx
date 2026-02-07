'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { KanbanTask } from '@/types';

interface KanbanCardProps {
  task: KanbanTask;
  onDelete: (id: string) => void;
}

export function KanbanCard({ task, onDelete }: KanbanCardProps) {
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
        bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mb-2
        group cursor-default
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -ml-1 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60"
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white/90 break-words">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2 break-words">
              {task.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-white/20 hover:text-red-400/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
