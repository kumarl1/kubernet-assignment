# Order Service Microservice

Node.js Order Service microservice with MongoDB database deployed on Kubernetes.

- **Order Service** (Port 3003) - Manages orders with MongoDB persistence
- **MongoDB** (Port 27017) - Database for storing order data
- **Kubernetes Deployment** - Production-ready container orchestration

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Order Service  │    │         MongoDB                 │ │
│  │   (4 replicas)  │◄──►│      (StatefulSet)              │ │
│  │    Port 3003    │    │       Port 27017                │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│           │                                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              NGINX Ingress Controller                   │ │
│  │           Routes: /api/orders, /health/orders           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Features
- RESTful API for order management (CRUD operations)
- MongoDB integration with persistent storage
- Health monitoring endpoints
- Docker containerization
- Kubernetes deployment with 4 replicas
- **Rolling Updates** with zero-downtime deployments
- NGINX Ingress Controller for external access

## Prerequisites
- Docker installed and running
- Kubernetes cluster (minikube, Docker Desktop, or cloud provider)
- kubectl configured

## Deployment

### Quick Deploy (Recommended)
```powershell
cd k8s
powershell -ExecutionPolicy Bypass -File deploy.sh


### Manual Deployment
```bash
cd k8s
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-init-configmap.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl wait --for=condition=ready --timeout=300s pod/mongodb-statefulset-0
kubectl apply -f order-service-deployment.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ingress.yaml
```

## Local Development

1. **Navigate to order service:**
   ```bash
   cd order-service
   npm install
   ```

2. **Set environment variables:**
   ```bash
   # Windows
   set MONGO_USERNAME=admin
   set MONGO_PASSWORD=password123
   set PORT=3003
   ```

3. **Start the service:**
   ```bash
   npm start
   ```

## API Endpoints

### Access Service
- **Live API**: `http://35.193.20.71/api/orders`
- **Health Check**: `http://35.193.20.71/health/orders`
- Get Ingress IP: `kubectl get ingress microservices-ingress`
- Local: `http://localhost:3003` (with port-forward)

### API Operations
```bash
# Get all orders
GET /api/orders

[
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
]



```

## Project Structure
```
microservice/
├── order-service/
│   ├── server.js              # Main application server
│   ├── package.json           # Dependencies and scripts
│   ├── Dockerfile            # Container configuration
│   ├── .gitignore            # Git ignore file
│   ├── config/
│   │   ├── config.js         # Application configuration
│   │   └── database.js       # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── routes/
│   │   ├── healthRoutes.js   # Health check endpoints
│   │   └── orderRoutes.js    # Order CRUD operations
│   └── services/
│       └── externalService.js # External service integrations
├── k8s/
│   ├── mongodb-deployment.yaml      # MongoDB StatefulSet
│   ├── mongodb-secret.yaml          # Database credentials
│   ├── mongodb-init-configmap.yaml  # DB initialization
│   ├── order-service-deployment.yaml # Order Service Deployment
│   ├── ingress.yaml                # Ingress configuration
│   ├── deploy.sh                   # Deployment script
│   ├── cleanup.sh                  # Cleanup script
│   
└── README.md                       # This file
```

## Useful Commands
```bash
# Deploy everything
cd k8s && powershell -ExecutionPolicy Bypass -File deploy.sh

# Check status
kubectl get all

# Get logs
kubectl logs -f deployment/order-service-deployment

# Access service locally
kubectl port-forward service/order-service 3003:3003

# Scale service
kubectl scale deployment order-service-deployment --replicas=6

# Clean up
cd k8s && ./cleanup.sh
```

## Rolling Updates

The deployment is configured with a **RollingUpdate** strategy for zero-downtime deployments:

### Rolling Update Configuration
- **Strategy**: RollingUpdate
- **Max Unavailable**: 1 pod (ensures at least 3 pods remain available)
- **Max Surge**: 2 pods (allows up to 6 pods during update)
- **Readiness Probe**: Optimized for faster updates (3s intervals)



### Rolling Update Process
1. **Preparation**: New pods are created with the updated image
2. **Readiness Check**: New pods must pass readiness probes
3. **Traffic Shift**: Load balancer routes traffic to ready pods
4. **Old Pod Termination**: Old pods are gracefully terminated
5. **Completion**: All pods are updated with zero downtime

### Monitoring Rolling Updates
```bash
# Watch pods during update
kubectl get pods -w -l app=order-service

# Monitor deployment events
kubectl describe deployment order-service-deployment

# Check pod status and readiness
kubectl get pods -l app=order-service -o wide
```

## Environment Variables
- `PORT` - Port to run the service on (default: 3003)
- `MONGO_USERNAME` - MongoDB username (default: admin)
- `MONGO_PASSWORD` - MongoDB password (default: password123)

## Default Credentials
- **MongoDB Username**: `admin`
- **MongoDB Password**: `password123`
- **Database**: `microservices_db`

## Docker Hub
- **Image Repository**: https://hub.docker.com/repository/docker/kumarl1/order-service/general
- **Image**: `kumarl1/order-service:latest`