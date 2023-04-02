interface StringValidationRules {
  nonEmpty?: boolean,
  minLength?: number,
  maxLength?: number,
  regexp?: RegExp
}

export const validateString = (string: string, rules: StringValidationRules) => {
  if (!string) return false;
  if (rules.nonEmpty && string.length === 0) return false;
  if (rules.minLength && rules.minLength > string.length) return false;
  if (rules.maxLength && rules.maxLength < string.length) return false;
  if (rules.regexp && !rules.regexp.test(string)) return false;
  return true;
};
