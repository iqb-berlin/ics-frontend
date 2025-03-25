import {
  JsonFormControl,
  JsonFormControlValueType,
  JsonSchemaProperty,
  JSONSchemaWithProperties
} from '../interfaces/optionset.interfaces';
import { isMapOf } from '../interfaces/iqb.interfaces';

export const chooseControl = (prop: JsonSchemaProperty): string => {
  if (prop.enum) {
    return 'select';
  }
  switch (prop.type) {
    case 'string': return 'text';
    case 'number': return 'number';
    case 'boolean': return 'checkbox';
    case 'array': return 'array';
  }
  return 'textarea';
}

export const convertValue = (value: unknown, propType: string): JsonFormControlValueType => {
  switch (propType) {
    case 'string': return value ? String(value) : '';
    case 'number': return value ? Number(value) : 0;
    case 'boolean': return Boolean(value);
    case 'array': return [];
    default: return JSON.stringify(value);
  }
}

export const propertyToJsonFormControl = (id: string, prop: JsonSchemaProperty, value: unknown): JsonFormControl => ({
  name: id,
  label: prop.title || id,
  value: convertValue(value, prop.type),
  controlElementType: chooseControl(prop),
  childrenType:
    (prop.type === 'array') && (typeof prop.items === 'object') && (isJsonSchemaProperty(prop.items)) ?
      propertyToJsonFormControl(id, prop.items, value) :
      undefined,
  validators: {
    required: prop.required?.includes(id) || false,
    jsonValidate: !['number', 'boolean', 'string', 'array'].includes(prop.type),
    pattern: prop.pattern || undefined,
  },
  options: {
    options: prop.enum || undefined,
  },
  fieldType: prop.type
});

export const resolveReferences = (prop: JsonSchemaProperty, schema: JSONSchemaWithProperties): JsonSchemaProperty => {
  if (('$ref' in prop) && (typeof prop.$ref === 'string')) {
    const path: string[] = prop.$ref
      .replace(/^#\//, '')
      .split('/');
    let sel: { [key: string]: any } = schema;
    let step;
    while (step = path.shift()) {
      if (!(step in sel)) throw new Error(`Can not expand path: ${prop.$ref}`);
      if (typeof sel[step] !== 'object') throw new Error(`Can not expand path: ${prop.$ref}`);
      sel = sel[step];
    }
    if (!isJsonSchemaProperty(sel)) throw `Can not read JSONSchema property (${path}): ${sel}`;
    return sel;
  }
  return prop;
}

export const JSONSchemaToJSONForms = (schema: unknown, values: {[key: string]: string}): JsonFormControl[] =>
  isSchemaWithProperties(schema) ?
    Object.entries(schema.properties)
      .map(([id, prop]: [string, JsonSchemaProperty]): [string, JsonSchemaProperty] => ([id, resolveReferences(prop, schema)]))
      .map(([id, prop]: [string, JsonSchemaProperty]): JsonFormControl => propertyToJsonFormControl(id, prop, values[id])) :
    [];

export const isSchemaWithProperties = (thing: unknown): thing is JSONSchemaWithProperties =>
  (typeof thing === 'object') &&
  (thing != null) &&
  ('properties' in thing) &&
  (typeof thing.properties === 'object') &&
  (thing.properties != null) &&
  isMapOf<JsonSchemaProperty>(thing.properties, isJsonSchemaProperty);

export const isJsonSchemaProperty = (thing: unknown): thing is JsonSchemaProperty =>
  (typeof thing === 'object') &&
  (thing != null);
