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

  it('should return true if all requirements are met', () => {
    expect(validateString('abc', { 
      nonEmpty: true, minLength: 2, maxLength: 3, regexp: /a.c/ 
    })).toBe(true);
  });
});
