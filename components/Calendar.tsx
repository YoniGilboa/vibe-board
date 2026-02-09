'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KanbanTask, COLUMN_TITLES } from '@/types';

type ViewMode = 'week' | 'month';

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getWeekDays(anchor: Date): Date[] {
  const d = new Date(anchor);
  const day = d.getDay();
  const sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i));
}

function getMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  const startOffset = -dayOfWeek; // Sunday start
  const startDate = new Date(year, month, 1 + startOffset);
  return Array.from({ length: 42 }, (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
}

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarProps {
  tasks: KanbanTask[];
}

export function Calendar({ tasks }: CalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, KanbanTask[]>();
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const key = toDateKey(new Date(task.dueDate));
      const arr = map.get(key) || [];
      arr.push(task);
      map.set(key, arr);
    }
    return map;
  }, [tasks]);

  const days = useMemo(() => {
    if (viewMode === 'week') return getWeekDays(currentDate);
    return getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());
  }, [viewMode, currentDate]);

  const navigate = (direction: -1 | 1) => {
    setCurrentDate(prev => {
      if (viewMode === 'week') {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + direction * 7);
      }
      return new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(toDateKey(new Date()));
  };

  const headerLabel = viewMode === 'week'
    ? (() => {
        const weekDays = getWeekDays(currentDate);
        const start = weekDays[0];
        const end = weekDays[6];
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${fmt(start)} – ${fmt(end)}`;
      })()
    : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedTasks = selectedDate ? tasksByDate.get(selectedDate) || [] : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--priority-medium)';
    }
  };

  const getColumnColor = (column: string) => {
    switch (column) {
      case 'todo': return 'var(--col-todo)';
      case 'in-progress': return 'var(--col-progress)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-4 geo-corner relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
          Calendar
        </p>
        <div className="flex gap-0.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-md p-0.5">
          {(['week', 'month'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all"
              style={{
                backgroundColor: viewMode === mode ? 'var(--accent-amber-dim)' : 'transparent',
                color: viewMode === mode ? 'var(--accent-amber)' : 'var(--text-muted)',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded hover:bg-[var(--bg-surface)]"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--text-primary)]">
            {headerLabel}
          </span>
          <button
            onClick={goToToday}
            className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--accent-amber)] bg-[var(--accent-amber-dim)] rounded hover:bg-[var(--accent-amber-glow)] transition-colors"
          >
            Today
          </button>
        </div>
        <button
          onClick={() => navigate(1)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded hover:bg-[var(--bg-surface)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[9px] font-mono uppercase tracking-wider text-[var(--priority-medium)] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, i) => {
          const key = toDateKey(day);
          const dayTasks = tasksByDate.get(key) || [];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const selected = selectedDate === key;
          const today = isToday(day);

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(selected ? null : key)}
              className="relative flex flex-col items-center py-1.5 rounded transition-all"
              style={{
                backgroundColor: selected
                  ? 'var(--accent-amber-dim)'
                  : today
                    ? 'var(--bg-surface)'
                    : 'transparent',
                opacity: viewMode === 'month' && !isCurrentMonth ? 0.35 : 1,
              }}
            >
              <span
                className="text-[12px] leading-none"
                style={{
                  color: today
                    ? 'var(--accent-amber)'
                    : selected
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  fontWeight: today ? 600 : 400,
                }}
              >
                {day.getDate()}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-[2px] mt-1">
                  {dayTasks.slice(0, 3).map((t, j) => (
                    <span
                      key={j}
                      className="w-[4px] h-[4px] rounded-full"
                      style={{ backgroundColor: getPriorityColor(t.priority) }}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[7px] text-[var(--text-muted)] leading-none ml-px">+</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Weekly view: inline task names */}
      {viewMode === 'week' && (
        <div className="mt-3 space-y-1">
          {days.map((day, i) => {
            const key = toDateKey(day);
            const dayTasks = tasksByDate.get(key) || [];
            if (dayTasks.length === 0) return null;
            return (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[10px] font-mono text-[var(--text-muted)] w-8 flex-shrink-0 pt-0.5">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <div className="flex-1 space-y-0.5">
                  {dayTasks.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center gap-1.5">
                      <span
                        className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: getPriorityColor(t.priority) }}
                      />
                      <span className="text-[11px] text-[var(--text-secondary)] truncate">
                        {t.title}
                      </span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-[var(--text-muted)]">
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected date detail */}
      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {selectedTasks.length === 0 ? (
            <p className="text-[11px] text-[var(--text-muted)] italic">No tasks due</p>
          ) : (
            <div className="space-y-1.5">
              {selectedTasks.map(t => (
                <div key={t.id} className="flex items-center gap-2">
                  <span
                    className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: getPriorityColor(t.priority) }}
                  />
                  <span className="text-[12px] text-[var(--text-primary)] truncate flex-1">
                    {t.title}
                  </span>
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      color: getColumnColor(t.column),
                      backgroundColor: `color-mix(in srgb, ${getColumnColor(t.column)} 15%, transparent)`,
                    }}
                  >
                    {COLUMN_TITLES[t.column]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
