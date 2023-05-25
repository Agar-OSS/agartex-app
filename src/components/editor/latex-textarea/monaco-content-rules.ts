import { arrayRange } from 'util/poly/poly';

const legalKeys = [
  'Backspace',
  'Enter',
  'Tab',
  ...arrayRange(32, 126) 
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

export const isKeyToIgnore = (key: string | null | undefined): boolean => {
  return key && keysToIgnore.includes(key);
};

export const getKeyValue = (key: string): string | undefined => {
  return keyToValue.get(key);
};

