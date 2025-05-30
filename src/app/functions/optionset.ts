/* eslint-disable implicit-arrow-linebreak */
import { contains, isMapOf } from 'iqbspecs-coding-service/functions/common.typeguards';
import { TaskInstructions } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {
  JsonFormControl,
  JsonSchemaProperty,
  JSONSchemaWithProperties
} from '../interfaces/optionset.interfaces';
import { isJsonFormControlValueType, isNull } from './type-guards';

const getJsonSchemaType = (prop: JsonSchemaProperty): { type: string, optional?: true } => {
  if (prop.type) return { type: prop.type };
  if (!prop.type && prop.anyOf) {
    const types = prop.anyOf
      .map((a: unknown): string => (contains(a, 'type', '') ? a.type : '<unsupported>'));
    // the only multi-type-scenario we support currently: null and a primitive type
    if ((types.length === 2) && types.includes('null') && !types.includes('<unsupported>')) {
      return { type: types.filter(type => type !== 'null')[0], optional: true };
    }
  }
  return { type: '' };
};

export const chooseControl = (prop: JsonSchemaProperty): string => {
  if (prop.enum) {
    return 'select';
  }
  switch (getJsonSchemaType(prop).type) {
    case 'string':
      return 'text';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'array':
      return 'array';
    case 'range':
      return 'range';
    default:
      return 'textarea';
  }
};

export const propertyToJsonFormControl = (id: string, prop: JsonSchemaProperty, isRequired: boolean = true): JsonFormControl =>
  setValue({
    name: id,
    label: prop.title || id,
    value: null,
    controlElementType: chooseControl(prop),
    children: [],
    childrenType: ((prop.type === 'array') && isJsonSchemaProperty(prop.items)) ? propertyToJsonFormControl(id, prop.items) : undefined,
    validators: {
      required: isRequired && !getJsonSchemaType(prop).optional,
      jsonValidate: !['number', 'boolean', 'string', 'array'].includes(prop.type),
      pattern: prop.pattern || undefined
    },
    options: {
      options: prop.enum || undefined
    },
    fieldType: getJsonSchemaType(prop).type,
    description: prop.description
  },
  isJsonFormControlValueType(prop.default) ? prop.default : null
  );

export const resolveReferences = (prop: JsonSchemaProperty, schema: JSONSchemaWithProperties): JsonSchemaProperty => {
  if (('$ref' in prop) && (typeof prop.$ref === 'string')) {
    const path: string[] = prop.$ref
      .replace(/^#\//, '')
      .split('/');
    let sel: { [key: string]: any } = schema;
    let step;
    // eslint-disable-next-line no-cond-assign
    while (step = path.shift()) {
      if (!(step in sel)) throw new Error(`Can not expand path: ${prop.$ref}`);
      if (typeof sel[step] !== 'object') throw new Error(`Can not expand path: ${prop.$ref}`);
      sel = sel[step];
    }
    if (!isJsonSchemaProperty(sel)) throw new Error(`Can not read JSONSchema property (${path}): ${sel}`);
    return sel;
  }
  return prop;
};

export const setValue = (control: JsonFormControl, value: unknown): JsonFormControl => {
  if (typeof value === 'undefined') return control;
  switch (control.fieldType) {
    case 'string':
      return {
        ...control,
        // eslint-disable-next-line no-nested-ternary
        value: (control.validators.required && !value) ? '' : (isNull(value) ? null : String(value))
      };
    case 'integer':
    case 'number':
      return {
        ...control,
        // eslint-disable-next-line no-nested-ternary
        value: (control.validators.required && !value) ? 0 : (isNull(value) ? null : Number(value))
      };
    case 'boolean':
      return { ...control, value: Boolean(value) };
    case 'array':
      // eslint-disable-next-line no-case-declarations
      const children = (!Array.isArray(value)) ? [] :
        value
          .map(v => (control.childrenType ? setValue(control.childrenType, v) : null))
          .filter(v => !!v);
      return {
        ...control,
        children,
        value: children.map(child => child.value)
      };
    default:
      return { ...control, value: JSON.stringify(value) };
  }
};

export const JSONSchemaToJSONForms = (schema: unknown, values: TaskInstructions): JsonFormControl[] =>
  (isSchemaWithProperties(schema) ?
    Object.entries(schema.properties)
      .map(([id, prop]: [string, JsonSchemaProperty]): [string, JsonSchemaProperty] =>
        ([id, resolveReferences(prop, schema)])
      )
      .map(([id, prop]: [string, JsonSchemaProperty]): JsonFormControl =>
        propertyToJsonFormControl(id, prop, (schema.required || []).includes(id))
      )
      .map(
        control => setValue(control, values[control.name])
      ) :
    []);

const getValue = (control: JsonFormControl): unknown => {
  if (!control.validators.required && control.value == null) return null;
  switch (control.fieldType) {
    case 'string':
      return String(control.value);
    case 'number':
    case 'integer':
      return Number(control.value);
    case 'boolean':
      return Number(control.value);
    case 'array':
      return control.children.map(getValue);
    default:
      try {
        return JSON.parse((typeof control.value === 'string') ? control.value : '"error"');
      } catch (e) {
        console.error(e);
        return '';
      }
  }
};

export const getValues = (controls: JsonFormControl[]): object => {
  const fd: { [key: string]: unknown } = {};
  controls
    .forEach(control => {
      fd[control.name] = getValue(control);
    });
  return fd;
};

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
