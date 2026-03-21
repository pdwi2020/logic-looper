import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-light-steel/20 bg-brand-dark text-brand-light-sky">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div>
          <p className="font-sans text-lg font-bold tracking-tight text-brand-blue">
            Logic Looper
          </p>
          <p className="mt-1 font-body text-xs text-brand-light-steel/80">
            Built for Bluestock Fintech
          </p>
          <p className="mt-3 font-body text-xs text-brand-light-steel/60">
            © {currentYear} Logic Looper. All rights reserved.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-light-steel/60">
            Navigate
          </p>
          <ul className="mt-3 space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Play Today', to: '/puzzle' },
              { label: 'Profile', to: '/profile' },
              { label: 'Leaderboard', to: '/leaderboard' },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-body text-sm text-brand-light-steel/80 transition-colors hover:text-brand-light-sky"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* More */}
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-light-steel/60">
            More
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to="/settings"
                className="font-body text-sm text-brand-light-steel/80 transition-colors hover:text-brand-light-sky"
              >
                Settings
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/pdwi2020/logic-looper"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-brand-light-steel/80 transition-colors hover:text-brand-light-sky"
              >
                View on GitHub →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
