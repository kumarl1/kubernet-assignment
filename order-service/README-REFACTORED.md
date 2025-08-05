# Order Service - Refactored Structure

## Overview
The Order Service has been refactored to follow a modular architecture with separation of concerns. The code is now organized into different modules for better maintainability and scalability.

## Project Structure

```
order-service/
├── config/
│   ├── config.js           # Configuration settings
│   └── database.js         # MongoDB connection management
├── middleware/
│   └── errorHandler.js     # Error handling middleware
├── routes/
│   ├── healthRoutes.js     # Health check endpoints
│   └── orderRoutes.js      # Order-related endpoints
├── services/
│   └── externalService.js  # External service communication
├── server.js               # Main server file
├── package.json
└── README.md
```

## File Descriptions

### `config/config.js`
Contains all configuration settings including:
- Port configuration
- MongoDB URI
- External service URLs
- Database name
- Request timeout settings

### `config/database.js`
Handles MongoDB connection:
- Database connection setup
- Connection management
- Database instance getter

### `middleware/errorHandler.js`
Contains error handling middleware:
- Global error handler
- 404 not found handler

### `routes/healthRoutes.js`
Health check endpoint:
- `/health` - Service health status with database connection info

### `routes/orderRoutes.js`
All order-related endpoints:
- `GET /api/orders` - Get all orders with filtering
- `GET /api/orders/:id` - Get order by ID with enriched data
- `GET /api/orders/user/:userId` - Get orders by user ID
- `GET /api/orders/status/:status` - Get orders by status
- `GET /api/orders/stats/summary` - Get order statistics
- `GET /api/orders/date-range/:startDate/:endDate` - Get orders by date range
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### `services/externalService.js`
External service communication:
- Generic external service caller
- User service integration
- Product service integration
- Service verification utilities

### `server.js`
Main server file (simplified):
- Express app setup
- Middleware configuration
- Route mounting
- Server startup

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a specific responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Scalability**: Easy to add new routes, services, or middleware
4. **Testability**: Individual modules can be tested independently
5. **Reusability**: Services and utilities can be reused across different parts

## Running the Service

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode (with nodemon)
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 3003)
- `MONGODB_URI` - MongoDB connection string
- `USER_SERVICE_URL` - User service URL (default: http://localhost:3001)
- `PRODUCT_SERVICE_URL` - Product service URL (default: http://localhost:3002)

## API Endpoints

### Health Check
- `GET /health` - Returns service status and database connection info

### Orders
- `GET /api/orders` - List orders with optional filtering
- `GET /api/orders/:id` - Get specific order with user and product details
- `GET /api/orders/user/:userId` - Get orders for specific user
- `GET /api/orders/status/:status` - Get orders with specific status
- `GET /api/orders/stats/summary` - Get order statistics
- `GET /api/orders/date-range/:startDate/:endDate` - Get orders in date range
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## Database Integration

The service now uses MongoDB for data persistence instead of in-memory storage. All order data is stored in the `orders` collection in the `microservices_db` database.
