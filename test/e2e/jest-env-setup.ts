import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env.test');

// Carrega .env.test se existir
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('🔥 Jest env setup: .env.test carregado');
} else {
  console.warn('⚠️ Jest env setup: .env.test NÃO encontrado');
}
