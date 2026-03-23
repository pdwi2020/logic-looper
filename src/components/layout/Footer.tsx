import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-light-steel/20 bg-brand-dark text-brand-light-sky">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-brand-blue"
            >
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="10,1 19,10 10,19 1,10" />
              </svg>
              Logic Looper
            </Link>
            <p className="mt-3 font-body text-sm leading-relaxed text-brand-light-steel/70">
              The daily logic game that sharpens your mind, one puzzle at a time.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/pdwi2020/logic-looper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-steel/20 text-brand-light-steel/60 transition-colors hover:border-brand-light-sky/40 hover:text-brand-light-sky"
                aria-label="View on GitHub"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <span className="rounded-full border border-brand-light-steel/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-light-steel/50">
                Bluestock Fintech
              </span>
            </div>
          </div>

          {/* Play */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-light-steel/50">
              Play
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Play Today', to: '/puzzle' },
                { label: 'Archive', to: '/archive' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-body text-sm text-brand-light-steel/70 transition-colors hover:text-brand-light-sky"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compete */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-light-steel/50">
              Compete
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Profile', to: '/profile' },
                { label: 'Leaderboard', to: '/leaderboard' },
                { label: 'Settings', to: '/settings' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-body text-sm text-brand-light-steel/70 transition-colors hover:text-brand-light-sky"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-light-steel/50">
              About
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/pdwi2020/logic-looper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-brand-light-steel/70 transition-colors hover:text-brand-light-sky"
                >
                  GitHub Repository →
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pdwi2020/logic-looper/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-brand-light-steel/70 transition-colors hover:text-brand-light-sky"
                >
                  Report an Issue →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="font-body text-xs text-brand-light-steel/50">
            © {currentYear} Logic Looper · MIT License
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <span className="font-body text-xs text-brand-light-steel/40">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
