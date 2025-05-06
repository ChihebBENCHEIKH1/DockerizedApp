const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
const cors = require('cors');

const port = 5000;

// PostgreSQL setup
const pgPool = new Pool({
  host: 'db',  // Use the service name defined in docker-compose for PostgreSQL
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
});

// Redis setup
const redisClient = createClient({
  url: 'redis://redis:6379'  // Use the service name defined in docker-compose for Redis
});
redisClient.connect();

(async () => {
  await pgPool.query(`CREATE TABLE IF NOT EXISTS counter (id SERIAL PRIMARY KEY, count INTEGER DEFAULT 0)`);
  const result = await pgPool.query('SELECT * FROM counter');
  if (result.rows.length === 0) {
    await pgPool.query('INSERT INTO counter (count) VALUES (0)');
  }
})();

app.use(cors({
  origin: 'http://localhost:80',  // or the correct IP/hostname for your Nginx container
  credentials: true,
}));

// Routes
app.get('/api', async (req, res) => {
  let pgCount;
  let redisCount;

  // Increment PostgreSQL
  const pgResult = await pgPool.query('UPDATE counter SET count = count + 1 RETURNING count');
  pgCount = pgResult.rows[0].count;

  // Increment Redis
  redisCount = await redisClient.incr('counter');

  res.json({ postgres: pgCount, redis: redisCount });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

