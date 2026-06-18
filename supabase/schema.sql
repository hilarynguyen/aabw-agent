-- Hackathon Companion — profiles + pgvector matching.
-- Run once in the Supabase SQL editor.

create extension if not exists vector;

create table if not exists profiles (
  user_id            text primary key,        -- Google sub, or seed-t1.. for seeds
  name               text default '',
  email              text default '',
  avatar             text default '',
  linkedin           text default '',
  github             text default '',
  portfolio          text default '',
  bio                text default '',
  role               text default '',          -- background / occupation (avoid reserved word current_role)
  ai_ml_experience   text default '',
  agentic_experience text default '',
  hackathon_count    text default '',
  english_level      text default '',
  desired_role       text default '',          -- team role wanted
  domain             text default '',
  tracks             text[] default '{}',
  skills             text[] default '{}',      -- programming languages
  frameworks         text[] default '{}',
  ai_tools           text[] default '{}',
  tech_stack         text[] default '{}',
  interests          text[] default '{}',
  idea_stage         text default '',
  idea_description   text default '',
  goals              text default '',
  commitment         text default '',
  selection_criteria text default '',
  status             text default '',
  requirement        text default '',          -- free-text "who I'm looking for" (query for matching)
  is_seed            boolean default false,
  profile_text       text default '',
  embedding          vector(1024),
  completed          boolean default false,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- Approximate-nearest-neighbour index for cosine distance.
create index if not exists profiles_embedding_idx
  on profiles using hnsw (embedding vector_cosine_ops);

-- Ranked match: cosine similarity (1 - distance), excluding self and unembedded rows.
-- DROP first because the RETURNS TABLE signature changed (Postgres can't REPLACE that).
drop function if exists match_profiles(vector, int, text);
create or replace function match_profiles(
  query_embedding vector(1024),
  match_count int,
  exclude_user text
)
returns table (
  user_id text, name text, email text, avatar text, linkedin text, github text, portfolio text,
  role text, ai_ml_experience text, agentic_experience text, hackathon_count text, english_level text,
  desired_role text, tracks text[], domain text, skills text[], frameworks text[], ai_tools text[],
  tech_stack text[], interests text[], idea_stage text, idea_description text,
  commitment text, status text, similarity float
)
language sql stable
as $$
  select p.user_id, p.name, p.email, p.avatar, p.linkedin, p.github, p.portfolio,
         p.role, p.ai_ml_experience, p.agentic_experience, p.hackathon_count, p.english_level,
         p.desired_role, p.tracks, p.domain, p.skills, p.frameworks, p.ai_tools,
         p.tech_stack, p.interests, p.idea_stage, p.idea_description,
         p.commitment, p.status,
         1 - (p.embedding <=> query_embedding) as similarity
  from profiles p
  where p.embedding is not null
    and p.user_id <> exclude_user
  order by p.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------------------------------------------------------------------------
-- Migration for existing databases created before the expanded profile fields.
-- Safe to run repeatedly. The match_profiles RPC is unchanged — the new fields
-- enrich profile_text/embedding, which is what matching uses.
-- ---------------------------------------------------------------------------
alter table profiles add column if not exists github             text   default '';
alter table profiles add column if not exists portfolio          text   default '';
alter table profiles add column if not exists ai_ml_experience   text   default '';
alter table profiles add column if not exists agentic_experience text   default '';
alter table profiles add column if not exists hackathon_count    text   default '';
alter table profiles add column if not exists english_level      text   default '';
alter table profiles add column if not exists tracks             text[] default '{}';
alter table profiles add column if not exists frameworks         text[] default '{}';
alter table profiles add column if not exists ai_tools           text[] default '{}';
alter table profiles add column if not exists tech_stack         text[] default '{}';
alter table profiles add column if not exists idea_stage         text   default '';
alter table profiles add column if not exists idea_description   text   default '';
