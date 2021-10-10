export function hasOwnProperty<
  Obj extends Record<string, unknown>,
  P extends PropertyKey
>(obj: Obj, prop: P): obj is Obj & Record<P, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
}
