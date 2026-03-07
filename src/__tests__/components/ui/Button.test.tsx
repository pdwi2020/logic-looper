import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '@/components/ui/Button';

describe('components/ui/Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('onClick fires on click', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Submit</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled button has disabled attribute', () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it.each(['primary', 'secondary', 'accent', 'ghost'] as const)(
    'variant "%s" renders without error',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);

      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    },
  );

  it.each(['sm', 'md', 'lg'] as const)(
    'size "%s" renders without error',
    (size) => {
      render(<Button size={size}>{size}</Button>);

      expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
    },
  );

  it('custom className is applied', () => {
    render(<Button className="custom-button-class">Custom</Button>);

    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'custom-button-class',
    );
  });
});
