import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import userRoutes from './routes/user.routes.js';
import feedingLogsRoutes from './routes/feedingLog.routes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { connectToMongoDatabase } from './utils/mongo.connectToDatabase.js';

// import fs from 'fs';
// import https from 'https';



const app = express();
const port = config.port;


app.use(cors());

/*
const options = {
  key: fs.readFileSync('./src/keys/key.pem'),
  cert: fs.readFileSync('./src/keys/cert.pem')
};

*/


app.use('/', userRoutes);

app.use('/', feedingLogsRoutes);


app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to SnackShack API');
});


const server = app.listen(port, async () => {
  await connectToMongoDatabase(config.DB_PROD_IDO_PROJET)
  console.log("Serveur prod started");
  console.log(`Server is running on port http://localhost:${port}`);
});

/*
    https.createServer(options, app).listen(port, async () => {
      await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
      //fetchAllData(config.databaseFetchUrl);
      console.log("Serveur prod started");
      console.log(`Server is running on port https://localhost:${port}`);
      }).on('error', () => {
        console.error('HTTPS server error:', error);
      });
      */
//}

export {server, app};