-- Siedel's Gift Card System
-- Run once against your Neon database to initialize the schema.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Gift cards ──────────────────────────────────────────────────────────────
CREATE TABLE gift_cards (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code               TEXT        UNIQUE NOT NULL,
  face_value_cents   INTEGER     NOT NULL,
  balance_cents      INTEGER     NOT NULL,
  purchaser_email    TEXT        NOT NULL,
  recipient_name     TEXT,
  sender_name        TEXT,
  gift_message       TEXT,
  stripe_session_id  TEXT        UNIQUE,
  purchased_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status             TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'depleted'))
);

-- ── Transaction ledger ───────────────────────────────────────────────────────
CREATE TABLE gift_card_transactions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id              UUID        NOT NULL REFERENCES gift_cards(id),
  type                 TEXT        NOT NULL
    CHECK (type IN ('purchase', 'redemption', 'dormancy_fee', 'credit')),
  amount_cents         INTEGER     NOT NULL,   -- negative = debit
  balance_after_cents  INTEGER     NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note                 TEXT
);

-- ── PIN lockout tracking ─────────────────────────────────────────────────────
CREATE TABLE pin_attempts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip           TEXT        NOT NULL,
  succeeded    BOOLEAN     NOT NULL DEFAULT FALSE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_gift_cards_code          ON gift_cards(code);
CREATE INDEX idx_gift_cards_status        ON gift_cards(status);
CREATE INDEX idx_gift_cards_last_activity ON gift_cards(last_activity_at);
CREATE INDEX idx_transactions_card_id     ON gift_card_transactions(card_id);
CREATE INDEX idx_transactions_created_at  ON gift_card_transactions(created_at);
CREATE INDEX idx_pin_attempts_ip_time     ON pin_attempts(ip, attempted_at);
