/**
 * Order routes module
 * Handles all order-related HTTP endpoints for the order service
 * Provides CRUD operations and order management functionality
 */

const express = require('express');
const { getDatabase } = require('../config/database');
const { getUserDetails, getProductDetails } = require('../services/externalService');

/**
 * Express router instance for order routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Get all orders endpoint
 * @route GET /orders
 * @description Retrieves all orders from the database with optional filtering support
 * @returns {Object} JSON response with orders array
 * @returns {boolean} returns.success - Indicates if the request was successful
 * @returns {Array} returns.data - Array of order objects
 * @returns {string} [returns.message] - Error message if request failed
 * @returns {string} [returns.error] - Detailed error information if request failed
 */
router.get('/', async (req, res) => {
  try {
    // Get database connection
    const db = getDatabase();
    
    // Fetch all orders from the orders collection, excluding MongoDB's _id field
    const orders = await db.collection('orders').find({}, { projection: { _id: 0 } }).toArray();
    
    // Return successful response with orders data
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error fetching orders:', error);
    
    // Return error response to client
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

/**
 * Get order by ID with enriched details
 * @route GET /orders/:id
 * @param {string} req.params.id - The order ID to retrieve
 * @description Retrieves a specific order by ID and enriches it with user details 
 * and product details for each item. Handles external service failures gracefully.
 * @returns {Object} JSON response with enriched order data
 * @returns {boolean} returns.success - Indicates if the request was successful
 * @returns {Object} returns.data - Order object with user and product details
 * @returns {Object} returns.data.userDetails - User information from user service
 * @returns {Array} returns.data.items - Order items with product details
 * @returns {string} [returns.message] - Error message if request failed
 * @returns {string} [returns.error] - Detailed error information if request failed
 */
router.get('/:id', async (req, res) => {
  try {
    // Parse order ID from URL parameter
    const orderId = parseInt(req.params.id);
    const db = getDatabase();
    
    // Find the specific order by ID, excluding MongoDB's _id field
    const order = await db.collection('orders').findOne({ id: orderId }, { projection: { _id: 0 } });
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Fetch user details from external user service
    // Handle service failures gracefully to prevent order lookup from failing
    let userDetails = null;
    try {
      const userResponse = await getUserDetails(order.userId);
      userDetails = userResponse.data;
    } catch (error) {
      console.warn('Could not fetch user details:', error.message);
    }
    
    // Fetch product details for each item in the order
    // Process all items concurrently using Promise.all for better performance
    const enrichedItems = await Promise.all(
      order.items.map(async (item) => {
        try {
          // Get product details from external product service
          const productResponse = await getProductDetails(item.productId);
          return {
            ...item,
            productDetails: productResponse.data
          };
        } catch (error) {
          // Log warning but continue processing other items
          console.warn(`Could not fetch product details for ID ${item.productId}:`, error.message);
          return {
            ...item,
            productDetails: null
          };
        }
      })
    );
    
    // Return enriched order data with user and product details
    res.json({
      success: true,
      data: {
        ...order,
        userDetails,
        items: enrichedItems
      }
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error fetching order:', error);
    
    // Return error response to client
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

/**
 * Export order routes router
 * @module orderRoutes
 */
module.exports = router;
