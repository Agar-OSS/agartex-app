import styles from './LatexTextArea.module.less';

interface Props {
  testId: string
}

const LatexTextArea = (props: Props) => {
  return (
    <textarea
      className={styles.latexTextArea}
      data-testid={props.testId}/>
  );
};

export default LatexTextArea;
