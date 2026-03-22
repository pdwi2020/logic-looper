import '@/styles/globals.css';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { MainLayout } from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import Leaderboard from '@/pages/Leaderboard';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import { store } from '@/store/store';

const PuzzlePage = lazy(() => import('@/pages/Puzzle'));

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-brand-light-steel bg-brand-white font-sans text-sm font-medium text-brand-dark-gray">
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-brand-blue/40 border-t-brand-blue" />
      Loading page...
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="puzzle"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <PuzzlePage />
                </Suspense>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  );
}

export default App;
