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

export type JsonFormControlValueType = string | number | boolean | Array<JsonFormControlValueType> | null;

export interface JsonFormControl {
  readonly name: string;
  readonly label: string;
  value: JsonFormControlValueType;
  readonly controlElementType: string;
  readonly children: JsonFormControl[];
  readonly childrenType: JsonFormControl | undefined;
  readonly options: JsonFormControlOptions;
  readonly validators: JsonFormValidators;
  readonly fieldType: string | undefined;
  readonly description: string | undefined;
}

export interface JsonSchemaProperty {
  type: string;
  required: string[];
  properties: { [key: string]: JsonSchemaProperty };
  title?: string;
  description?: string;
  items?: {
    type: string;
  },
  enum: string[];
  pattern?: string;
  anyOf?: unknown[];
  default?: unknown;
}

export interface JSONSchemaWithProperties {
  properties: { [key: string]: JsonSchemaProperty };
  required?: string[];
}
