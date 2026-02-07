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
    <div className="bg-[#111] border border-white/5 rounded-lg p-4">
      <h3 className="text-sm font-medium text-white/70 mb-3">Quick Tasks</h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20"
        />
        <button
          onClick={handleAdd}
          disabled={!newTodo.trim()}
          className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:text-white/30 rounded-lg transition-colors"
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
        {completedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
        {todos.length === 0 && (
          <p className="text-xs text-white/30 py-2 text-center">No tasks yet</p>
        )}
      </div>
    </div>
  );
}
