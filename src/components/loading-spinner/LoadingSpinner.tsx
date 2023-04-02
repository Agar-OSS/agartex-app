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
      color="#7F98B8"
      visible={true}
      ariaLabel={props.ariaLabel}
      wrapperClass={props.className}
    />
  </div>
);

export default LoadingSpinner;
