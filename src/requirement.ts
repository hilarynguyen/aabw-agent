// Requirement-driven matching: the user types who they're looking for; the backend
// embeds it and ranks the candidate pool. Falls back to the local heuristic offline.
import { MatchCandidate } from './matching';

const REQ_KEY = 'hackathon_requirement_';

export function loadRequirement(userId: string): string {
  try {
    return localStorage.getItem(REQ_KEY + userId) || '';
  } catch {
    return '';
  }
}

export function saveRequirementLocal(userId: string, text: string): void {
  try {
    localStorage.setItem(REQ_KEY + userId, text);
  } catch {
    /* ignore */
  }
}

export async function findByRequirement(userId: string, requirement: string, count = 6): Promise<MatchCandidate[]> {
  const resp = await fetch('/api/requirement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, requirement, count }),
  });
  if (!resp.ok) throw new Error('requirement match failed');
  const data = await resp.json();
  return (data.matches || []) as MatchCandidate[];
}
