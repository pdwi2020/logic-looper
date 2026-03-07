import { render, screen } from '@testing-library/react';

import { Card } from '@/components/ui/Card';

describe('components/ui/Card', () => {
  it('renders title text', () => {
    render(<Card title="Test Title">Body content</Card>);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Card title="Test Title">Card body</Card>);

    expect(screen.getByText('Card body')).toBeInTheDocument();
  });

  it.each(['default', 'elevated', 'outlined'] as const)(
    'variant "%s" renders without error',
    (variant) => {
      render(
        <Card title={`${variant} title`} variant={variant}>
          variant content
        </Card>,
      );

      expect(screen.getByText(`${variant} title`)).toBeInTheDocument();
    },
  );

  it('custom className is applied', () => {
    render(
      <Card title="Custom Card" className="custom-card-class">
        Card body
      </Card>,
    );

    expect(screen.getByText('Custom Card').closest('article')).toHaveClass(
      'custom-card-class',
    );
  });
});
