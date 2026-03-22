import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Play', to: '/puzzle' },
  { label: 'Profile', to: '/profile' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Settings', to: '/settings' },
];

const isActiveRoute = (pathname: string, to: string): boolean => {
  if (to === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(to);
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-light-blue/20 bg-brand-night text-brand-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-tight text-brand-blue"
        >
          Logic Looper
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3 py-2 font-sans text-sm font-medium transition-colors ${
                isActiveRoute(pathname, item.to)
                  ? 'bg-brand-blue/20 text-brand-light-sky'
                  : 'text-brand-light-steel hover:bg-brand-white/10 hover:text-brand-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen((prev) => !prev);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-light-sky hover:bg-brand-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue md:hidden"
          aria-label={
            isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6l-12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.nav
            className="overflow-hidden border-t border-brand-light-blue/20 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3 sm:px-6">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 font-sans text-sm font-medium transition-colors ${
                      isActiveRoute(pathname, item.to)
                        ? 'bg-brand-blue/20 text-brand-light-sky'
                        : 'text-brand-light-steel hover:bg-brand-white/10 hover:text-brand-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Header;
