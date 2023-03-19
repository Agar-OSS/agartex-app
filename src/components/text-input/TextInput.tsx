import { ChangeEvent, useState } from 'react';

interface Props {
    initialValue: string,
    placeholder: string,
    type: string,
    onChange: (val: string) => void
}

const TextInput = (props: Props) => {
  const [value, setValue] = useState(props.initialValue);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange(newValue);
  };

  return (
    <input 
      type={props.type}
      placeholder={props.placeholder}
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default TextInput;
