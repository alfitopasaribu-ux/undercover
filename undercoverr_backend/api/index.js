import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { neon } from '@neondatabase/serverless';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL belum diisi di file .env');
  }

  return neon(process.env.DATABASE_URL);
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

app.get('/', (req, res) => {
  res.json({
    app: 'Undercoverr API',
    status: 'ok'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const sql = getDb();

    const rows = await sql`
      SELECT COUNT(*)::int AS total_words
      FROM word_pairs
    `;

    res.json({
      ok: true,
      message: 'Backend connected to NeonDB',
      totalWords: rows[0].total_words
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.get('/api/words/random', async (req, res) => {
  try {
    const sql = getDb();

    const lang = req.query.lang || 'id';
    const pack = req.query.pack || 'standard';

    const rows = await sql`
      SELECT id, civilian_word, undercover_word, difficulty
      FROM word_pairs
      WHERE lang = ${lang}
      AND pack = ${pack}
      AND civilian_word IS NOT NULL
      AND undercover_word IS NOT NULL
      AND TRIM(civilian_word) <> ''
      AND TRIM(undercover_word) <> ''
      AND LOWER(TRIM(civilian_word)) <> LOWER(TRIM(undercover_word))
      ORDER BY random()
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Kata tidak ditemukan di tabel word_pairs'
      });
    }

    res.json({
      ok: true,
      id: rows[0].id,
      civilianWord: rows[0].civilian_word,
      undercoverWord: rows[0].undercover_word,
      difficulty: rows[0].difficulty
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const sql = getDb();

    const {
      players = [],
      undercoverCount = 1,
      mrWhiteCount = 1,
      lang = 'id',
      pack = 'standard'
    } = req.body;

    if (!Array.isArray(players) || players.length < 3) {
      return res.status(400).json({
        ok: false,
        error: 'Minimal 3 pemain'
      });
    }

    const totalSecret = Number(undercoverCount) + Number(mrWhiteCount);

    if (totalSecret >= players.length) {
      return res.status(400).json({
        ok: false,
        error: 'Jumlah Undercover + Mr. White harus lebih kecil dari jumlah pemain'
      });
    }

    const wordRows = await sql`
      SELECT civilian_word, undercover_word
      FROM word_pairs
      WHERE lang = ${lang}
      AND pack = ${pack}
      AND civilian_word IS NOT NULL
      AND undercover_word IS NOT NULL
      AND TRIM(civilian_word) <> ''
      AND TRIM(undercover_word) <> ''
      AND LOWER(TRIM(civilian_word)) <> LOWER(TRIM(undercover_word))
      ORDER BY random()
      LIMIT 1
    `;

    if (wordRows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Kata tidak ditemukan'
      });
    }

    const civilianWord = wordRows[0].civilian_word;
    const undercoverWord = wordRows[0].undercover_word;

    const rolePool = [
      ...Array(players.length - totalSecret).fill('CIVILIAN'),
      ...Array(Number(undercoverCount)).fill('UNDERCOVER'),
      ...Array(Number(mrWhiteCount)).fill('MR_WHITE')
    ];

    const shuffledRoles = shuffle(rolePool);

    const assignments = players.map((player, index) => {
      const role = shuffledRoles[index];

      let word = civilianWord;

      if (role === 'UNDERCOVER') {
        word = undercoverWord;
      }

      if (role === 'MR_WHITE') {
        word = null;
      }

      return {
        playerName: player.name || `Pemain ${index + 1}`,
        avatarEmoji: player.avatarEmoji || '??',
        photoUrl: player.photoUrl || null,
        role,
        word,
        revealOrder: index + 1
      };
    });

    const gameId = randomUUID().replaceAll('-', '').slice(0, 12);

    await sql`
      INSERT INTO games (
        id,
        mode,
        status,
        lang,
        pack,
        player_count,
        undercover_count,
        mr_white_count,
        civilian_word,
        undercover_word
      )
      VALUES (
        ${gameId},
        'offline_one_device',
        'playing',
        ${lang},
        ${pack},
        ${players.length},
        ${undercoverCount},
        ${mrWhiteCount},
        ${civilianWord},
        ${undercoverWord}
      )
    `;

    for (const item of assignments) {
      await sql`
        INSERT INTO game_players (
          game_id,
          player_name,
          photo_url,
          avatar_emoji,
          role,
          word,
          is_alive,
          reveal_order
        )
        VALUES (
          ${gameId},
          ${item.playerName},
          ${item.photoUrl},
          ${item.avatarEmoji},
          ${item.role},
          ${item.word},
          true,
          ${item.revealOrder}
        )
      `;
    }

    res.status(201).json({
      ok: true,
      id: gameId,
      civilianWord,
      undercoverWord,
      assignments
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post('/api/games/:id/finish', async (req, res) => {
  try {
    const sql = getDb();

    const gameId = req.params.id;
    const winner = req.body.winner || 'UNKNOWN';

    const rows = await sql`
      UPDATE games
      SET 
        status = 'finished',
        winner = ${winner},
        finished_at = NOW()
      WHERE id = ${gameId}
      RETURNING id, winner, finished_at
    `;

    res.json({
      ok: true,
      game: rows[0] || null
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Undercoverr API running at http://localhost:${port}`);
  });
}

export default app;

