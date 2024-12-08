export const deepFreeze = <T extends object>(obj: T) => {
  Object.keys(obj).forEach((prop) => {
    if (typeof prop === 'object' && !Object.isFrozen(prop)) deepFreeze(prop);
  });
  return Object.freeze(obj);
};
