import { render, screen } from '@testing-library/react';
import { BentoBox } from '../BentoBox';

describe('BentoBox', () => {
  it('should render children', () => {
    render(
      <BentoBox>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </BentoBox>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should apply responsive grid classes', () => {
    const { container } = render(
      <BentoBox>
        <div>Item</div>
      </BentoBox>
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-2');
    expect(grid).toHaveClass('md:grid-cols-3');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });

  it('should apply gap classes', () => {
    const { container } = render(
      <BentoBox>
        <div>Item</div>
      </BentoBox>
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass('gap-4');
    expect(grid).toHaveClass('md:gap-6');
  });

  it('should render with custom className', () => {
    const { container } = render(
      <BentoBox className="custom-class">
        <div>Item</div>
      </BentoBox>
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass('custom-class');
    expect(grid).toHaveClass('grid'); // Should still have base classes
  });

  it('should handle no children', () => {
    const { container } = render(<BentoBox />);
    const grid = container.firstChild;
    expect(grid).toBeInTheDocument();
    expect(grid).toBeEmptyDOMElement();
  });
});
