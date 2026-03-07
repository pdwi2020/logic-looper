import { fireEvent, render, screen } from '@testing-library/react';

import { HeatmapCell } from '@/components/heatmap/HeatmapCell';

describe('components/heatmap/HeatmapCell', () => {
  it('renders with correct intensity color class', () => {
    render(
      <HeatmapCell
        date="2026-03-06"
        intensity={3}
        onHover={vi.fn()}
        onLeave={vi.fn()}
      />,
    );

    const cell = screen.getByLabelText('2026-03-06 Hard');
    expect(cell).toHaveClass('bg-green-600');
  });

  it('calls onHover on mouseEnter with correct args', () => {
    const onHover = vi.fn();
    const rect = new DOMRect(10, 20, 30, 40);
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect);

    render(
      <HeatmapCell
        date="2026-03-06"
        intensity={2}
        onHover={onHover}
        onLeave={vi.fn()}
      />,
    );

    const cell = screen.getByLabelText('2026-03-06 Medium');
    fireEvent.mouseEnter(cell);

    expect(onHover).toHaveBeenCalledTimes(1);
    expect(onHover).toHaveBeenCalledWith('2026-03-06', rect);

    rectSpy.mockRestore();
  });

  it('calls onLeave on mouseLeave', () => {
    const onLeave = vi.fn();

    render(
      <HeatmapCell
        date="2026-03-06"
        intensity={1}
        onHover={vi.fn()}
        onLeave={onLeave}
      />,
    );

    const cell = screen.getByLabelText('2026-03-06 Easy');
    fireEvent.mouseLeave(cell);

    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label', () => {
    render(
      <HeatmapCell
        date="2026-03-06"
        intensity={4}
        onHover={vi.fn()}
        onLeave={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('2026-03-06 Perfect')).toBeInTheDocument();
  });
});
