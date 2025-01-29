import express from 'express';
import { config } from "./config/config";
import { connectToMongoDatabase } from './data/databaseMongo';
import userRoutes from "./routes/user.routes";
import feedingLogsRoutes from "./routes/feedingLog.routes";
import { errorMiddleware } from './middlewares/errorMiddleware';

const cors = require('cors');
const app = express();
const port = config.port;
const https = require('https');
const fs = require('fs')



app.use(cors());

const options = {
  key: fs.readFileSync('./src/keys/key.pem'),
  cert: fs.readFileSync('./src/keys/cert.pem')
};




app.use('/', userRoutes);

app.use('/', feedingLogsRoutes);


app.use(errorMiddleware);



if(config.nodeEnv === "prod") {
  /*
   app.listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
    //fetchAllData(config.databaseFetchUrl);
    console.log("Serveur prod started");
    console.log(`Server is running on port http://localhost:${port}`);
    });
*/
    https.createServer(options, app).listen(port, async () => {
      await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
      //fetchAllData(config.databaseFetchUrl);
      console.log("Serveur prod started");
      console.log(`Server is running on port https://localhost:${port}`);
      }).on('error', () => {
        console.error('HTTPS server error:', err);
      });
} 

export default app;