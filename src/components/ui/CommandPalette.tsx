import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';

const COMMANDS = [
  { label: '🏠 Home', path: '/' },
  { label: '🎯 Play Today', path: '/puzzle' },
  { label: '👤 Profile', path: '/profile' },
  { label: '🏆 Leaderboard', path: '/leaderboard' },
  { label: '⚙️ Settings', path: '/settings' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f1a]/95 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-white/10">
          <Command.Input
            placeholder="Go to..."
            className="w-full bg-transparent px-4 py-3 font-sans text-sm text-white outline-none placeholder:text-white/40"
          />
          <Command.List className="max-h-64 overflow-y-auto px-2 pb-2">
            <Command.Empty className="py-6 text-center font-body text-sm text-white/40">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-white/40">
              {COMMANDS.map((cmd) => (
                <Command.Item
                  key={cmd.path}
                  onSelect={() => {
                    navigate(cmd.path);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-white/90 aria-selected:bg-white/10 aria-selected:text-white"
                >
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
