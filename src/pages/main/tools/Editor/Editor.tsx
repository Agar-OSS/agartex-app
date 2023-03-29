import { LatexTextArea, PdfViewer } from '@components';
import styles from './Editor.module.less';

const Editor = () => {
  return (
    <div className={styles.root}>
      <LatexTextArea/>
      <PdfViewer/>
    </div>
  );
};

export default Editor;
