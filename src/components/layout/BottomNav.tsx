import { LayoutGroup, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const isActive = (pathname: string, to: string) =>
  to === '/' ? pathname === '/' : pathname.startsWith(to);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M17.5 14v6M14 17h7" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const LeaderboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="2" y="14" width="4" height="8" rx="1" />
    <rect x="9" y="9" width="4" height="13" rx="1" />
    <rect x="16" y="4" width="4" height="18" rx="1" />
  </svg>
);

const navItems: NavItem[] = [
  { label: 'Home', to: '/', icon: <HomeIcon /> },
  { label: 'Play', to: '/puzzle', icon: <PlayIcon /> },
  { label: 'Profile', to: '/profile', icon: <ProfileIcon /> },
  { label: 'Ranks', to: '/leaderboard', icon: <LeaderboardIcon /> },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-light-blue/20 bg-brand-dark md:hidden"
      aria-label="Mobile navigation"
    >
      <LayoutGroup>
        <ul className="flex h-16 items-stretch">
          {navItems.map((item) => {
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to} className="flex flex-1">
                <Link
                  to={item.to}
                  onClick={() => { navigator.vibrate?.(5); }}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? 'text-brand-blue'
                      : 'text-brand-light-steel/70 hover:text-brand-light-sky'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-brand-blue"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}

export default BottomNav;
