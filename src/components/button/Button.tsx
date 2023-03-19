interface Props {
  value: string,
  onClick: () => void
}

const Button = (props: Props) => {
  return (
    <button onClick={props.onClick}>{props.value}</button>
  );
};

export default Button;
