'use client';

import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { NotesPanel } from '@/components/NotesPanel';

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Vibe Board</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kanban Board - Main Area */}
        <div className="flex-1 min-w-0">
          <KanbanBoard />
        </div>

        {/* Sidebar - Quick Tasks & Notes */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-4">
          <TodoList />
          <NotesPanel />
        </aside>
      </div>
    </main>
  );
}
