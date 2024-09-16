const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'etl_project_user',
  host: 'localhost',
  database: 'user_revenue_etl_db',
  password: 'tbms2210',
  port: 5432,
});

const FILE_PATH = './server_events.jsonl';

function renameFileForProcessing() {
  const newFilePath = `processing_${Date.now()}.jsonl`;
  try {
    fs.renameSync(FILE_PATH, newFilePath);
    return newFilePath;
  } catch (error) {
    console.error('Error renaming file:', error.message);
    throw new Error('Failed to rename file for processing.');
  }
}

async function processEvents() {
  if (!fs.existsSync(FILE_PATH)) {
    console.log('No events to process.');
    return;
  }

  const fileToProcess = renameFileForProcessing();
  const fileStream = fs.createReadStream(fileToProcess);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  try {
    for await (const line of rl) {
      const event = JSON.parse(line);
      const { userId, name, value } = event;
      const revenueChange = name === 'add_revenue' ? value : -value;

      try {
        await pool.query(`
          INSERT INTO users_revenue (user_id, revenue)
          VALUES ($1, $2)
          ON CONFLICT (user_id) DO UPDATE 
          SET revenue = users_revenue.revenue + EXCLUDED.revenue;
        `, [userId, revenueChange]);
      } catch (dbError) {
        console.error('Error processing event for user:', userId, dbError.message);
      }
    }

    fs.unlinkSync(fileToProcess);
    console.log(`Processed and deleted file: ${fileToProcess}`);
  } catch (processingError) {
    console.error('Error processing file:', processingError.message);
  } finally {
    rl.close();
    fileStream.destroy();
  }
}

processEvents();
