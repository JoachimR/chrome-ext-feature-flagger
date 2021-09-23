export function sortByName(a: { name: string }, b: { name: string }): number {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}
