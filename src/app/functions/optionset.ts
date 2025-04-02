import {
  JsonFormControl,
  JsonFormControlValueType,
  JsonSchemaProperty,
  JSONSchemaWithProperties
} from '../interfaces/optionset.interfaces';
import { isMapOf } from '../interfaces/iqb.interfaces';
import { TaskInstructions } from '../interfaces/api.interfaces';

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

export const propertyToJsonFormControl = (id: string, prop: JsonSchemaProperty, isRequired: boolean = true, value: unknown = undefined): JsonFormControl => ({
  name: id,
  label: prop.title || id,
  value: null,
  controlElementType: chooseControl(prop),
  children: [],
  childrenType: ((prop.type === 'array') && isJsonSchemaProperty(prop.items)) ? propertyToJsonFormControl(id, prop.items) : undefined,
  validators: {
    required: isRequired,
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

export const setValue = (control: JsonFormControl, value: unknown): JsonFormControl => {
  switch (control.fieldType) {
    case 'string': return {...control, value: value ? String(value) : '' };
    case 'number': return {...control, value: value ? Number(value) : 0 };
    case 'boolean': return {...control, value: Boolean(value) };
    case 'array':
      const children = (!Array.isArray(value)) ? [] :
        value
          .map(v => control.childrenType ? setValue(control.childrenType, v) : null)
          .filter(v => !!v);
      return {
        ...control,
        children,
        value: children.map(child => child.value)
      };
    default: return {...control, value: JSON.stringify(value) };
  }
}

export const JSONSchemaToJSONForms = (schema: unknown, values: TaskInstructions): JsonFormControl[] =>
  isSchemaWithProperties(schema) ?
    Object.entries(schema.properties)
      .map(([id, prop]: [string, JsonSchemaProperty]): [string, JsonSchemaProperty] =>
        ([id, resolveReferences(prop, schema)])
      )
      .map(([id, prop]: [string, JsonSchemaProperty]): JsonFormControl =>
        propertyToJsonFormControl(id, prop, (schema.required || []).includes(id), values[id])
      )
      .map(
        control => setValue(control, values[control.name])
      )
    : [];

const getValue = (control: JsonFormControl): unknown => {
  switch (control.fieldType) {
    case 'string': return String(control.value);
    case 'number': return Number(control.value);
    case 'boolean': return Number(control.value);
    case 'array': return control.children.map(getValue);
    default: try {
      return JSON.parse((typeof control.value === 'string') ? control.value : '"error"')
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}

export const getValues = (controls: JsonFormControl[]): object => {
  const fd: { [key: string]: unknown } = {};
  controls
    .forEach(control => {
      fd[control.name] = getValue(control);
    });
  return fd;
}

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
