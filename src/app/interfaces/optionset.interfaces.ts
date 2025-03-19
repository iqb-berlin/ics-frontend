import { JSONSchema7TypeName } from 'json-schema';

export interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  nullValidator?: boolean;
  jsonValidate?: boolean;
}

export interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
  options?: string[];
}

export interface JsonFormControl {
  name: string;
  label: string;
  value: string | number | boolean;
  type: string;
  options?: JsonFormControlOptions;
  required?: boolean;
  validators: JsonFormValidators;
  originalType: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
}

