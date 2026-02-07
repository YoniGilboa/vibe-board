export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  column: 'todo' | 'in-progress' | 'complete';
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
