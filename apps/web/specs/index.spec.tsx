import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

describe('Page', () => {
  it('should render Metro heading', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /metro/i })).toBeTruthy();
  });
});
