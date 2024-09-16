const fs = require('fs');
const axios = require('axios');

const FILE_PATH = './events.jsonl';
const SERVER_URL = 'http://localhost:8000/liveEvent';

async function sendEvent(event) {
  try {
    const response = await axios.post(SERVER_URL, event, {
      headers: { 'Authorization': 'secret' }
    });
    console.log('Event sent:', response.data);
  } catch (error) {
    console.error('Error sending event:', error.message);
  }
}

fs.readFile(FILE_PATH, 'utf8', async (err, data) => {
  if (err) throw err;

  const lines = data.trim().split('\n');
  for (const line of lines) {
    const event = JSON.parse(line);
    await sendEvent(event);
  }
});
