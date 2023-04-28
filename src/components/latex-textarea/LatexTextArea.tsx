import Editor, { loader } from '@monaco-editor/react';

import { LatexExampleDoc, LatexGrammar } from './LatexGrammar';
import styles from './LatexTextArea.module.less';
import { useEffect } from 'react';

interface Props {
  testId: string,
  onTextChange: (newText: string) => void
}

const LatexTextArea = (props: Props) => {
  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.register({ id: 'latex' });
      monaco.languages.setMonarchTokensProvider('latex', LatexGrammar);
    });
  }, []);

  return (
    <div className={styles.latexTextArea}
      data-testid={props.testId}>
      <Editor
        language='latex'
        defaultLanguage='latex'
        theme='vs-dark'
        onChange={props.onTextChange}
        options={{
          minimap: {
            enabled: false
          }
        }}
        value={LatexExampleDoc}
      />
    </div>
  );
};

export default LatexTextArea;
