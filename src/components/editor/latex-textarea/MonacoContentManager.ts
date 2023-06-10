import { Character } from 'pages/main/collaboration/reducer/model';
import { Delta } from 'pages/main/collaboration/delta-queue/delta-queue';
import { Monaco } from '@monaco-editor/react';
import { MutableRefObject } from 'react';
import { cloneDeep } from 'lodash';
import { editor } from 'monaco-editor';
import { getKeyValue } from './monaco-content-rules';

export interface CursorPosition {
  row: number,
  column: number
}

export class MonacoContentManager {
  document: Character[];
  undeletedDocument: Character[];
  text: string;
  
  public constructor(initDocument: Character[]) {
    this.document = cloneDeep(initDocument);
    this.undeletedDocument = this.document.filter((c: Character) => !c.deleted);
    this.text = this.undeletedDocument.map((c: Character) => c.value).join('');
  }
  
  public getText(): string { 
    return cloneDeep(this.text);
  }

  public getOffsetForCharId(charId: string | null) {
    const charIndex = this.document.findIndex((c: Character) => c.id === charId);

    return this.document
      .filter((char: Character, idx: number) => idx <= charIndex && !char.deleted)
      .length - 1;
  }

  public getCharIdForOffset(offset: number): string | null {
    return (offset === -1) ? null : this.undeletedDocument.at(offset).id;
  }

  public insertCharacter(prevId: string, offset: number, char: Character) {
    const insertIndex = (prevId) ?
      this.document.findIndex((c: Character) => c.id === prevId) + 1 : 0;

    this.document.splice(insertIndex, 0, char);
    this.undeletedDocument.splice(offset + 1, 0, char);
    this.text = this.text.substring(0, offset + 1) + char.value + this.text.substring(offset + 1);
  }

  public deleteCharacter(charId: string, offset: number) {
    this.document = this.document
      .map((c: Character) => (c.id === charId) ? { ...c, deleted: true } : c);
    this.undeletedDocument.splice(offset, 1);
    this.text = this.text.substring(0, offset) + this.text.substring(offset + 1);
  }
    
  public applyDelta(delta: Delta, monacoRef: MutableRefObject<Monaco>) { 
    const insertOffset = this.getOffsetForCharId(delta.position);
    const insertPosition = this.offsetToPosition(insertOffset);
    let range = null;

    if (delta.isBackspace && delta.position && insertOffset !== -1) {
      const insertPositionOneBefore = this.offsetToPosition(insertOffset - 1);

      range = new monacoRef.current.Range(
        insertPositionOneBefore.row,
        insertPositionOneBefore.column,
        insertPosition.row,
        insertPosition.column
      );

      this.deleteCharacter(delta.position, insertOffset);

    } else if (!delta.isBackspace) {
      range = new monacoRef.current.Range(
        insertPosition.row,
        insertPosition.column,
        insertPosition.row,
        insertPosition.column
      );

      this.insertCharacter(delta.position, insertOffset, delta.char);
    }

    return {
      identifier: { major: 1, minor: 1 },
      range: range,
      text: (delta.isBackspace) ? '' : delta.char.value,
      forceMoveMakers: true
    };
  }

  public createDelta(
    key: string, 
    editorRef: MutableRefObject<editor.IStandaloneCodeEditor>, 
    generateCharacter: (val: string) => Character
  ): Delta | undefined {
    const { lineNumber: row, column } = editorRef.current.getPosition();
    const currentOffset = this.positionToOffset({row, column});
    const prevId = (currentOffset !== -1) ? this.undeletedDocument.at(currentOffset).id : null;
    
    if (key === 'Backspace' && !prevId) { 
      return undefined;
    }

    const delta: Delta = 
      (key == 'Backspace') ? 
        {
          position: prevId,
          isBackspace: true,
          char: null
        } : {
          position: prevId,
          isBackspace: false,
          char: generateCharacter(getKeyValue(key))
        };

    return delta;
  }

  public positionToOffset(position: CursorPosition): number {
    return this.text
      .split('\n')
      .slice(0, position.row-1)
      .reduce((sum: number, line: string) => sum + line.length + 1, 0)
    + position.column - 2;
  }

  public offsetToPosition(offset: number): CursorPosition {
    const splittedText = this.text.split('\n');
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
  }
}

