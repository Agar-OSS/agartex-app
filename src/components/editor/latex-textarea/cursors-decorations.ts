import { MutableRefObject, useEffect, useRef } from 'react';

import { COLORS } from '@constants';
import { Monaco } from '@monaco-editor/react';
import { MonacoContentManager } from './MonacoContentManager';
import { editor } from 'monaco-editor';
import styles from './LatexTextArea.module.less';

export const useCursorsDecorations = (
  clientId: string,
  cursorsPositions: Map<string, string>,
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor>,
  monacoRef: MutableRefObject<Monaco>,
  managerRef: MutableRefObject<MonacoContentManager>
) => {
  const oldDecorationsIds = useRef<string[]>([]);
  const cmap = new Map<string, string>();
  
  useEffect(() => {
    if (managerRef.current && editorRef.current && monacoRef.current) {
      const newDecorations = [];
      cursorsPositions.forEach((charId: string | null, oClientId: string) => {
        if (clientId !== oClientId) {
          if (!cmap.has(oClientId)) {
            cmap.set(oClientId, COLORS[cmap.size % COLORS.length]);
          }

          const color = cmap.get(oClientId);
          console.log(color);
          const offset = managerRef.current.getOffsetForCharId(charId);
          const position = managerRef.current.offsetToPosition(offset);
          newDecorations.push({
            range: new monacoRef.current.Range(position.row, position.column, position.row, position.column + 1),
            options: { className: `${styles.customCursor} ${color}` }
          });
        }
      });

      editorRef.current.removeDecorations(oldDecorationsIds.current);
      oldDecorationsIds.current = editorRef.current.deltaDecorations([], newDecorations);
    }
  }, [cursorsPositions, managerRef.current, monacoRef.current, editorRef.current, clientId]);

  return {};
};

