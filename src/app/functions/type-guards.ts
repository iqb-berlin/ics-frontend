import { AppConfig, Service } from '../interfaces/interfaces';
import { isArrayOf, isMapOf } from 'iqbspecs-coding-service/functions/common.typeguards';
import { JsonFormControlValueType } from '../interfaces/optionset.interfaces';

export const isArrayOfSameShapedObjects = <T extends object>(thing: unknown): thing is T[] => {
  if (!Array.isArray(thing)) return false;

  return thing
    .every(item =>
      (typeof item === 'object') &&
      (item !== null) &&
      !Array.isArray(item) &&
      (Object.keys(item).length === Object.keys(thing[0]).length) &&
      Object.keys(item).every(key => key in thing[0])
  );
}

export const isService = (thing: unknown): thing is Service =>
  (typeof thing === 'object') && (thing !== null) &&
  ('name' in thing) && (typeof thing.name === 'string') &&
  ('url' in thing) && (typeof thing.url === 'string');

export const isAppConfig = (thing: unknown): thing is AppConfig =>
  (typeof thing === 'object') && (thing !== null) &&
  ('services' in thing) && isMapOf(thing.services, isService);

export const isJsonFormControlValueType = (thing: unknown): thing is JsonFormControlValueType =>
  (thing == null) ||
  (typeof thing === 'string') ||
  (typeof thing === 'number') ||
  (typeof thing === 'boolean') ||
  (isArrayOf<JsonFormControlValueType>(thing, isJsonFormControlValueType));

export const isNull = (thing: unknown): thing is null =>
  (typeof thing === 'object') && (thing == null) // typecheck necessary bc (undefined == null) === true
