-- Migration 0002: websites, drafts, releases, files

CREATE TABLE websites (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  current_release_id TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_websites_owner ON websites(owner_user_id);
CREATE INDEX idx_websites_slug ON websites(slug);
CREATE INDEX idx_websites_status ON websites(status);

CREATE TABLE site_drafts (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL UNIQUE,
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  updated_by TEXT,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

CREATE TABLE site_releases (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  release_number INTEGER NOT NULL,
  html TEXT NOT NULL,
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  content_hash TEXT NOT NULL,
  published_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'live',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (website_id, release_number),
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

CREATE INDEX idx_releases_website ON site_releases(website_id);
CREATE INDEX idx_releases_status ON site_releases(status);

CREATE TABLE site_files (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  content TEXT,
  r2_key TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (website_id, path),
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

CREATE INDEX idx_site_files_website ON site_files(website_id);

CREATE TABLE reserved_slugs (
  slug TEXT PRIMARY KEY,
  reason TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO reserved_slugs (slug, reason) VALUES
  ('www', 'system'),
  ('app', 'system'),
  ('api', 'system'),
  ('admin', 'system'),
  ('login', 'system'),
  ('register', 'system'),
  ('support', 'system'),
  ('help', 'system'),
  ('docs', 'system'),
  ('blog', 'system'),
  ('mail', 'system'),
  ('smtp', 'system'),
  ('ftp', 'system'),
  ('cdn', 'system'),
  ('static', 'system'),
  ('assets', 'system'),
  ('sites', 'system'),
  ('dashboard', 'system'),
  ('root', 'system'),
  ('system', 'system'),
  ('status', 'system');

CREATE TABLE site_domains (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  hostname TEXT NOT NULL UNIQUE,
  verified_at INTEGER,
  tls_status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

CREATE INDEX idx_site_domains_website ON site_domains(website_id);

CREATE TABLE deployment_jobs (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  release_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  started_at INTEGER,
  finished_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

CREATE INDEX idx_jobs_website ON deployment_jobs(website_id);
CREATE INDEX idx_jobs_status ON deployment_jobs(status);
