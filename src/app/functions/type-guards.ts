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
