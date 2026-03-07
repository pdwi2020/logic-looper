import { render, screen } from '@testing-library/react';

import { HeatmapLegend } from '@/components/heatmap/HeatmapLegend';
import { getIntensityColor } from '@/utils/intensityMapper';

describe('components/heatmap/HeatmapLegend', () => {
  it("renders 'Less' and 'More' labels", () => {
    render(<HeatmapLegend />);

    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('renders 5 colored squares', () => {
    const { container } = render(<HeatmapLegend />);
    const squares = container.querySelectorAll('div[aria-hidden="true"]');

    expect(squares).toHaveLength(5);

    const expectedClasses = [0, 1, 2, 3, 4].map((level) =>
      getIntensityColor(level as 0 | 1 | 2 | 3 | 4),
    );

    squares.forEach((square, index) => {
      expect(square).toHaveClass(expectedClasses[index]);
    });
  });
});
