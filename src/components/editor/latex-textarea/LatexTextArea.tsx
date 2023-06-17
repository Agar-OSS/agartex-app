import { CursorPosition, MonacoContentManager } from './MonacoContentManager';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import { IKeyboardEvent, editor } from 'monaco-editor';
import { getKeyValue, isCharacterKey, isKeyboardEventToIgnore } from './monaco-content-rules';
import { useEffect, useRef, useState } from 'react';
import { Collaboration } from 'pages/main/collaboration/collaboration';
import { Delta } from 'pages/main/collaboration/delta-queue/delta-queue';
import { LatexGrammar } from './LatexGrammar';
import styles from './LatexTextArea.module.less';
import { useCursorsDecorations } from './cursors-decorations';

interface Props {
  testId: string,
  theme: string,
  width?: number,
  onTextChangeCompilationCallback: (text: string) => void,
  collaboration: Collaboration
}

const LatexTextArea = (props: Props) => {
  const { 
    initDocument, 
    clientId,
    cursorsPositions,
    clientsCmap,
    onCursorPositionChange, 
    deltaQueue,
    generateCharacter
  } = props.collaboration;

  const [position, setPosition] = useState<CursorPosition>({ row: 1, column: 1 });

  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<Monaco>(null);
  const managerRef = useRef<MonacoContentManager>(new MonacoContentManager(initDocument));
  
  useCursorsDecorations(
    clientId, clientsCmap, cursorsPositions, editorRef, monacoRef, managerRef
  );

  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.register({ id: 'latex' });
      monaco.languages.setMonarchTokensProvider('latex', LatexGrammar);
    });
  }, []);

  useEffect(() => {
    managerRef.current.setDocument(initDocument);
    props.onTextChangeCompilationCallback(managerRef.current.getText());
  }, [initDocument]);

  const applyDelta = (delta: Delta | undefined) => {
    if (delta) {
      const edits = managerRef.current.applyDelta(delta, monacoRef);
      edits.forEach((edit) => editorRef.current.executeEdits('delta-queue', [edit]));
      props.onTextChangeCompilationCallback(managerRef.current.getText());
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
    if (isKeyboardEventToIgnore(e)) {
      return;
    }
    
    const key = e.browserEvent?.key;
    
    if (isCharacterKey(key)) {
      if (editorRef.current) {
        const keyValue: string = getKeyValue(e.browserEvent?.key);

        const deltas = managerRef.current.createDeltas(
          editorRef.current.getSelection(),
          keyValue,
          key === 'Backspace',
          generateCharacter
        );

        deltas.forEach((delta: Delta) => delta && deltaQueue.push(delta));
      }
    }
    
    e.stopPropagation();
    e.preventDefault();
  };
  
  const handlePasteEvent = (e: ClipboardEvent) => {
    const insertedText = e.clipboardData.getData('text/plain');

    const deltas = managerRef.current.createDeltas(
      editorRef.current.getSelection(),
      insertedText,
      false,
      generateCharacter
    );

    deltas.forEach((delta: Delta) => delta && deltaQueue.push(delta));

    e.stopPropagation();
    e.preventDefault();
  };

  const onEditorMount = (editorL: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorL.onDidChangeCursorPosition(handleCursorPositionChange);
    editorL.onKeyDown(handleKeyDown);
    editorL.setValue(managerRef.current.getText());
    editorL.getDomNode().addEventListener('paste', handlePasteEvent, true);

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
        theme={props.theme}
        width={props.width}
        options={{
          minimap: {
            enabled: false
          },
          quickSuggestions: false,
          wordWrap: 'on'
        }}
        value={managerRef.current.getText()}
      />
    </div>
  );
};

export default LatexTextArea;

