import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Play', to: '/puzzle' },
  { label: 'Archive', to: '/archive' },
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

const activeNavLinkClassName =
  'rounded-lg px-3 py-2 bg-brand-blue/15 text-brand-light-sky ring-1 ring-inset ring-brand-blue/20 font-sans text-sm font-medium transition-colors';
const inactiveNavLinkClassName =
  'rounded-lg px-3 py-2 text-brand-light-steel/80 hover:bg-white/8 hover:text-brand-white font-sans text-sm font-medium transition-colors';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-brand-light-blue/15 bg-brand-night/85 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-brand-night'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-brand-blue"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5 shrink-0"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="10,1 19,10 10,19 1,10" />
          </svg>
          Logic Looper
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                isActiveRoute(pathname, item.to)
                  ? activeNavLinkClassName
                  : inactiveNavLinkClassName
              }
            >
              {item.label}
            </Link>
          ))}
          <Link to="/puzzle">
            <Button variant="primary" size="sm">
              Play →
            </Button>
          </Link>
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
                    className={`block ${
                      isActiveRoute(pathname, item.to)
                        ? activeNavLinkClassName
                        : inactiveNavLinkClassName
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
