import styles from './Button.module.less';

type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  value: string,
  disabled?: boolean,
  onClick?: () => void,
  ariaLabel: string,
  testId: string,
  type?: ButtonType
}

const Button = (props: Props) => {
  return (
    <button
      aria-label={props.ariaLabel}
      disabled={!!props.disabled}
      data-testid={props.testId}
      className={styles.agarButton}
      onClick={props.onClick}
      type={props.type ?? 'button'}
    >
      {props.value}
    </button>
  );
};

export default Button;
