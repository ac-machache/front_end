import { describe, test, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import IAdvisor from './IAdvisor';

describe('IAdvisor component', () => {
  test('renders idle state by default', () => {
    const { container } = render(<IAdvisor active={false} />);
    // idle renders a single rounded div with animation
    const circles = container.querySelectorAll('div.rounded-full');
    expect(circles.length).toBeGreaterThan(0);
  });

  test('renders thinking visual when wsMode is thinking', () => {
    const { container } = render(<IAdvisor active wsMode="thinking" />);
    const ring = container.querySelector('div.border-2.border-foreground');
    expect(ring).toBeTruthy();
  });

  test('renders responding visual when wsMode is responding', () => {
    const { container } = render(<IAdvisor active wsMode="responding" />);
    const candidates = Array.from(container.querySelectorAll('div.rounded-full')) as HTMLDivElement[];
    const dot = candidates.find((el) => el.className.includes('bg-foreground/90'));
    expect(dot).toBeTruthy();
  });
});


