import Editor, { loader } from '@monaco-editor/react';

import { LatexExampleDoc, LatexGrammar } from './LatexGrammar';
import styles from './LatexTextArea.module.less';
import { useEffect } from 'react';

interface Props {
  testId: string,
  onTextChange: (newText: string) => void
}

// TODO: test, onTextChange, delimiter not working
const LatexTextArea = (props: Props) => {
  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.register({ id: 'latex' });
      monaco.languages.setMonarchTokensProvider('latex', LatexGrammar);
    });
  }, []);

  return (
    <Editor
      className={styles.LatexTextArea}
      language='latex'
      defaultLanguage='latex'
      theme='vs-dark'
      options={{
        minimap: {
          enabled: false
        }
      }}
      value={LatexExampleDoc}
    />
  );
};

export default LatexTextArea;
