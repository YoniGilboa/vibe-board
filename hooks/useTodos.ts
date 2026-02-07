'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TodoItem } from '@/types';

const STORAGE_KEY = 'vibe-board-todos';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>(STORAGE_KEY, []);

  const addTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  const updateTodo = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  }, [setTodos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
}
