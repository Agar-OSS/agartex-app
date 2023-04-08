import { ChangeEvent, useState } from 'react';

import styles from './TextInput.module.less';

interface Props {
  initialValue: string,
  placeholder: string,
  type: string,
  onChange: (val: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  isValid: boolean,
  errorMessage: string,
  ariaLabel: string,
  testId: string
}

const TextInput = (props: Props) => {
  const [value, setValue] = useState<string>(props.initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange(newValue);
  };

  const handleFocusChange = (newFocus: boolean) => {
    setIsFocused(newFocus);
    if (newFocus && props.onFocus) props.onFocus();
    if (!newFocus && props.onBlur) props.onBlur();
  };

  return (
    <div className={styles.agarTextInputContainer}>
      <input
        className={props.isValid ? styles.agarTextInput : styles.agarTextInputError}
        aria-label={props.ariaLabel}
        data-testid={props.testId}
        type={props.type}
        placeholder={props.placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
      />
      { !props.isValid && !isFocused && <div className={styles.errorMessage}>{props.errorMessage}</div> }
    </div>
  );
};

export default TextInput;
