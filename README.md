# Order Service Microservice

This project contains a Node.js Order Service microservice with MongoDB database, demonstrating a containerized e-commerce order management system deployed on Kubernetes.

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

### Order Service (`/api/orders`)
- **Order Management**: Create, read, update, delete orders
- **MongoDB Integration**: Persistent data storage with pre-seeded sample data
- **Health Monitoring**: Built-in health check endpoints
- **RESTful API**: Complete CRUD operations for order management
- **Docker Containerization**: Ready for deployment with Docker
- **Kubernetes Ready**: Production deployment with StatefulSet and Services
- **Ingress Support**: External access through NGINX Ingress Controller
- **Auto-scaling**: Configured with 4 replicas for high availability
- **Resource Management**: Configured with CPU and memory limits
- **Liveness & Readiness Probes**: Automatic health monitoring and recovery

### Database Features
- **MongoDB StatefulSet**: Persistent storage with 5Gi volume
- **Automatic Initialization**: Pre-seeded with sample order data
- **Indexing**: Optimized database performance with proper indexes
- **Secret Management**: Secure credential handling with Kubernetes secrets
- **Data Persistence**: Persistent volumes for data retention

## Quick Start

### Prerequisites
- Docker installed and running
- Kubernetes cluster (minikube, Docker Desktop, or cloud provider)
- kubectl configured to connect to your cluster

### Kubernetes Deployment (Recommended)

**Important**: Always run deployment scripts from the `k8s` directory!

#### For Windows (PowerShell):
```powershell
cd k8s
# Make the script executable and run
powershell -ExecutionPolicy Bypass -File deploy.sh
```

#### For Linux/Mac (Bash):
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

The deployment script will:
1. Create MongoDB secret for authentication
2. Create MongoDB initialization ConfigMap
3. Deploy MongoDB StatefulSet with persistent storage
4. Wait for MongoDB to be ready
5. Deploy Order Service with 4 replicas
6. Install NGINX Ingress Controller
7. Configure Ingress for external access
8. Display service information and endpoints

### Manual Kubernetes Deployment

If you prefer to deploy manually:

```bash
cd k8s

# Deploy MongoDB components
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-init-configmap.yaml
kubectl apply -f mongodb-deployment.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready --timeout=300s pod/mongodb-statefulset-0

# Deploy Order Service
kubectl apply -f order-service-deployment.yaml

# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# Deploy Ingress
kubectl apply -f ingress.yaml
```

### Running Order Service Locally

You can also run the Order Service locally for development:

1. **Navigate to order service directory:**
   ```bash
   cd order-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```bash
   # Windows
   set MONGO_USERNAME=admin
   set MONGO_PASSWORD=password123
   set PORT=3003

   # Linux/Mac
   export MONGO_USERNAME=admin
   export MONGO_PASSWORD=password123
   export PORT=3003
   ```

4. **Start the service:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Docker Development

Build and run with Docker:

```bash
# Build the image
docker build -t order-service ./order-service

# Run with MongoDB (requires running MongoDB container)
docker run -p 3003:3003 \
  -e MONGO_USERNAME=admin \
  -e MONGO_PASSWORD=password123 \
  order-service
```

## API Documentation

### Accessing the Service

After deployment, the Order Service is accessible through:

**Via Ingress (Recommended):**
- Get Ingress IP: `kubectl get ingress microservices-ingress`
- Order API: `http://<INGRESS_IP>/api/orders`
- Health Check: `http://<INGRESS_IP>/health/orders`

**Via Port Forwarding (Development):**
```bash
kubectl port-forward service/order-service 3003:3003
```
Then access: `http://localhost:3003`

### Health Check
```bash
GET http://<INGRESS_IP>/health/orders
# or locally
GET http://localhost:3003/health
```

Response:
```json
{
  "status": "healthy",
  "service": "Order Service",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "uptime": "0:05:23",
  "mongodb": "connected"
}
```

