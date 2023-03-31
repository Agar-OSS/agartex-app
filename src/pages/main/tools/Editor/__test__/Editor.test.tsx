import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
// import { Simulate, act } from 'react-dom/test-utils';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

import Editor from '../Editor';

// const mouseMove = (x: number, y: number, node: HTMLElement) => {
//   const event = new MouseEvent('mousemove', {clientX: 100, clientY: 100});
//   node.ownerDocument.dispatchEvent(event);
// };

describe('<Editor/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', async () => {
    const { getByTestId } = await act(() => { return render(<Editor/>); });
    getByTestId('latex-text-area');
    getByTestId('delimiter');
    getByTestId('pdf-viewer');
  });

  it('should resize editor and viewer', async () => {
    // const { getByTestId } = await act(() => { return render(<Editor/>); });

    // TODO: mock window size
    // expect(getByTestId('latex-text-area').clientWidth).toEqual(250);
    // expect(getByTestId('pdf-viewer').clientWidth).toEqual(250);

    // const delimiter = getByTestId('delimiter');
    // await act(() => { 
    //   Simulate.mouseDown(delimiter);
    //   mouseMove(100, 50, delimiter);
    //   Simulate.mouseUp(delimiter);
    // });
    // expect(getByTestId('latex-text-area').clientWidth).toEqual(100);
    // expect(getByTestId('pdf-viewer').clientWidth).toEqual(400);
  });
});
