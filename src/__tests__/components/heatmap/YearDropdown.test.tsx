import { fireEvent, render, screen } from '@testing-library/react';

import { YearDropdown } from '@/components/heatmap/YearDropdown';

describe('components/heatmap/YearDropdown', () => {
  it('renders a select element', () => {
    render(<YearDropdown selectedYear={2026} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('selected value matches selectedYear prop', () => {
    render(<YearDropdown selectedYear={2025} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toHaveValue('2025');
  });

  it('options include current year (2026) down to 2024', () => {
    render(<YearDropdown selectedYear={2026} onChange={vi.fn()} />);

    expect(screen.getByRole('option', { name: '2026' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2025' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2024' })).toBeInTheDocument();
  });

  it('onChange fires when selection changes', () => {
    const onChange = vi.fn();

    render(<YearDropdown selectedYear={2026} onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2024' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2024);
  });
});
