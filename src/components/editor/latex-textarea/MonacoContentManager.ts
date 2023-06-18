import { Character } from 'pages/main/collaboration/reducer/model';
import { Delta } from 'pages/main/collaboration/delta-queue/delta-queue';
import { MAX_PASTE_LENGTH } from './monaco-content-rules';
import { Monaco } from '@monaco-editor/react';
import { MutableRefObject } from 'react';
import { Selection } from 'monaco-editor';
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
    this.setDocument(initDocument);
  }

  public setDocument(document: Character[]) {
    this.document = cloneDeep(document);
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
    if (offset < 0 || !this.undeletedDocument.length) { return null; }
    return this.undeletedDocument.at(Math.min(offset, this.undeletedDocument.length - 1)).id;
  }

  public getClientId(charId: string): number {
    return Number(charId.split('.')[0]);
  }
  
  public getIndexForInsertion(charId: string, prevId: string, clock: number): number {
    // Among characters with the same prevId, we sort them by clock in descending order.
    let insertIndex = (prevId) ?
      this.document.findIndex((c: Character) => c.id === prevId) + 1 : 0;
    while (insertIndex < this.document.length 
      && this.document.at(insertIndex).prevId === prevId 
      && this.document.at(insertIndex).clock >= clock
      && this.getClientId(this.document.at(insertIndex).id) < this.getClientId(charId)
    ) {
      insertIndex++;
    }
    return insertIndex;
  }

  public insertCharacters(chars?: Character[]): string {
    if (!chars || !chars.length) {
      return '';
    }
    
    const { id: charId, prevId, clock } = chars.at(0);
    const charValues = chars.map((c: Character) => c.value).join('');
    
    const documentInsertIndex = this.getIndexForInsertion(charId, prevId, clock);
    this.document.splice(documentInsertIndex, 0, ...chars);
    
    const insertOffset = this.getOffsetForCharId(prevId);
    this.undeletedDocument.splice(insertOffset + 1, 0, ...chars);
    this.text = this.text.substring(0, insertOffset + 1) + charValues + this.text.substring(insertOffset + 1);

    return charValues;
  }

  public deleteCharacters(charIds?: string[]): [number, number][] {
    if (!charIds || !charIds.length) {
      return;
    }

    const deleteRanges = [];
    let currentRangeStart = -1;
    const deletedIdsSet = new Set(charIds);

    this.undeletedDocument.forEach((c: Character, idx: number) => {
      if (currentRangeStart !== -1 && !deletedIdsSet.has(c.id)) {
        deleteRanges.push([currentRangeStart, idx-1]);
        currentRangeStart = -1;
      } else if (currentRangeStart === -1 && deletedIdsSet.has(c.id)) {
        currentRangeStart = idx;
      }
    });

    if (currentRangeStart !== -1) {
      deleteRanges.push([currentRangeStart, this.undeletedDocument.length-1]);
    }

    this.document.forEach((c: Character) => {
      if (deletedIdsSet.has(c.id)) {
        c.deleted = true;
      }
    });
    
    return deleteRanges;
  }
    
  public applyDelta(delta: Delta, monacoRef: MutableRefObject<Monaco>) {
    if (delta.insert && delta.insert.length) {
      const prevId = delta.insert.at(0).prevId;
      const insertOffset = this.getOffsetForCharId(prevId);
      const insertPosition = this.offsetToPosition(insertOffset);
      
      const range = new monacoRef.current.Range(
        insertPosition.row,
        insertPosition.column,
        insertPosition.row,
        insertPosition.column
      );

      const insertedString = this.insertCharacters(delta.insert);

      return [{
        identifier: { major: 1, minor: 1 },
        range: range,
        text: insertedString,
        forceMoveMakers: true
      }];
    } else if (delta.delete && delta.delete.length) {
      const deleteOffsetRanges = this.deleteCharacters(delta.delete);
      const monacoDeltas = [];

      deleteOffsetRanges.forEach(([start, end]) => {
        const positionOneBeforeStart = this.offsetToPosition(start - 1);
        const endPosition = this.offsetToPosition(end);
        
        const range = new monacoRef.current.Range(
          positionOneBeforeStart.row,
          positionOneBeforeStart.column,
          endPosition.row,
          endPosition.column
        );

        monacoDeltas.push({
          identifier: { major: 1, minor: 1 },
          range: range,
          text: '',
          forceMoveMakers: true
        });
      });

      this.setDocument(this.document);

      return monacoDeltas;
    }
  }
  
  public createDeltas(
    selection: Selection,
    insertedText: string,
    isBackspace: boolean,
    generateCharacter: (val: string, prevId: string) => Character | undefined
  ) : Delta[] {
    // Trim inserted text to prevent Ulysses pasting incident.
    insertedText = (insertedText.length > MAX_PASTE_LENGTH) ? 
      insertedText.substring(0, MAX_PASTE_LENGTH) : insertedText;
    
    const deltas = [];

    // Create delta for removing all characters in the selection.
    const { 
      startColumn,
      startLineNumber: startRow,
      endColumn,
      endLineNumber: endRow
    } = selection;
    
    const offset = this.positionToOffset({row: startRow, column: startColumn});
    const deleteEndOffset = this.positionToOffset({row: endRow, column: endColumn});
    const deleteStartOffset = Math.max(-1, (offset === deleteEndOffset && isBackspace) ? offset-1 : offset);

    if (deleteStartOffset < deleteEndOffset) {
      deltas.push({
        delete: 
          this.undeletedDocument
            .slice(deleteStartOffset + 1, deleteEndOffset + 1)
            .map((c: Character) => c.id)
      });
    }

    // Create deltas for inserting characters.
    let prevId = (offset !== -1) ? this.undeletedDocument.at(offset).id : null;
    const insert = [];
    insertedText.split('').forEach((c: string) => {
      const newChar = generateCharacter(c, prevId);
      insert.push(newChar);
      prevId = newChar.id;
    });

    if (insert.length) {
      deltas.push({ insert });
    }

    return deltas;
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

