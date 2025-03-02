import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import os from 'os';
import { config } from './config/config.js';
import userRoutes from './routes/user.routes.js';
import feedingLogsRoutes from './routes/feedingLog.routes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { connectToMongoDatabase } from './utils/mongo.connectToDatabase.js';

const app = express();
const port = config.port || 443;

app.use(cors());

const options = {
  key: fs.readFileSync('./src/keys/key.pem'),
  cert: fs.readFileSync('./src/keys/cert.pem'),
};

app.use('/', userRoutes);
app.use('/', feedingLogsRoutes);
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to SnackShack API 🦮🐈🐕🐈‍⬛🐕‍🦺');
});

// Fonction pour récupérer l'adresse IPv4 locale
const getLocalIPv4 = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'localhost';
};

const ipAddress = getLocalIPv4();


const server = app.listen(port, async () => {
  await connectToMongoDatabase(config.DB_PROD_IDO_PROJET);
  console.log("✅ Serveur HTTP démarré !");
  console.log(`🌍 Accessible à :`);
  console.log(`   🔹 http://localhost:${port}`);
  console.log(`   🔹 http://${ipAddress}:${port}`);
  console.log("➡️  Veuillez accéder à l'une de ces pages pour accepter l'accès")
})

/*
const server = https.createServer(options, app).listen(port, async () => {
  await connectToMongoDatabase(config.DB_PROD_IDO_PROJET);
  console.log("✅ Serveur HTTPS démarré !");
  console.log(`🌍 Accessible à :`);
  console.log(`   🔹 https://localhost:${port}`);
  console.log(`   🔹 https://${ipAddress}:${port}`);
  console.log("➡️  Veuillez accéder à l'une de ces pages pour accepter l'accès")
});
*/
export { server, app };
