const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGODB_HOST || 'mongodb-service:27017';
const dbName = process.env.DATABASE_NAME || 'microservices_db';

const MONGODB_URI = process.env.MONGODB_URI || 
  (username && password
    ? `mongodb://${username}:${password}@${host}/${dbName}?authSource=admin`
    : null);

if (!MONGODB_URI) {
  throw new Error("MongoDB connection details missing. Please set env vars MONGO_USERNAME, MONGO_PASSWORD, or MONGODB_URI");
}

module.exports = {
  PORT: process.env.PORT || 3003,
  MONGODB_URI,
  DATABASE_NAME: dbName,
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 5000,
};