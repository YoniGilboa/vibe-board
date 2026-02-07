export type Priority = 'high' | 'medium' | 'low';

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export const PRIORITY_LABELS: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  column: 'todo' | 'in-progress' | 'complete';
  priority: Priority;
  createdAt: number;
  order: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface AppState {
  kanbanTasks: KanbanTask[];
  todos: TodoItem[];
  notes: string;
}

export type ColumnId = 'todo' | 'in-progress' | 'complete';

export const COLUMN_TITLES: Record<ColumnId, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'complete': 'Complete',
};
