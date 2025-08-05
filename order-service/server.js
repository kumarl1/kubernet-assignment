const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration and database
const config = require('./config/config');
const { connectToDatabase } = require('./config/database');

// Import routes
const healthRoutes = require('./routes/healthRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', notFoundHandler);

// Start server after database connection
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(config.PORT, () => {
      console.log(`Order Service running on port ${config.PORT}`);
      console.log(`Health check: http://localhost:${config.PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
