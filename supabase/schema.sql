-- Hackathon Companion — profiles + pgvector matching.
-- Run once in the Supabase SQL editor.

create extension if not exists vector;

create table if not exists profiles (
  user_id            text primary key,        -- Google sub, or seed-t1.. for seeds
  name               text default '',
  email              text default '',
  avatar             text default '',
  linkedin           text default '',
  bio                text default '',
  role               text default '',          -- current role (avoid reserved word current_role)
  desired_role       text default '',
  domain             text default '',
  skills             text[] default '{}',
  interests          text[] default '{}',
  goals              text default '',
  commitment         text default '',
  selection_criteria text default '',
  status             text default '',
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
create or replace function match_profiles(
  query_embedding vector(1024),
  match_count int,
  exclude_user text
)
returns table (
  user_id text, name text, email text, avatar text, linkedin text, bio text,
  role text, desired_role text, domain text, skills text[], interests text[],
  commitment text, status text, similarity float
)
language sql stable
as $$
  select p.user_id, p.name, p.email, p.avatar, p.linkedin, p.bio,
         p.role, p.desired_role, p.domain, p.skills, p.interests,
         p.commitment, p.status,
         1 - (p.embedding <=> query_embedding) as similarity
  from profiles p
  where p.embedding is not null
    and p.user_id <> exclude_user
  order by p.embedding <=> query_embedding
  limit match_count;
$$;
