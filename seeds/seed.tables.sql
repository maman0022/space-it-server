BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'French', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'ordinateur', 'computer', 2),
  (2, 1, 'je m''appelle', 'my name is', 3),
  (3, 1, 'courrier', 'mail', 4),
  (4, 1, 'comment allez-vous', 'how are you', 5),
  (5, 1, 'au revoir', 'goodbye', 6),
  (6, 1, 'bien', 'good', 7),
  (7, 1, 'mal', 'bad', 8),
  (8, 1, 'l''amour', 'love', 9),
  (9, 1, 'haine', 'hate', 10),
  (10, 1, 'pluie', 'rain', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
