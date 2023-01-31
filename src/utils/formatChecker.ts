export const isSet = <Whatever>(
  what: null | undefined | Whatever
): what is Whatever => {
  return what !== undefined && what !== null;
};

export const isNotSet = <Whatever>(
  what: null | undefined | Whatever
): what is null | undefined => {
  return what === undefined || what === null || typeof what === 'undefined';
};

export const isNumber = <Whatever>(what: number | Whatever): what is number => {
  return typeof what === 'number';
};

export const isBoolean = <Whatever>(
  what: boolean | Whatever
): what is boolean => {
  return typeof what === 'boolean';
};

export const isFalse = <Whatever>(what: false | Whatever): what is false => {
  return what === false;
};

export const isTrue = <Whatever>(what: true | Whatever): what is true => {
  return what === true;
};

export const isString = (what: any): what is string => {
  return typeof what === 'string';
};

export const isEmptyString = (what: any) => isString(what) && what.length === 0;

export const isNotEmptyString = (what: any = ''): what is string =>
  isString(what) && what.length !== 0;

export const isEmptyArray = (what: Array<any>) => what.length === 0;

export const isNotEmptyArray = (what: Array<any>) =>
  Array.isArray(what) && what.length !== 0;

export const isEmptyMap = (map: any) => map instanceof Map && map.size === 0;

export const isNotEmptyMap = (map: any) => map instanceof Map && map.size !== 0;
