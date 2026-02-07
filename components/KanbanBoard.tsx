'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useKanban } from '@/hooks/useKanban';
import { ColumnId, KanbanTask } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { AddTaskModal } from './AddTaskModal';

const COLUMNS: ColumnId[] = ['todo', 'in-progress', 'complete'];

export function KanbanBoard() {
  const { tasks, addTask, deleteTask, moveTask, getTasksByColumn } = useKanban();
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState<ColumnId>('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    if (COLUMNS.includes(overId as ColumnId)) {
      if (activeTask.column !== overId) {
        const targetTasks = getTasksByColumn(overId as ColumnId);
        moveTask(activeTask.id, overId as ColumnId, targetTasks.length);
      }
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (!overTask) return;

    if (activeTask.column !== overTask.column) {
      const targetTasks = getTasksByColumn(overTask.column);
      const overIndex = targetTasks.findIndex(t => t.id === overId);
      moveTask(activeTask.id, overTask.column, overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    if (COLUMNS.includes(overId as ColumnId)) {
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.column === overTask.column && activeTask.id !== overTask.id) {
      const columnTasks = getTasksByColumn(activeTask.column);
      const oldIndex = columnTasks.findIndex(t => t.id === active.id);
      const newIndex = columnTasks.findIndex(t => t.id === over.id);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex);
        reordered.forEach((task, idx) => {
          moveTask(task.id, task.column, idx);
        });
      }
    }
  };

  const openAddModal = (column: ColumnId) => {
    setModalColumn(column);
    setModalOpen(true);
  };

  return (
    <div className="flex-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-4">
          {COLUMNS.map(columnId => (
            <KanbanColumn
              key={columnId}
              id={columnId}
              tasks={getTasksByColumn(columnId)}
              onDeleteTask={deleteTask}
              onAddClick={() => openAddModal(columnId)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-[2deg] scale-105">
              <KanbanCard task={activeTask} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <AddTaskModal
        isOpen={modalOpen}
        column={modalColumn}
        onClose={() => setModalOpen(false)}
        onAdd={addTask}
      />
    </div>
  );
}