### Order Service API

#### Get All Orders
```bash
GET http://<INGRESS_IP>/api/orders
# or locally
GET http://localhost:3003/api/orders

# With filters
GET http://<INGRESS_IP>/api/orders?userId=1&status=pending
```

Response:
```json
[
  {
    "_id": "...",
    "id": 1,
    "userId": 1,
    "items": [
      { "productId": 1, "quantity": 1, "price": 1299.99 },
      { "productId": 2, "quantity": 2, "price": 29.99 }
    ],
    "totalAmount": 1359.97,
    "status": "completed",
    "orderDate": "2025-01-15T10:30:00.000Z",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-16T10:30:00.000Z"
  }
]
```

#### Get Order by ID
```bash
GET http://<INGRESS_IP>/api/orders/1
# or locally
GET http://localhost:3003/api/orders/1
```

#### Create New Order
```bash
POST http://<INGRESS_IP>/api/orders
# or locally
POST http://localhost:3003/api/orders
Content-Type: application/json

{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2, "price": 1299.99 },
    { "productId": 2, "quantity": 1, "price": 29.99 }
  ],
  "shippingAddress": {
    "street": "789 Pine St",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "country": "USA"
  }
}
```

#### Update Order
```bash
PUT http://<INGRESS_IP>/api/orders/1
# or locally  
PUT http://localhost:3003/api/orders/1
Content-Type: application/json

{
  "status": "confirmed",
  "shippingAddress": {
    "street": "789 Pine St Updated",
    "city": "Chicago",
    "state": "IL", 
    "zipCode": "60601",
    "country": "USA"
  }
}
```

#### Delete Order
```bash
DELETE http://<INGRESS_IP>/api/orders/1
# or locally
DELETE http://localhost:3003/api/orders/1
```

## Kubernetes Configuration

### Components

1. **MongoDB StatefulSet** (`mongodb-deployment.yaml`)
   - MongoDB 7.0 with persistent storage
   - 5Gi persistent volume
   - Automatic database initialization
   - Health checks with readiness and liveness probes
   - Resource limits: 1Gi memory, 500m CPU

2. **Order Service Deployment** (`order-service-deployment.yaml`)
   - 4 replicas for high availability
   - Image: `kumarl1/order-service:latest`
   - Health checks on `/health` endpoint
   - Resource limits: 256Mi memory, 200m CPU

3. **Secrets Management** (`mongodb-secret.yaml`)
   - Secure storage of MongoDB credentials
   - Base64 encoded username/password

4. **ConfigMap** (`mongodb-init-configmap.yaml`)
   - Database initialization script
   - Pre-seeded sample order data

5. **Ingress** (`ingress.yaml`)
   - NGINX Ingress Controller
   - Routes for `/api/orders` and `/health/orders`
   - CORS enabled for web applications

6. **Persistent Storage**
   - PersistentVolume (`mongodb-pv.yaml`)
   - PersistentVolumeClaim (`mongodb-pvc.yaml`)
   - Standard-rwo storage class

### Monitoring and Management

#### Check Deployment Status
```bash
# Check all resources
kubectl get all

# Check specific components
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get statefulsets
kubectl get ingress

# Check MongoDB StatefulSet
kubectl get statefulset mongodb-statefulset

# Check Order Service Deployment
kubectl get deployment order-service-deployment
```

#### View Logs
```bash
# MongoDB logs
kubectl logs statefulset/mongodb-statefulset

# Order Service logs  
kubectl logs deployment/order-service-deployment

# Follow logs
kubectl logs -f deployment/order-service-deployment
```

#### Scale Order Service
```bash
# Scale to 6 replicas
kubectl scale deployment order-service-deployment --replicas=6

# Check scaling status
kubectl get deployment order-service-deployment
```

## Development

