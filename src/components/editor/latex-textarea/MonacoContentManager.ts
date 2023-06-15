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
    // console.log('getCharIdForOffset(' + offset + ')');
    // console.log(JSON.stringify(this.undeletedDocument));
    if (offset < 0 || !this.undeletedDocument.length) { return null; }
    return this.undeletedDocument.at(Math.min(offset, this.undeletedDocument.length - 1)).id;
  }

  public insertCharacter(prevId: string, offset: number, char: Character) {
    const insertIndex = (prevId) ?
      this.document.findIndex((c: Character) => c.id === prevId) + 1 : 0;
    
    this.document.splice(insertIndex, 0, char);
    this.undeletedDocument.splice(offset + 1, 0, char);
    this.text = this.text.substring(0, offset + 1) + char.value + this.text.substring(offset + 1);
  }
  
  public insertCharacters(chars?: Character[]): string {
    if (!chars || !chars.length) {
      return '';
    }
    
    const prevId = chars.at(0).prevId;
    const charValues = chars.map((c: Character) => c.value).join('');

    const documentInsertIndex = (prevId) ?
      this.document.findIndex((c: Character) => c.id === prevId) + 1 : 0;
    this.document.splice(documentInsertIndex, 0, ...chars);
    
    const insertOffset = this.getOffsetForCharId(prevId);
    this.undeletedDocument.splice(insertOffset + 1, 0, ...chars);
    this.text = this.text.substring(0, insertOffset + 1) + charValues + this.text.substring(insertOffset + 1);

    return charValues;
  }

  public deleteCharacter(charId: string, offset: number) {
    this.document = this.document
      .map((c: Character) => (c.id === charId) ? { ...c, deleted: true } : c);
    this.undeletedDocument.splice(offset, 1);
    this.text = this.text.substring(0, offset) + this.text.substring(offset + 1);
  }

  public deleteCharacters(charIds?: string[]): [number, number][] {
    if (!charIds || !charIds.length) {
      return;
    }

    let charIdsIdx = 0;
    const deleteRanges = [];
    let currentRangeStart = -1;

    this.undeletedDocument.forEach((c: Character, idx: number) => {

      const closeCurrentRange = 
        currentRangeStart !== -1 && (
          charIdsIdx >= charIds.length 
          || c.deleted 
          || (!c.deleted && c.id !== charIds.at(charIdsIdx))
        );

      if (closeCurrentRange) {
        deleteRanges.push([currentRangeStart, idx-1]);
        currentRangeStart = -1;
      } else if (charIdsIdx < charIds.length && !c.deleted && c.id === charIds.at(charIdsIdx)) {
        ++charIdsIdx;
        if (currentRangeStart === -1) {
          currentRangeStart = idx;
        }
      }
    });

    if (currentRangeStart !== -1) {
      deleteRanges.push([currentRangeStart, this.undeletedDocument.length-1]);
    }

    charIdsIdx = 0;
    this.document.forEach((c: Character) => {
      if (c.id === charIds.at(charIdsIdx)) {
        c.deleted = true;
        ++charIdsIdx;
      }
    });
    
    return deleteRanges;
  }
    
  public applyDelta(delta: Delta, monacoRef: MutableRefObject<Monaco>) {

    console.log('APPLY DELTA');
    console.log(delta);

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
      
      console.log('deleteOffsetRanges');
      console.log(deleteOffsetRanges);

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

    /*const insertOffset = this.getOffsetForCharId(delta.position);
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
    };*/
  }
  
  public createDeltas(
    selection: Selection,
    insertedText: string,
    isBackspace: boolean,
    generateCharacter: (val: string, prevId: string) => Character | undefined
  ) : Delta[] {
    // Trim inserted text to prevent Ulysses pasting incident.
    insertedText = (insertedText.length > 24) ? 
      insertedText.substring(0, 24) : insertedText;
    
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
      })
    }

    /* arrayRange(deleteStartOffset + 1, deleteEndOffset).map(
      offset => this.createDeltaForRemoval(offset))
      .reverse(); */
    
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

    /* insertedText.split('').forEach((c: string) => {
      const newChar = generateCharacter(c);

      deltas.push({
        position: prevId,
        isBackspace: false,
        char: newChar
      });

      prevId = newChar.id;
    }); */
  
    return deltas;
  }

  /* public createDeltaForRemoval(offset: number): Delta | undefined {
    const charId = (offset !== -1) ? this.undeletedDocument.at(offset).id : null;
    
    return (charId) ? {
      position: charId,
      isBackspace: true,
      char: null
    } : undefined;
  }*/

  public positionToOffset(position: CursorPosition): number {
    return this.text
      .split('\n')
      .slice(0, position.row-1)
      .reduce((sum: number, line: string) => sum + line.length + 1, 0)
    + position.column - 2;
  }

  public offsetToPosition(offset: number): CursorPosition {
    console.log('OFFSET_TO_POSITION');
    console.log(this.text);
    console.log(offset);

    const splittedText = this.text.split('\n');
    let row = 1;
    let _offset = offset;

    while (row-1 < splittedText.length &&  _offset + 1 > splittedText.at(row-1).length) {
      _offset -= splittedText.at(row-1).length + 1;
      ++row;
    }
    
    console.log(JSON.stringify({ row, column: _offset+2 }));

    return {
      row,
      column: _offset + 2
    };
  }
}

