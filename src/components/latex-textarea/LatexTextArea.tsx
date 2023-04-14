import styles from './LatexTextArea.module.less';

interface Props {
  testId: string,
  onTextChange: (newText: string) => void
}

const LatexTextArea = (props: Props) => {
  return (
    <textarea
      className={styles.latexTextArea}
      data-testid={props.testId}
      onChange={(e) => props.onTextChange(e.target.value)}  
    />
  );
};

export default LatexTextArea;
