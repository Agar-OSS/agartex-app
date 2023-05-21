import Editor, { Monaco, loader } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { LatexGrammar } from './LatexGrammar';
import { editor } from 'monaco-editor';
import styles from './LatexTextArea.module.less';

interface Props {
  clientId: string,
  testId: string,
  text: string,
  cursorsPositions: Map<string, number>,
  onTextChange: (newText: string) => void,
  onCursorPositionChange: (offset: number) => void
}

interface CursorPosition {
  row: number,
  column: number
}

const convert_position_offset = (
  text: string,
  position: CursorPosition
): number => {
  return text
    .split('\n')
    .slice(0, position.row-1)
    .reduce((sum: number, line: string) => sum + line.length + 1, 0)
  + position.column - 2;
};

const convert_offset_position = (
  text: string,
  offset: number
): CursorPosition => {
  const splittedText = text.split('\n');
  let row = 1;
  let _offset = offset;

  while (row-1 < splittedText.length &&  _offset + 1 > splittedText.at(row-1).length) {
    _offset -= splittedText.at(row-1).length + 1;
    ++row;
  }

  return {
    row,
    column: _offset + 2
  };
};

let oldDecorations = [];

const insertText = (pos: number, str: string, editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
  // This is only where cursor points.
  // editor.trigger('keyboard', 'type', { text: str });
  
  // Now this is real hacking
  const range = new monaco.Range(1, pos, 1, pos);
  const id = { major: 1, minor: 1 };
  const op = {
    indentifier: id,
    range: range,
    text: str,
    forceMoveMakers: true
  };
  editor.executeEdits('my-source', [op]);
};

const LatexTextArea = (props: Props) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<Monaco>(null);
  
  const [position, setPosition] = useState<CursorPosition>({ row: 1, column: 1 });

  useEffect(() => {
    loader.init().then(monaco => {
      monaco.languages.register({ id: 'latex' });
      monaco.languages.setMonarchTokensProvider('latex', LatexGrammar);
    });
  }, []);

  useEffect(() => {
    const offset = convert_position_offset(props.text, position);
    props.onCursorPositionChange(offset);
  }, [position]);
  
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const newDecorations = [];
      props.cursorsPositions.forEach((offset: number, clientId: string) => {
        if (clientId !== props.clientId) {
          const position = convert_offset_position(props.text, offset);
          newDecorations.push({
            range: new monacoRef.current.Range(position.row, position.column, position.row, position.column + 1),
            options: { className: styles.customCursor }
          });
        }
      });

      editorRef.current.removeDecorations(oldDecorations);
      oldDecorations = editorRef.current.deltaDecorations([], newDecorations);
    }
  }, [props.cursorsPositions]);
  
  const handleCursorPositionChange = (e: editor.ICursorPositionChangedEvent) => {
    setPosition({ row: e.position.lineNumber, column: e.position.column });
  };

  const handleTextChange = (value: string, e: editor.IModelContentChangedEvent) => {
    console.log(e);
    props.onTextChange(value);
  };

  const onEditorMount = (editorL: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorL.onDidChangeCursorPosition(handleCursorPositionChange);
    editorRef.current = editorL;
    monacoRef.current = monaco;

    setTimeout(function(){ insertText(5, "AAA", editorRef.current, monacoRef.current)}, 2000);

    editorL.getSupportedActions().forEach((val: editor.IEditorAction) => {
        console.log(val);
    });
  };

  return (
    <div className={styles.latexTextArea}
      data-testid={props.testId}>
      <Editor
        onChange={handleTextChange}
        onMount={onEditorMount}
        language='latex'
        defaultLanguage='latex'
        theme='vs-dark'
        options={{
          minimap: {
            enabled: false
          }
        }}
        value={props.text}
      />
    </div>
  );
};

export default LatexTextArea;
