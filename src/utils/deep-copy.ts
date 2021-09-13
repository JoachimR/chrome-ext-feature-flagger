/**
 * http://jsben.ch/qC3Fe
 * */
export function deepCopy<T extends any>(object: T): T {
  let newObject: any;
  let iterator: any;
  // if not array or object or is null return self
  if (typeof object !== "object" || object === null) {
    return object;
  }
  // handle case: array
  if (Array.isArray(object)) {
    let length;
    newObject = [];
    for (iterator = 0, length = object.length; iterator < length; iterator++) {
      newObject[iterator] = deepCopy(object[iterator]);
    }
    return newObject;
  }
  // handle case: object
  newObject = {};
  for (iterator in object) {
    // @ts-ignore
    if (object.hasOwnProperty(iterator)) {
      // eslint-disable-next-line
      newObject[iterator] = deepCopy((object as any)[iterator]);
    }
  }
  return newObject;
}
