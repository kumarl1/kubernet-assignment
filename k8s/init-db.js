// MongoDB Initialization Script for Microservices
// This script initializes the database with sample data

// Switch to the microservices database
db = db.getSiblingDB('microservices_db');

print('🗄️ Initializing microservices database...');

// Create users collection and insert sample data
print('👥 Creating users collection...');

// Create orders collection and insert sample data
print('📋 Creating orders collection...');
db.orders.insertMany([
  {
    id: 1,
    userId: 1,
    items: [
      { productId: 1, quantity: 1, price: 1299.99 },
      { productId: 2, quantity: 2, price: 29.99 }
    ],
    totalAmount: 1359.97,
    status: "completed",
    orderDate: new Date("2025-01-15T10:30:00Z"),
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    createdAt: new Date("2025-01-15T10:30:00Z"),
    updatedAt: new Date("2025-01-16T10:30:00Z")
  },
  {
    id: 2,
    userId: 2,
    items: [
      { productId: 3, quantity: 1, price: 299.99 }
    ],
    totalAmount: 299.99,
    status: "pending",
    orderDate: new Date("2025-01-20T14:15:00Z"),
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    createdAt: new Date("2025-01-20T14:15:00Z"),
    updatedAt: new Date("2025-01-20T14:15:00Z")
  }
]);

// Create indexes for better performance
print('📊 Creating database indexes...');


// Orders indexes
db.orders.createIndex({ "id": 1 }, { unique: true });
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "orderDate": 1 });

// Verify data insertion
print('✅ Database initialization completed successfully!');
print('📊 Data summary:');
print('   Orders: ' + db.orders.countDocuments());

// Test a simple query
print('🔍 Sample user query:');


print('🎉 Database is ready for microservices!');
