import app from './app';
import { initStorage } from '../lib/storage';

const PORT = process.env.PORT || 4000;

async function start() {
  await initStorage();
  app.listen(PORT, () => {
    console.log(`[CENTRAL API] Running on http://localhost:${PORT}`);
  });
}

start();
