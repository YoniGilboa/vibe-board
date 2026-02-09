'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { KanbanTask, ColumnId, Priority, PRIORITY_ORDER } from '@/types';

const STORAGE_KEY = 'vibe-board-kanban';

export function useKanban() {
  const [tasks, setTasks] = useLocalStorage<KanbanTask[]>(STORAGE_KEY, []);

  const addTask = useCallback((title: string, description: string, column: ColumnId, priority: Priority = 'medium', dueDate?: number) => {
    const tasksInColumn = tasks.filter(t => t.column === column);
    const maxOrder = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.order))
      : -1;

    const newTask: KanbanTask = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      title,
      description: description || undefined,
      column,
      priority,
      createdAt: Date.now(),
      dueDate,
      order: maxOrder + 1,
    };
    setTasks(prev => [...prev, newTask]);
  }, [tasks, setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<KanbanTask, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const moveTask = useCallback((taskId: string, toColumn: ColumnId, newOrder: number) => {
    setTasks(prev => {
      const taskToMove = prev.find(t => t.id === taskId);
      if (!taskToMove) return prev;

      const otherTasks = prev.filter(t => t.id !== taskId);
      const tasksInTargetColumn = otherTasks
        .filter(t => t.column === toColumn)
        .sort((a, b) => a.order - b.order);

      // Reorder tasks in target column
      const reorderedTarget = [
        ...tasksInTargetColumn.slice(0, newOrder),
        { ...taskToMove, column: toColumn, order: newOrder },
        ...tasksInTargetColumn.slice(newOrder),
      ].map((t, idx) => ({ ...t, order: idx }));

      // Combine with tasks from other columns
      const otherColumnTasks = otherTasks.filter(t => t.column !== toColumn);
      return [...otherColumnTasks, ...reorderedTarget];
    });
  }, [setTasks]);

  const getTasksByColumn = useCallback((column: ColumnId) => {
    return tasks
      .filter(task => task.column === column)
      .sort((a, b) => {
        const priorityDiff = PRIORITY_ORDER[a.priority ?? 'medium'] - PRIORITY_ORDER[b.priority ?? 'medium'];
        if (priorityDiff !== 0) return priorityDiff;
        return a.order - b.order;
      });
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn,
  };
}
