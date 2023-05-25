import { Collaboration, Delta } from 'pages/main/collaboration/model';
import { CursorPosition, MonacoContentManager } from './MonacoContentManager';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import { IKeyboardEvent, editor } from 'monaco-editor';
import { isCharacterKey, isKeyToIgnore } from './monaco-content-rules';
import { useEffect, useRef, useState } from 'react';
import { LatexGrammar } from './LatexGrammar';
import styles from './LatexTextArea.module.less';
import { useCursorsDecorations } from './cursors-decorations';

interface Props {
  testId: string,
  collaboration: Collaboration
}

const LatexTextArea = (props: Props) => {
  const { 
    initDocument, 
    clientId,
    cursorsPositions,
    onCursorPositionChange, 
    deltaQueue,
    generateCharacter
  } = props.collaboration;

  const [position, setPosition] = useState<CursorPosition>({ row: 1, column: 1 });

  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<Monaco>(null);
  const managerRef = useRef<MonacoContentManager>(new MonacoContentManager(initDocument));
  
  useCursorsDecorations(
    clientId, cursorsPositions, editorRef, monacoRef, managerRef
  );

  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.register({ id: 'latex' });
      monaco.languages.setMonarchTokensProvider('latex', LatexGrammar);
    });
  }, []);

  const applyDelta = (delta: Delta | undefined) => {
    if (delta) {
      const edit = managerRef.current.applyDelta(delta, monacoRef);
      editorRef.current.executeEdits('delta-queue', [edit]);
    }
  };

  useEffect(() => {
    if (monacoRef.current) {
      applyDelta(deltaQueue.pop());
    }
  }, [deltaQueue.version]);

  useEffect(() => {
    if (position) {
      const offset = managerRef.current.positionToOffset(position);
      const charId = managerRef.current.getCharIdForOffset(offset);
      onCursorPositionChange(charId);
    }
  }, [position]);
  
  const handleCursorPositionChange = (e: editor.ICursorPositionChangedEvent) => {
    setPosition({ row: e.position.lineNumber, column: e.position.column });
  };
 
  const handleKeyDown = (e: IKeyboardEvent) => {
    const key: string = e.browserEvent?.key;

    if (isKeyToIgnore(key)) {
      return;
    }

    if (isCharacterKey(key)) {
      if (editorRef.current) {
        const delta = managerRef.current.createDelta(key, editorRef, generateCharacter);
        delta && deltaQueue.push(delta);
      }
    }
    
    e.stopPropagation();
    e.preventDefault();
  };

  const onEditorMount = (editorL: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorL.onDidChangeCursorPosition(handleCursorPositionChange);
    editorL.onKeyDown(handleKeyDown);
    editorRef.current = editorL;
    monacoRef.current = monaco;
  };

  return (
    <div className={styles.latexTextArea}
      data-testid={props.testId}>
      <Editor
        onMount={onEditorMount}
        language='latex'
        defaultLanguage='latex'
        theme='vs-dark'
        options={{
          minimap: {
            enabled: false
          }
        }}
        value={managerRef.current.getText()}
      />
    </div>
  );
};

export default LatexTextArea;
