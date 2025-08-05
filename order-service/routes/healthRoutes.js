/**
 * Health check routes module
 * Provides health monitoring endpoints for the order service
 * Used by load balancers, monitoring systems, and orchestration platforms
 */

const express = require('express');
const { getDatabase } = require('../config/database');

/**
 * Express router instance for health check routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Health check endpoint
 * @route GET /health
 * @description Provides service health status including database connectivity
 * @returns {Object} JSON response with service status information
 * @returns {string} returns.status - Overall service status ('OK' or error)
 * @returns {string} returns.service - Service identifier
 * @returns {string} returns.timestamp - ISO timestamp of the health check
 * @returns {string} returns.database - Database connection status ('connected' or 'disconnected')
 */
router.get('/health', (req, res) => {
  let dbStatus;
  
  try {
    // Attempt to get database instance to check connectivity
    const db = getDatabase();
    dbStatus = db ? 'connected' : 'disconnected';
  } catch (error) {
    // If database is not connected or throws an error, mark as disconnected
    dbStatus = 'disconnected';
  }

  // Return comprehensive health status information
  res.status(200).json({ 
    status: 'OK', 
    service: 'order-service',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

/**
 * Export health check router
 * @module healthRoutes
 */
module.exports = router;
