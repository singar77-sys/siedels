/**
 * Convert a full name to a URL slug using the first name, lowercase.
 * If two team members share a first name, the caller must disambiguate
 * (e.g. by passing `${first}-${last}` explicitly).
 */
export function slugFromName(fullName: string): string {
  return fullName.split(/\s+/)[0].toLowerCase();
}

/**
 * Find a team member by the slug produced by slugFromName.
 * Returns undefined if not found.
 */
export function findBySlug<T extends { name: string }>(
  members: readonly T[],
  slug: string,
): T | undefined {
  const target = slug.toLowerCase();
  return members.find((m) => slugFromName(m.name) === target);
}
