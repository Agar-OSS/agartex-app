/* These rules match the requirements in agartex-service. */
export const EMAIL_VALIDATION_RULES = {
  /* regex source: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address */
  regexp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
};

/* These rules match the requirements in agartex-service. */
export const PASSWORD_VALIDATION_RULES = {
  minLength: 8,
  maxLength: 32,
  minAlphaLowerCaseChars: 1,
  minAlphaUpperCaseChars: 1,
  minNumbericalChars: 1,
  minSpecialChars: 1
};
