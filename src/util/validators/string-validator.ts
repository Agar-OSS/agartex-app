interface StringValidationRules {
  nonEmpty?: boolean,
  minLength?: number,
  maxLength?: number,
  regexp?: RegExp,
  minAlphaLowerCaseChars?: number,
  minAlphaUpperCaseChars?: number,
  minNumericalChars?: number,
  minSpecialChars?: number
}

const alphaLowerCaseChars = Array.from('abcdefghijklmnopqrstuvwxyz');
const alphaUpperCaseChars = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const numbericalChars = Array.from('1234567890');
const specialChars = Array.from('!@#$%^&*}');

export const validateString = (string: string | null | undefined, rules: StringValidationRules) => {
  if (string === null || string === undefined) return false;
  if (rules.nonEmpty && string.length === 0) return false;
  if (rules.minLength && rules.minLength > string.length) return false;
  if (rules.maxLength && rules.maxLength < string.length) return false;
  if (rules.regexp && !rules.regexp.test(string)) return false;
  if (rules.minAlphaLowerCaseChars && 
    Array.from(string).filter(c => alphaLowerCaseChars.includes(c)).length < rules.minAlphaLowerCaseChars) return false;
  if (rules.minAlphaUpperCaseChars &&
    Array.from(string).filter(c => alphaUpperCaseChars.includes(c)).length < rules.minAlphaUpperCaseChars) return false;
  if (rules.minNumericalChars && 
    Array.from(string).filter(c => numbericalChars.includes(c)).length < rules.minNumericalChars) return false;
  if (rules.minSpecialChars && 
    Array.from(string).filter(c => specialChars.includes(c)).length < rules.minSpecialChars) return false;
  return true;
};
