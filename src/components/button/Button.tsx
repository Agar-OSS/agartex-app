import { ReactNode } from 'react';
import styles from './Button.module.less';

type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  className?: string,
  value?: string,
  disabled?: boolean,
  onClick?: () => void,
  ariaLabel: string,
  testId: string,
  type?: ButtonType,
  children?: ReactNode[] | ReactNode
}

const Button = (props: Props) => {
  return (
    <button
      aria-label={props.ariaLabel}
      disabled={!!props.disabled}
      data-testid={props.testId}
      className={`${styles.agarButton} ${props.className}`}
      onClick={props.onClick}
      type={props.type ?? 'button'}
    >
      { props.value && <label>{props.value}</label> }
      { props.children }
    </button>
  );
};

export default Button;
