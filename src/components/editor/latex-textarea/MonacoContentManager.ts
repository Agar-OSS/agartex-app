import { Character } from 'pages/main/collaboration/reducer/model';
import { Delta } from 'pages/main/collaboration/delta-queue/delta-queue';
import { Monaco } from '@monaco-editor/react';
import { MutableRefObject } from 'react';
import { Selection } from 'monaco-editor';
import { arrayRange } from 'util/poly/poly';
import { cloneDeep } from 'lodash';

export interface CursorPosition {
  row: number,
  column: number
}

export class MonacoContentManager {
  document: Character[];
  undeletedDocument: Character[];
  text: string;
  
  public constructor(initDocument: Character[]) {
    this.setInitDocument(initDocument);
  }

  public setInitDocument(initDocument: Character[]): void {
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
  
  public createDeltas(
    selection: Selection,
    insertedText: string,
    isBackspace: boolean,
    generateCharacter: (val: string) => Character
  ) : Delta[] {
    // Trim inserted text to prevent Ulysses pasting incident.
    insertedText = (insertedText.length > 24) ? 
      insertedText.substring(0, 24) : insertedText;
    
    // Create deltas for removing all characters in the selection.
    const { 
      startColumn,
      startLineNumber: startRow,
      endColumn,
      endLineNumber: endRow
    } = selection;
    
    const offset = this.positionToOffset({row: startRow, column: startColumn});
    const deleteEndOffset = this.positionToOffset({row: endRow, column: endColumn});
    const deleteStartOffset = (offset === deleteEndOffset && isBackspace) ? offset-1 : offset; 
    
    const deltas = arrayRange(deleteStartOffset + 1, deleteEndOffset).map(
      offset => this.createDeltaForRemoval(offset))
      .reverse();
    
    // Create deltas for inserting characters.
    let prevId = (offset !== -1) ? this.undeletedDocument.at(offset).id : null;
    
    insertedText.split('').forEach((c: string) => {
      const newChar = generateCharacter(c);

      deltas.push({
        position: prevId,
        isBackspace: false,
        char: newChar
      });

      prevId = newChar.id;
    });
  
    return deltas;
  }

  public createDeltaForRemoval(offset: number): Delta | undefined {
    const charId = (offset !== -1) ? this.undeletedDocument.at(offset).id : null;
    
    return (charId) ? {
      position: charId,
      isBackspace: true,
      char: null
    } : undefined;
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

