'use client';

import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const incompleteTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 geo-corner">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)] opacity-50" />
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Quick Tasks
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {incompleteTodos.length}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newTodo.trim()}
          className="p-2 rounded-lg transition-all btn-press"
          style={{
            backgroundColor: newTodo.trim() ? 'var(--accent-amber)' : 'var(--bg-card)',
            color: newTodo.trim() ? 'var(--bg-deep)' : 'var(--text-muted)',
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-0.5 max-h-[200px] overflow-y-auto">
        {incompleteTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
        {completedTodos.length > 0 && incompleteTodos.length > 0 && (
          <div className="h-px bg-[var(--border-subtle)] my-2" />
        )}
        {completedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
        {todos.length === 0 && (
          <p className="text-[11px] text-[var(--text-muted)] py-3 text-center italic">
            No tasks yet
          </p>
        )}
      </div>
    </div>
  );
}
