'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ColumnId, KanbanTask, Priority } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { AddTaskModal } from './AddTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { ConfirmDialog } from './ConfirmDialog';
import { PriorityFilter } from './PriorityFilter';

const COLUMNS: ColumnId[] = ['todo', 'in-progress', 'complete'];

interface KanbanBoardProps {
  tasks: KanbanTask[];
  addTask: (title: string, description: string, column: ColumnId, priority: Priority, dueDate?: number) => void;
  updateTask: (id: string, updates: Partial<Omit<KanbanTask, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, toColumn: ColumnId, newOrder: number) => void;
  getTasksByColumn: (column: ColumnId) => KanbanTask[];
}

export function KanbanBoard({ tasks, addTask, updateTask, deleteTask, moveTask, getTasksByColumn }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState<ColumnId>('todo');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<KanbanTask | null>(null);

  const getFilteredTasksByColumn = useCallback((column: ColumnId) => {
    const sorted = getTasksByColumn(column);
    if (priorityFilter === 'all') return sorted;
    return sorted.filter(t => (t.priority ?? 'medium') === priorityFilter);
  }, [getTasksByColumn, priorityFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
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
        const targetTasks = getFilteredTasksByColumn(overId as ColumnId);
        moveTask(activeTask.id, overId as ColumnId, targetTasks.length);
      }
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (!overTask) return;

    if (activeTask.column !== overTask.column) {
      const targetTasks = getFilteredTasksByColumn(overTask.column);
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
      const columnTasks = getFilteredTasksByColumn(activeTask.column);
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

  const handleDeleteRequest = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) setDeletingTask(task);
  };

  return (
    <div className="flex-1">
      <PriorityFilter value={priorityFilter} onChange={setPriorityFilter} tasks={tasks} />
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
              tasks={getFilteredTasksByColumn(columnId)}
              onDeleteTask={handleDeleteRequest}
              onEditTask={setEditingTask}
              onAddClick={() => openAddModal(columnId)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-[2deg] scale-105">
              <KanbanCard task={activeTask} onDelete={() => {}} onEdit={() => {}} />
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
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(id, updates) => updateTask(id, updates)}
      />
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) deleteTask(deletingTask.id);
        }}
        title="Delete task?"
        message={deletingTask ? `"${deletingTask.title}" will be permanently removed.` : ''}
      />
    </div>
  );
}
