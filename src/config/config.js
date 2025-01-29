import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4837,
  jwtSecret: process.env.JWT_SECRET || 'I_LOVE_OVERFEEDING_MY_ANIMALS_OMG',
  DB_PROD_IDO_PROJET: process.env.DB_PROD_URI_FINAL || "mongodb+srv://poirieroli:abc-123@cluster0.klocq.mongodb.net/Prod",
  DB_TEST_IDO_PROJET: process.env.DB_TEST_URI_FINAL || "mongodb+srv://poirieroli:abc-123@cluster0.klocq.mongodb.net/Test"
};
