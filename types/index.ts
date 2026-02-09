export type Priority = 'high' | 'medium' | 'low';

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export const PRIORITY_LABELS: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  column: 'todo' | 'in-progress';
  priority: Priority;
  createdAt: number;
  dueDate?: number;
  order: number;
}

export type ColumnId = 'todo' | 'in-progress';

export const COLUMN_TITLES: Record<ColumnId, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
};
