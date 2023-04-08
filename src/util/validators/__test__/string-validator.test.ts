import { validateString } from '../string-validator';

describe('string-validator', () => {
  it('should return false if nonEmpty rule is true and string is empty', () => {
    expect(validateString('', { nonEmpty: true })).toBe(false);
  });

  it('should return false if minLength rule is true and string is too short', () => {
    expect(validateString('ab', { minLength: 3 })).toBe(false);
  });

  it('should return false if maxLength rule is true and string is too long', () => {
    expect(validateString('abcd', { maxLength: 3 })).toBe(false);
  });

  it('should return false if string does not match the regex', () => {
    expect(validateString('steve', { regexp: /a.c/ })).toBe(false);
  });

  it('should return false if string has too few lower case alphabetical characters', () => {
    expect(validateString('aBc#123', { minAlphaLowerCaseChars: 3})).toBe(false);
  });

  it('should return false if string has too few upper case alphabetical characters', () => {
    expect(validateString('aBc#123', { minAlphaUpperCaseChars: 2})).toBe(false);
  });

  it('should return false if string has too few numerical characters', () => {
    expect(validateString('aBc#123', { minNumericalChars: 4})).toBe(false);
  });

  it('should return false if string has too few special characters', () => {
    expect(validateString('aBc#123', { minSpecialChars: 2})).toBe(false);
  });

  it('should return true if all requirements are met', () => {
    expect(validateString('2a3bc!D#3', { 
      nonEmpty: true, 
      minLength: 9, 
      maxLength: 10, 
      regexp: /^.a.bc![D-E]{1}#.$/,
      minAlphaLowerCaseChars: 3,
      minAlphaUpperCaseChars: 1,
      minNumericalChars: 3,
      minSpecialChars: 2
    })).toBe(true);
  });
});