### Project Structure
```
microservice/
├── order-service/
│   ├── server.js              # Main application server
│   ├── package.json           # Dependencies and scripts
│   ├── Dockerfile            # Container configuration
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
│   ├── mongodb-pv.yaml             # Persistent Volume
│   ├── mongodb-pvc.yaml            # Persistent Volume Claim
│   ├── order-service-deployment.yaml # Order Service Deployment
│   ├── ingress.yaml                # Ingress configuration
│   ├── deploy.sh                   # Deployment script
│   ├── cleanup.sh                  # Cleanup script
│   ├── init-db.js                  # Database init script
│   └── README.md                   # K8s specific documentation
└── README.md                       # This file
```

### Environment Variables

#### Order Service
- `PORT` - Port to run the service on (default: 3003)
- `NODE_ENV` - Node environment (development/production)
- `MONGO_USERNAME` - MongoDB username (from secret)
- `MONGO_PASSWORD` - MongoDB password (from secret)

#### MongoDB
- `MONGO_INITDB_ROOT_USERNAME` - MongoDB root username
- `MONGO_INITDB_ROOT_PASSWORD` - MongoDB root password
- `MONGO_INITDB_DATABASE` - Initial database name (microservices_db)

### Sample Data

The MongoDB initialization script creates sample orders:

```javascript
// Sample orders in the database
{
  id: 1,
  userId: 1,
  items: [
    { productId: 1, quantity: 1, price: 1299.99 },
    { productId: 2, quantity: 2, price: 29.99 }
  ],
  totalAmount: 1359.97,
  status: "completed",
  orderDate: "2025-01-15T10:30:00Z",
  shippingAddress: {
    street: "123 Main St",
    city: "New York", 
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
}
```

### Adding New Features

1. **Add new endpoints** in `order-service/routes/orderRoutes.js`
2. **Update package.json** if new dependencies are needed
3. **Rebuild Docker image** and push to registry
4. **Update Kubernetes deployment** if configuration changes
5. **Update this README** with new API documentation

### Testing the Service

You can test the Order Service using:
- **Postman** - Import the API endpoints
- **curl** - Command line testing
- **Thunder Client** (VS Code extension)
- **Insomnia** - API testing tool

Example curl commands:
```bash
# Get Ingress IP first
kubectl get ingress microservices-ingress

# Test health endpoint
curl http://<INGRESS_IP>/health/orders

# Get all orders
curl http://<INGRESS_IP>/api/orders

# Get specific order
curl http://<INGRESS_IP>/api/orders/1

# Create new order
curl -X POST http://<INGRESS_IP>/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "items": [
      {"productId": 1, "quantity": 1, "price": 999.99}
    ],
    "shippingAddress": {
      "street": "456 Oak Ave",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "USA"
    }
  }'
```

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   # Check pod status
   kubectl get pods
   
   # Describe pod for detailed information
   kubectl describe pod <pod-name>
   
   # Check logs
   kubectl logs <pod-name>
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB pod status
   kubectl get pod mongodb-statefulset-0
   
   # Check MongoDB logs
   kubectl logs mongodb-statefulset-0
   
   # Test MongoDB connection
   kubectl exec -it mongodb-statefulset-0 -- mongosh -u admin -p
   ```

3. **Ingress not working**
   ```bash
   # Check ingress status
   kubectl get ingress microservices-ingress
   
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Describe ingress for details
   kubectl describe ingress microservices-ingress
   ```

4. **Service not accessible**
   ```bash
   # Check service endpoints
   kubectl get endpoints
   
   # Port forward for direct access
   kubectl port-forward service/order-service 3003:3003
   ```

5. **Storage issues**
   ```bash
   # Check persistent volumes
   kubectl get pv
   kubectl get pvc
   
   # Check storage class
   kubectl get storageclass
   ```

### Cleanup

To remove all deployed resources:

```bash
cd k8s
chmod +x cleanup.sh
./cleanup.sh

