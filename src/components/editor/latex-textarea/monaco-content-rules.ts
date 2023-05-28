import { IKeyboardEvent } from 'monaco-editor';
import { arrayRange } from 'util/poly/poly';

const legalKeys = [
  'Backspace',
  'Enter',
  'Tab',
  ...arrayRange(32, 126) 
];

const ctrlKeysToIgnore = [
  's'
];

const keysToIgnore = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft'
];

const keyToValue = new Map<string, string>([
  ...arrayRange(32, 126)
    .map((code: number): string => String.fromCharCode(code))
    .map((char: string): [string, string] => [ char, char ]),
  [ 'Enter', '\n' ],
  [ 'Tab', '\t' ]
]);

export const isCharacterKey = (key: string | null | undefined): boolean => {
  return key && (legalKeys.includes(
    (key.length === 1) ? key.charCodeAt(0) : key
  ));
};

export const isKeyboardEventToIgnore = (e: IKeyboardEvent): boolean => {
  const key: string = e.browserEvent?.key;
  const isCtrl = !!e.browserEvent?.ctrlKey;

  if (isCtrl) {
    return ctrlKeysToIgnore.includes(key);
  } else if (!isCtrl) {
    return keysToIgnore.includes(key);
  }
};

export const getKeyValue = (key: string): string | undefined => {
  return keyToValue.get(key);
};

