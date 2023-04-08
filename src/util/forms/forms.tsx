import { useState } from 'react';

export type InputType = string | number;

export interface Field {
  initialValue: InputType,
  validator: (val: InputType, state?: FormState) => boolean
}

export type FormDefinition = Map<string, Field>;

export interface FieldState {
  value: InputType,
  touched: boolean,
  isValid: boolean
}

export type FormState = Map<string, FieldState>;

export const useForm = (formDefinition: FormDefinition) => {
  const [formState, setFormState] = useState<FormState>(new Map( 
    Array.from(formDefinition).map(([name, field]) => [name, {
      value: field.initialValue,
      touched: false,
      isValid: field.validator(field.initialValue, undefined)
    }])
  ));

  const isFormValid = () => {
    Array.from(formState.keys()).forEach((fieldName) => onFieldTouch(fieldName));

    return !Array.from(formState.values())
      .map((state: FieldState) => state.isValid)
      .includes(false);
  };

  const isInErrorState = (fieldName: string): boolean => 
    formState.get(fieldName).touched && !formState.get(fieldName).isValid;

  const onFieldTouch = (fieldName: string) => {
    const { value } = formState.get(fieldName);
    setFormState(new Map(formState.set(fieldName, {
      value: value,
      touched: true,
      isValid: formDefinition.get(fieldName).validator(value, formState)
    })));
  };

  const onFieldValueChange = (fieldName: string, newValue: string) => {
    setFormState(new Map(formState.set(fieldName, {
      value: newValue,
      touched: true,
      isValid: formDefinition.get(fieldName).validator(newValue, formState)
    })));
  };

  return { formState, isFormValid, isInErrorState, onFieldTouch, onFieldValueChange };
};