# Or manually:
kubectl delete -f ingress.yaml
kubectl delete -f order-service-deployment.yaml
kubectl delete -f mongodb-deployment.yaml
kubectl delete -f mongodb-init-configmap.yaml
kubectl delete -f mongodb-secret.yaml
kubectl delete -f mongodb-pvc.yaml
kubectl delete -f mongodb-pv.yaml
```

### Logs and Debugging

View detailed logs:
```bash
# All order service pods
kubectl logs -l app=order-service

# Specific pod with follow
kubectl logs -f <pod-name>

# Previous container logs (if crashed)
kubectl logs <pod-name> --previous

# Multiple containers in a pod
kubectl logs <pod-name> -c <container-name>
```

Debug pod issues:
```bash
# Get into a running pod
kubectl exec -it <pod-name> -- /bin/bash

# Check pod resource usage
kubectl top pods

# Check node resources
kubectl top nodes
```

## Production Considerations

For production deployment, consider:

### Security
- **HTTPS/TLS** - Enable SSL certificates for Ingress
- **Network Policies** - Restrict pod-to-pod communication
- **Pod Security Standards** - Implement security contexts
- **Secrets Management** - Use external secret stores (HashiCorp Vault, AWS Secrets Manager)
- **Image Security** - Scan container images for vulnerabilities
- **RBAC** - Implement role-based access control

### High Availability
- **Multi-Zone Deployment** - Deploy across availability zones
- **MongoDB Replica Set** - Configure MongoDB clustering
- **Load Balancing** - Configure proper load balancing
- **Pod Disruption Budgets** - Ensure minimum replica availability
- **Node Affinity** - Control pod placement across nodes

### Monitoring & Observability
- **Prometheus & Grafana** - Metrics collection and visualization
- **ELK Stack** - Centralized logging (Elasticsearch, Logstash, Kibana)
- **Jaeger/Istio** - Distributed tracing
- **Health Checks** - Comprehensive liveness and readiness probes
- **Alerting** - Set up alerts for critical metrics

### Performance & Scaling
- **Horizontal Pod Autoscaler** - Auto-scale based on CPU/memory
- **Vertical Pod Autoscaler** - Adjust resource requests automatically
- **Database Optimization** - Index optimization, query performance
- **Caching** - Implement Redis/Memcached for caching
- **CDN** - Content delivery network for static assets

### Data Management
- **Database Backups** - Automated backup strategy
- **Data Persistence** - Use appropriate storage classes
- **Data Migration** - Version control for database schema
- **Disaster Recovery** - Cross-region backup and recovery plans

### CI/CD Pipeline
- **Automated Testing** - Unit, integration, and e2e tests
- **Container Registry** - Private registry for images
- **GitOps** - Infrastructure as Code with ArgoCD/Flux
- **Blue/Green Deployment** - Zero-downtime deployments
- **Rollback Strategy** - Quick rollback mechanisms

### Configuration Management
- **Environment-specific Configs** - Separate configs for dev/staging/prod
- **Feature Flags** - Dynamic feature toggling
- **Config Validation** - Validate configurations before deployment
- **Secret Rotation** - Automated secret rotation policies

## Kubernetes Best Practices

### Resource Management
```yaml
# Example resource limits for production
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Health Checks
```yaml
# Comprehensive health checks
livenessProbe:
  httpGet:
    path: /health
    port: 3003
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /ready
    port: 3003
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Security Context
```yaml
# Security best practices
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
```

## License

This project is licensed under the ISC License.

---

## Quick Reference

### Useful Commands
```bash
# Deploy everything
cd k8s && ./deploy.sh

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

### Important URLs
- **Health Check**: `http://<INGRESS_IP>/health/orders`
- **API Endpoint**: `http://<INGRESS_IP>/api/orders`
- **Local Development**: `http://localhost:3003`

### Default Credentials
- **MongoDB Username**: `admin`
- **MongoDB Password**: `password123`
- **Database**: `microservices_db`

For support or questions, please refer to the documentation or create an issue in the repository.