import { isArrayOf } from './iqb.interfaces';

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

export type JsonFormControlValueType = string | number | boolean | Array<string | number | boolean>;

export interface JsonFormControl {
  readonly name: string;
  readonly label: string;
  value: JsonFormControlValueType;
  readonly controlElementType: string;
  readonly children: JsonFormControl[];
  readonly childrenType: JsonFormControl | undefined;
  readonly options: JsonFormControlOptions;
  readonly required: boolean;
  readonly validators: JsonFormValidators;
  readonly fieldType: string | undefined;
}

export interface JsonSchemaProperty {
  type: string;
  required: string[];
  properties: { [key: string]: JsonSchemaProperty };
  title?: string;
  items?: {
    type: string;
  },
  enum: string[];
  pattern?: string;
}

export interface JSONSchemaWithProperties {
  properties: { [key: string]: JsonSchemaProperty }
}
