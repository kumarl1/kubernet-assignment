/**
 * Database connection module for MongoDB
 * Handles database connection establishment and provides access to the database instance
 */

const { MongoClient } = require('mongodb');
const config = require('./config');

/**
 * Global database instance
 * @type {Db|null}
 */
let db;

/**
 * Establishes connection to MongoDB database
 * @async
 * @function connectToDatabase
 * @returns {Promise<Db>} The connected database instance
 * @throws {Error} When connection fails
 * @description Creates a new MongoDB client, connects to the database using the configured URI,
 * and stores the database instance for global access
 */
async function connectToDatabase() {
  try {
    // Connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Create new MongoDB client with connection string from config
    const client = new MongoClient(config.MONGODB_URI, options);
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', config.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    // Establish connection to MongoDB server
    await client.connect();
    
    // Test the connection
    await client.db(config.DATABASE_NAME).admin().ping();
    
    // Get reference to the specific database
    db = client.db(config.DATABASE_NAME);
    
    console.log('Connected to MongoDB successfully');
    console.log('Database name:', config.DATABASE_NAME);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Connection URI being used:', config.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    throw error;
  }
}

/**
 * Retrieves the current database instance
 * @function getDatabase
 * @returns {Db} The active database instance
 * @throws {Error} When database is not connected
 * @description Returns the global database instance. Must be called after connectToDatabase()
 * has been successfully executed.
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDatabase
};
