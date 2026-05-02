-- database/schema.sql (SQLite)

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  content    TEXT    NOT NULL CHECK(length(content) <= 80),
  color_idx  INTEGER NOT NULL DEFAULT 0,
  pos_x      REAL    NOT NULL,
  pos_y      REAL    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO messages (content, color_idx, pos_x, pos_y) VALUES
  ('วันนี้คุณทำได้ดีมากแล้ว ✨', 0, 12.5, 18.3),
  ('ทุกก้าวเล็กๆ คือความกล้าหาญ', 1, 55.2, 42.1),
  ('คุณไม่ได้สู้คนเดียว',          2, 30.8, 70.5),
  ('พรุ่งนี้ยังมีโอกาสเสมอ',       3, 72.4, 25.9);
