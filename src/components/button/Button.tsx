import styles from './Button.module.less';

interface Props {
  value: string,
  disabled?: boolean,
  onClick: () => void,
  ariaLabel: string,
  testId: string
}

const Button = (props: Props) => {
  return (
    <button
      aria-label={props.ariaLabel}
      disabled={!!props.disabled}
      data-testid={props.testId}
      className={styles.agarButton}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

export default Button;
