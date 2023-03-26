import logo from './agarLogo.png';

interface Props {
  ariaLabel: string
  className: string
  testId: string
}

const AgarLogo = (props: Props) => (
  <div 
    className={props.className}
  >
    <img
      aria-label={props.ariaLabel}
      data-testid={props.testId}
      style={{ width: '100%', height: '100%' }}
      src={logo}
    />
  </div>
);

export default AgarLogo;
