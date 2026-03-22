import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

const ROUTE_ORDER = ['/', '/puzzle', '/profile', '/leaderboard', '/settings'];

const getRouteIndex = (path: string) => {
  const idx = ROUTE_ORDER.findIndex((r) => (r === '/' ? path === '/' : path.startsWith(r)));
  return idx === -1 ? 0 : idx;
};

const pageVariants = {
  enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: `${d * -30}%`, opacity: 0 }),
};

const pageTransition = { duration: 0.28, ease: [0.32, 0, 0.67, 0] as const };

export function MainLayout() {
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

  const direction =
    getRouteIndex(location.pathname) >= getRouteIndex(prevPathnameRef.current) ? 1 : -1;

  useEffect(() => {
    prevPathnameRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-brand-light-gray">
      <Header />
      <main className="w-full flex-1 overflow-hidden px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default MainLayout;
