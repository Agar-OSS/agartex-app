import { ChangeEvent, useState } from 'react';

import styles from './FileInput.module.less';

interface Props {
  className?: string,
  accept?: string,
  onChange: (val: File) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  isValid?: boolean,
  errorMessage?: string,
  ariaLabel: string,
  testId: string
}

const FileInput = (props: Props) => {
  const [, setValue] = useState<File>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.files[0];
    setValue(newValue);
    props.onChange(newValue);
  };

  const handleFocusChange = (newFocus: boolean) => {
    setIsFocused(newFocus);
    if (newFocus && props.onFocus) props.onFocus();
    if (!newFocus && props.onBlur) props.onBlur();
  };

  return (
    <div className={styles.agarFileInputContainer}>
      <input
        className={`${props.isValid ? styles.agarFileInput : styles.agarFileInputError} ${props.className}`}
        aria-label={props.ariaLabel}
        data-testid={props.testId}
        type='file'
        accept={props.accept ?? '*'}
        onChange={handleInputChange}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
      />
      { !props.isValid && !isFocused && <div className={styles.errorMessage}>{props.errorMessage}</div> }
    </div>
  );
};

export default FileInput;
