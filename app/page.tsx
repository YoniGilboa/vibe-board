'use client';

import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { NotesPanel } from '@/components/NotesPanel';

export default function Home() {
  return (
    <main className="relative min-h-screen p-5 md:p-8 z-[1]">
      {/* Header */}
      <header className="mb-8 animate-fade-up">
        <div className="flex items-end gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-muted)] mb-1">
              workspace
            </p>
            <h1 className="text-2xl font-light tracking-tight text-[var(--text-primary)] header-accent">
              Vibe Board
            </h1>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-[var(--border-default)] to-transparent mb-1.5" />
          <p className="hidden md:block text-[10px] font-mono text-[var(--text-muted)] mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kanban Board - Main Area */}
        <div className="flex-1 min-w-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <KanbanBoard />
        </div>

        {/* Sidebar */}
        <aside
          className="w-full lg:w-80 xl:w-88 flex-shrink-0 flex flex-col gap-5 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          <TodoList />
          <NotesPanel />
        </aside>
      </div>
    </main>
  );
}
