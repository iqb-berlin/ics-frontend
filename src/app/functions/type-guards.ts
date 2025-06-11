/* eslint-disable implicit-arrow-linebreak */
import { isArrayOf } from 'iqbspecs-coding-service/functions/common.typeguards';
import { IcsfConfig } from '../interfaces/interfaces';
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
};

export const isIcsfConfig = (thing: unknown): thing is IcsfConfig =>
  (typeof thing === 'object') && (thing !== null) &&
  ('services' in thing) && isArrayOf(thing.services, s => typeof s === 'string') &&
  (!('userlink' in thing) || (typeof thing.userlink === 'string'));

export const isJsonFormControlValueType = (thing: unknown): thing is JsonFormControlValueType =>
  (thing === null) ||
  (typeof thing === 'string') ||
  (typeof thing === 'number') ||
  (typeof thing === 'boolean') ||
  (isArrayOf<JsonFormControlValueType>(thing, isJsonFormControlValueType));

export const isNull = (thing: unknown): thing is null =>
  (typeof thing === 'object') && (thing == null); // typecheck necessary bc (undefined == null) === true
