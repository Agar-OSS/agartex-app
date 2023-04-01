interface StringValidationRules {
  nonEmpty?: boolean,
  minLength?: number,
  maxLength?: number
}

export const validateString = (string: string, rules: StringValidationRules) => {
  if (rules.nonEmpty && string.length === 0) return false;
  if (rules.minLength && rules.minLength > string.length) return false;
  if (rules.maxLength && rules.maxLength < string.length) return false;
  return true;
};
