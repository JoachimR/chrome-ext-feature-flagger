export function hasOwnProperty<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Obj extends {},
  P extends PropertyKey
>(obj: Obj, prop: P): obj is Obj & Record<P, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
}
