import MainPage from '../Main';
import { render } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
jest.mock('../tools/Editor/Editor');

describe('<MainPage/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', () => {
    const { getByTestId } = render(<MainPage />);
    getByTestId('logout-button');
    getByTestId('toolbar');
    getByTestId('editor');
  });

  it('should logout on logout button click', async () => {
    const { getByTestId } = render(<MainPage />);
    getByTestId('logout-button').click();
    // TODO: test cookie removal
    expect(mockNavigate).toHaveBeenCalled();
  });
});
