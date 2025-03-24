import { JSONSchema7TypeName } from 'json-schema';
import { isA, isArrayOf } from './iqb.interfaces';

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

export type JsonFormControlValueType = string | number | boolean | string[] | number[];

export interface JsonFormControl {
  name: string;
  label: string;
  value: JsonFormControlValueType;
  type: string;
  arrayType?: JsonFormControl | undefined;
  options?: JsonFormControlOptions;
  required?: boolean;
  validators: JsonFormValidators;
  originalType?: string | undefined;
}

export interface JsonSchemaProperty {
  type: string;
  required: string[];
  properties: JsonSchemaProperty[];
  title?: string;
  items?: {
    type: string;
  },
  enum: string[];
  pattern?: string;
}

export const isJsonSchemaProperty = (thing: unknown): thing is JsonSchemaProperty => {
  if ((typeof thing !== 'object') || (thing == null)) throw 'invalid schema';
  if (!('type' in thing)) throw 'Property "type" is required';
  if (thing.type !== 'object') throw 'Property "type" is required';
  const required = (('required' in thing) && (Array.isArray(thing.required))) ? thing.required : [];
  if (!('properties' in thing)) throw 'Property "properties" is required';
  if ((typeof thing.properties !== 'object') || (thing.properties == null)) throw 'Property "properties" mus be array';
  if (!isArrayOf<JsonSchemaProperty>(thing.properties, isJsonSchemaProperty)) throw `Invalid Property`;
  return true;
}
