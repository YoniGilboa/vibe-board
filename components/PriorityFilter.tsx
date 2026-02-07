'use client';

import { Priority, PRIORITY_LABELS, KanbanTask } from '@/types';

type FilterValue = 'all' | Priority;

interface PriorityFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  tasks: KanbanTask[];
}

const FILTERS: { key: FilterValue; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: PRIORITY_LABELS.high },
  { key: 'medium', label: PRIORITY_LABELS.medium },
  { key: 'low', label: PRIORITY_LABELS.low },
];

export function PriorityFilter({ value, onChange, tasks }: PriorityFilterProps) {
  const getCount = (filter: FilterValue) => {
    if (filter === 'all') return tasks.length;
    return tasks.filter(t => (t.priority ?? 'medium') === filter).length;
  };

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Filter
        </span>
        <div className="flex gap-1.5">
          {FILTERS.map(({ key, label }) => {
            const isActive = value === key;
            const count = getCount(key);
            const colorVar = key === 'all' ? '--accent-amber' : `--priority-${key}`;
            const dimVar = key === 'all' ? '--accent-amber-dim' : `--priority-${key}-dim`;

            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? `var(${dimVar})` : 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive ? `var(${colorVar})` : 'var(--border-subtle)',
                  color: isActive ? `var(${colorVar})` : 'var(--text-muted)',
                }}
              >
                {key !== 'all' && (
                  <span
                    className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: `var(${colorVar})` }}
                  />
                )}
                {label}
                <span
                  className="text-[10px] ml-0.5"
                  style={{ opacity: 0.7 }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="mt-3 h-[1px]"
        style={{ background: 'linear-gradient(90deg, var(--border-default), transparent)' }}
      />
    </div>
  );
}
