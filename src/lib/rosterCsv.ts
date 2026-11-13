import type { TeamMember } from '../types';

const columns = [
  ['Grade', (member: TeamMember) => member.grade],
  ['Name', (member: TeamMember) => member.name],
  ['Division', (member: TeamMember) => member.division],
  ['Role', (member: TeamMember) => member.role],
  ['Competition', (member: TeamMember) => member.competition],
  ['Deadline', (member: TeamMember) => member.competitionDeadline],
  ['T-Shirt Size', (member: TeamMember) => member.tshirtSize],
  ['T-Shirt Color', (member: TeamMember) => member.tshirtColor],
  ['Specialty', (member: TeamMember) => member.specialty],
  ['Notes', (member: TeamMember) => member.notes]
] as const;

function csvCell(value: string | undefined): string {
  return `"${(value ?? '').replaceAll('"', '""')}"`;
}

export function serializeRosterCsv(members: readonly TeamMember[]): string {
  const header = columns.map(([label]) => csvCell(label)).join(',');
  const rows = members.map(member => columns.map(([, read]) => csvCell(read(member))).join(','));
  return [header, ...rows].join('\r\n') + '\r\n';
}

export function downloadRosterCsv(members: readonly TeamMember[]): void {
  const csv = `\uFEFF${serializeRosterCsv(members)}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `PCSS_Robotics_Team_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Let the browser start the download before releasing its object URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
