import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env.test');

// Carrega .env.test se existir
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
