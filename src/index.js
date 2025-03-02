import express from 'express';
import cors from 'cors';
import os from 'os';
import { config } from './config/config.js';
import userRoutes from './routes/user.routes.js';
import feedingLogsRoutes from './routes/feedingLog.routes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { connectToMongoDatabase } from './utils/mongo.connectToDatabase.js';

const app = express();
const port = process.env.PORT || 4837; // Render dynamically assigns a port

// Allow CORS for your frontend (change to your actual frontend URL in production)
app.use(cors({ origin: '*' })); 

// Middleware and routes
app.use(express.json());
app.use('/', userRoutes);
app.use('/', feedingLogsRoutes);
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to SnackShack API 🦮🐈🐕🐈‍⬛🐕‍🦺');
});

// Connect to MongoDB and start the server
const server = app.listen(port, async () => {
  await connectToMongoDatabase(config.DB_PROD_IDO_PROJET);
  console.log(`✅ Server running on port ${port}`);
});

export { server, app };
