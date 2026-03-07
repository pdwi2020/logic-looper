import { render, screen } from '@testing-library/react';

import { Footer } from '@/components/layout/Footer';

describe('components/layout/Footer', () => {
  it("renders 'Bluestock Fintech' text (or 'Bluestock' at minimum)", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Bluestock Fintech|Bluestock/i),
    ).toBeInTheDocument();
  });

  it('renders current year (2026)', () => {
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  });
});
