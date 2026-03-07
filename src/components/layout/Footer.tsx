export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-light-steel/20 bg-brand-dark text-brand-light-sky">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-sm sm:px-6 lg:px-8">
        <p className="font-sans font-medium">Built for Bluestock Fintech</p>
        <p className="font-body text-brand-light-steel/90">
          © {currentYear} Logic Looper. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
