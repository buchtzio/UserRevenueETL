const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const FILE_PATH = './server_events.jsonl';

const pool = new Pool({
  user: 'etl_project_user',
  host: 'localhost',
  database: 'user_revenue_etl_db',
  password: 'tbms2210',
  port: 5432,
});

const sendError = (res, code, message) => res.status(code).send(message);

app.post('/liveEvent', (req, res) => {
  const { authorization } = req.headers;
  const { userId, name, value } = req.body;

  if (authorization !== 'secret') {
    return sendError(res, 403, 'Forbidden');
  }
  if (!userId || !name || !value) {
    return sendError(res, 400, 'Invalid event data');
  }

  fs.appendFile(FILE_PATH, `${JSON.stringify({ userId, name, value })}\n`, (err) => {
    if (err) {
      return sendError(res, 500, 'Error saving event');
    }
    res.send('Event saved');
  });
});

app.get('/userEvents/:userId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users_revenue WHERE user_id = $1', [req.params.userId]);
    if (rows.length === 0) {
      return sendError(res, 404, `No data found for user: ${req.params.userId}`);
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving user data:', error.message);
    sendError(res, 500, 'Server error');
  }
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
