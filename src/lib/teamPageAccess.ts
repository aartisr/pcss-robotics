export function isPublicTeamPageEnabled(value: string | undefined) {
  return value === 'true';
}

export const PUBLIC_TEAM_PAGE_ENABLED = isPublicTeamPageEnabled(
  typeof import.meta.env === 'object' ? import.meta.env.VITE_PUBLIC_TEAM_PAGE : undefined,
);

export const TEAM_LOCAL_STORAGE_KEYS = [
  'pcss_team_roster_v1',
  'pcss_competitions_v1',
  'pcss_proposals_v1',
  'pcss_faculty_mentors_v1',
] as const;

export function clearStoredTeamData(storage: Pick<Storage, 'removeItem'>) {
  for (const key of TEAM_LOCAL_STORAGE_KEYS) storage.removeItem(key);
}
