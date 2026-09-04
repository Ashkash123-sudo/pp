-- Panther Press relational foundation
-- PostgreSQL-compatible schema for the CFHS athletics platform.

CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  password_hash TEXT NOT NULL,
  profile_visibility VARCHAR(12) NOT NULL DEFAULT 'limited' CHECK (profile_visibility IN ('public', 'limited', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE sports (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  season VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE seasons (
  id BIGSERIAL PRIMARY KEY,
  label VARCHAR(20) NOT NULL UNIQUE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  is_archived BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE teams (
  id BIGSERIAL PRIMARY KEY,
  sport_id BIGINT NOT NULL REFERENCES sports(id),
  name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('varsity', 'jv', 'freshman', 'other')),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('boys', 'girls', 'coed')),
  head_coach VARCHAR(120),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (sport_id, name, level, gender)
);

CREATE TABLE team_seasons (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES teams(id),
  season_id BIGINT NOT NULL REFERENCES seasons(id),
  overall_wins INTEGER NOT NULL DEFAULT 0,
  overall_losses INTEGER NOT NULL DEFAULT 0,
  region_wins INTEGER NOT NULL DEFAULT 0,
  region_losses INTEGER NOT NULL DEFAULT 0,
  UNIQUE (team_id, season_id)
);

CREATE TABLE athletes (
  id BIGSERIAL PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  profile_visibility VARCHAR(12) NOT NULL DEFAULT 'limited' CHECK (profile_visibility IN ('public', 'limited', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roster_entries (
  id BIGSERIAL PRIMARY KEY,
  athlete_id BIGINT NOT NULL REFERENCES athletes(id),
  team_season_id BIGINT NOT NULL REFERENCES team_seasons(id),
  jersey_number VARCHAR(8),
  position VARCHAR(60),
  is_archived BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (athlete_id, team_season_id)
);

CREATE TABLE venues (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  address TEXT,
  directions_url TEXT
);

CREATE TABLE opponents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  logo_url TEXT
);

CREATE TABLE games (
  id BIGSERIAL PRIMARY KEY,
  team_season_id BIGINT NOT NULL REFERENCES team_seasons(id),
  opponent_id BIGINT NOT NULL REFERENCES opponents(id),
  venue_id BIGINT REFERENCES venues(id),
  starts_at TIMESTAMPTZ NOT NULL,
  location_type VARCHAR(12) NOT NULL CHECK (location_type IN ('home', 'away', 'neutral')),
  is_region_game BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(15) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'final', 'postponed', 'cancelled', 'rescheduled')),
  home_score INTEGER,
  away_score INTEGER,
  notes TEXT,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_links (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  ticket_url TEXT NOT NULL CHECK (ticket_url LIKE 'https://%'),
  button_text VARCHAR(40) NOT NULL DEFAULT 'Buy tickets',
  ticket_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by BIGINT NOT NULL REFERENCES users(id),
  updated_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE game_events (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  period_label VARCHAR(30),
  clock_label VARCHAR(30),
  event_type VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE player_game_stats (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  athlete_id BIGINT NOT NULL REFERENCES athletes(id),
  category VARCHAR(80) NOT NULL,
  value NUMERIC(12, 2) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (game_id, athlete_id, category)
);

CREATE TABLE player_season_stats (
  id BIGSERIAL PRIMARY KEY,
  athlete_id BIGINT NOT NULL REFERENCES athletes(id),
  team_season_id BIGINT NOT NULL REFERENCES team_seasons(id),
  category VARCHAR(80) NOT NULL,
  value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  UNIQUE (athlete_id, team_season_id, category)
);

CREATE TABLE standings (
  id BIGSERIAL PRIMARY KEY,
  team_season_id BIGINT NOT NULL REFERENCES team_seasons(id),
  source_name VARCHAR(160) NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  streak VARCHAR(20),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  headline VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  author_id BIGINT REFERENCES users(id),
  status VARCHAR(12) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media (
  id BIGSERIAL PRIMARY KEY,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'highlight', 'gallery')),
  title VARCHAR(160) NOT NULL,
  source_url TEXT NOT NULL,
  moderation_status VARCHAR(12) NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  uploaded_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE awards (
  id BIGSERIAL PRIMARY KEY,
  athlete_id BIGINT REFERENCES athletes(id),
  team_season_id BIGINT REFERENCES team_seasons(id),
  award_name VARCHAR(120) NOT NULL,
  awarded_on DATE,
  notes TEXT
);

CREATE TABLE records (
  id BIGSERIAL PRIMARY KEY,
  sport_id BIGINT NOT NULL REFERENCES sports(id),
  category VARCHAR(30) NOT NULL CHECK (category IN ('single_game', 'single_season', 'career', 'team')),
  holder_name VARCHAR(120) NOT NULL,
  value VARCHAR(80) NOT NULL,
  season_id BIGINT REFERENCES seasons(id),
  verification_status VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);

CREATE TABLE notification_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES teams(id),
  game_starting BOOLEAN NOT NULL DEFAULT true,
  score_update BOOLEAN NOT NULL DEFAULT true,
  final_score BOOLEAN NOT NULL DEFAULT true,
  schedule_change BOOLEAN NOT NULL DEFAULT true,
  ticket_availability BOOLEAN NOT NULL DEFAULT true,
  new_article BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE correction_requests (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT REFERENCES games(id),
  athlete_id BIGINT REFERENCES athletes(id),
  statistic VARCHAR(80) NOT NULL,
  current_value NUMERIC(12, 2),
  suggested_value NUMERIC(12, 2),
  explanation TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'needs_information')),
  submitted_by BIGINT REFERENCES users(id),
  reviewed_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id),
  action VARCHAR(80) NOT NULL,
  object_type VARCHAR(80) NOT NULL,
  object_id BIGINT,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX games_starts_at_idx ON games(starts_at);
CREATE INDEX games_status_idx ON games(status);
CREATE INDEX player_game_stats_lookup_idx ON player_game_stats(athlete_id, category);
CREATE INDEX audit_logs_object_idx ON audit_logs(object_type, object_id);
