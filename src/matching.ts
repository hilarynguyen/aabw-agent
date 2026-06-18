// PHASE 1 (mock) teammate matcher — a transparent stand-in for the future
// pgvector cosine-similarity search (POST /api/match). Phase 2 replaces ONLY this
// function; the MatchCandidate shape and the UI stay identical.

import { ProfileFields } from './profile';
import { PoolProfile } from './mockData';

export interface MatchCandidate extends PoolProfile {
  matchPercent: number;
  sharedSkills: string[];
}

const norm = (s: string) => s.trim().toLowerCase();

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a.map(norm).filter(Boolean));
  const B = new Set(b.map(norm).filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / (A.size + B.size - inter);
}

// loose token overlap between two free-text role/domain strings
function tokensOverlap(a: string, b: string): boolean {
  if (!a || !b) return false;
  const at = norm(a).split(/[^a-z0-9]+/).filter(Boolean);
  const bt = new Set(norm(b).split(/[^a-z0-9]+/).filter(Boolean));
  return at.some((t) => bt.has(t));
}

function sharedSkills(a: string[], b: string[]): string[] {
  const B = new Set(b.map(norm));
  return a.filter((s) => B.has(norm(s)));
}

/**
 * Score each pool profile against the current user's profile and return the top
 * `count`, sorted by match % (desc). Heuristic weights:
 *   skills overlap 0.40 · interests overlap 0.20 · domain match 0.15 · role complement 0.25
 * mapped to a realistic-looking 55–98% so the demo UI reads naturally.
 */
export function computeMatches(me: ProfileFields, pool: PoolProfile[], count = 4): MatchCandidate[] {
  // Treat languages, frameworks, AI tools and planned stack as one combined skill pool.
  const mySkills = [
    ...(me.skills || []), ...(me.frameworks || []), ...(me.aiTools || []), ...(me.techStack || []),
  ];

  const candidates = pool
    .map((p): MatchCandidate => {
      const poolSkills = [...p.skills, ...((p as any).frameworks || []), ...((p as any).techStack || [])];
      const jSkills = jaccard(mySkills, poolSkills);
      const jInterests = jaccard(me.interests || [], p.interests);
      const jTracks = jaccard(me.tracks || [], (p as any).tracks || []);
      const domainMatch = tokensOverlap(me.domain, p.domain) ? 1 : 0;

      // Role complementarity: ideal if the candidate's role is what the user wants.
      let roleComp = 0;
      if (me.desiredRole) {
        if (norm(me.desiredRole).includes('complementary')) {
          roleComp = me.currentRole && !tokensOverlap(me.currentRole, p.currentRole) ? 1 : 0.5;
        } else if (tokensOverlap(me.desiredRole, p.currentRole)) {
          roleComp = 1;
        } else if (me.currentRole && !tokensOverlap(me.currentRole, p.currentRole)) {
          roleComp = 0.4; // still a different role = some complement
        }
      }

      const score = jSkills * 0.38 + jInterests * 0.17 + jTracks * 0.1 + domainMatch * 0.12 + roleComp * 0.23;
      const matchPercent = Math.round(Math.min(98, 55 + score * 43));

      return { ...p, matchPercent, sharedSkills: sharedSkills(mySkills, poolSkills) };
    });

  return candidates.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, count);
}
