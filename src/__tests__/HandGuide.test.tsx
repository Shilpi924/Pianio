import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HandGuide from '../components/HandGuide';


describe('HandGuide Component', () => {
  it('renders both left and right hand containers', () => {
    render(<HandGuide activeFinger={null} />);
    expect(screen.getByText('Left Hand')).toBeDefined();
    expect(screen.getByText('Right Hand')).toBeDefined();
  });

  it('renders all 10 fingers', () => {
    render(<HandGuide activeFinger={null} />);
    
    // There are two "1"s, two "2"s, etc.
    const thumbLabels = screen.getAllByText('1');
    const indexLabels = screen.getAllByText('2');
    const pinkyLabels = screen.getAllByText('5');
    
    expect(thumbLabels.length).toBe(2);
    expect(indexLabels.length).toBe(2);
    expect(pinkyLabels.length).toBe(2);
  });

  it('applies active styling when a finger is active', () => {
    const { container } = render(<HandGuide activeFinger={{ finger: 1, hand: 'right' }} />);
    // Look for the thumb's red color class from FINGER_COLORS
    const redFinger = container.querySelector('.bg-red-500');
    expect(redFinger).toBeTruthy();
    
    // Make sure it has the scale-110 class indicating it's active
    expect(redFinger?.classList.contains('scale-110')).toBe(true);
  });
});
