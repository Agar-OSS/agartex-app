import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should print welcome message', () => {
    render(<App />);
    const heading = screen.getByText(/Hello stranger/i);
    expect(heading).toBeInTheDocument();
  });
});
