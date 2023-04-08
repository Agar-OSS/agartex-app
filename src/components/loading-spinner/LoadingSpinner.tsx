import { BLUE_2 } from '@constants';
import { ThreeCircles } from 'react-loader-spinner';

interface Props {
  ariaLabel: string,
  className?: string,
  testId: string
}

const LoadingSpinner = (props: Props) => (
  <div 
    data-testid={props.testId}
  >
    <ThreeCircles
      color={BLUE_2}
      ariaLabel={props.ariaLabel}
      wrapperClass={props.className}
    />
  </div>
);

export default LoadingSpinner;
