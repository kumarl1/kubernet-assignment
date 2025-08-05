# Kubernetes Deployment Guide

This guide covers deploying the Node.js microservices with MongoDB on Kubernetes.

## 📋 **Prerequisites**

- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured to connect to your cluster
- Docker installed for building images

## 🗂️ **Project Structure**

```
microservice/
├── k8s/                              # Kubernetes manifests
│   ├── mongodb-secret.yaml          # MongoDB credentials
│   ├── mongodb-pvc.yaml             # Persistent storage
│   ├── mongodb-init-configmap.yaml  # Database initialization
│   ├── mongodb-deployment.yaml      # MongoDB deployment
│   ├── user-service-deployment.yaml # User service
│   ├── product-service-deployment.yaml # Product service
│   ├── order-service-deployment.yaml # Order service
│   └── deploy.sh                    # Deployment script
├── user-service/                    # User microservice
├── product-service/                 # Product microservice
├── order-service/                   # Order microservice
└── README.md
```

## 🚀 **Quick Deployment**

### Step 1: Build Docker Images

```bash
# Navigate to project root
cd c:\my-workspace\NAGP\kubernate\microservice

# Build all service images
docker build -t user-service:latest ./user-service
docker build -t product-service:latest ./product-service  
docker build -t order-service:latest ./order-service
```

### Step 2: Deploy to Kubernetes

```bash
# Navigate to k8s directory
cd k8s

# Deploy MongoDB first
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-init-configmap.yaml
kubectl apply -f mongodb-deployment.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=available --timeout=300s deployment/mongodb-deployment

# Deploy microservices
kubectl apply -f user-service-deployment.yaml
kubectl apply -f product-service-deployment.yaml
kubectl apply -f order-service-deployment.yaml
```

### Step 3: Initialize Database

```bash
# Copy the init script to MongoDB pod
kubectl cp ../k8s/mongodb-init-configmap.yaml mongodb-deployment-[POD-ID]:/tmp/

# Execute the initialization script
kubectl exec -it deployment/mongodb-deployment -- mongosh --username admin --password password123 --authenticationDatabase admin --eval "load('/tmp/init-db.js')" microservices_db
```

## 🔍 **Verify Deployment**

```bash
# Check all pods are running
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# View logs
kubectl logs deployment/mongodb-deployment
kubectl logs deployment/user-service-deployment
kubectl logs deployment/product-service-deployment
kubectl logs deployment/order-service-deployment
```

## 🌐 **Access Services**

### Using NodePort (External Access)

```bash
# Get service URLs (if using Minikube)
minikube service user-service --url
minikube service product-service --url
minikube service order-service --url

# Or access via NodePort:
# User Service: http://<cluster-ip>:30001
# Product Service: http://<cluster-ip>:30002
# Order Service: http://<cluster-ip>:30003
```

### Using Port Forwarding

```bash
# Port forward services to localhost
kubectl port-forward service/user-service 3001:3001
kubectl port-forward service/product-service 3002:3002
kubectl port-forward service/order-service 3003:3003

# Access services at:
# User Service: http://localhost:3001
# Product Service: http://localhost:3002
# Order Service: http://localhost:3003
```

## 📊 **MongoDB Configuration**

### Database Details
- **Database Name**: `microservices_db`
- **Username**: `admin`
- **Password**: `password123`
- **Port**: `27017`

### Collections
- **users**: User data with indexes on id and email
- **products**: Product catalog with indexes on id, sku, and category
- **orders**: Order data with indexes on id, userId, status, and orderDate

### Sample Data
Each collection is pre-populated with sample data for testing.

## 🔧 **Service Configuration**

### User Service (Port 3001)
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **GET** `/api/users/role/:role` - Get users by role
- **GET** `/api/users/search/:query` - Search users

### Product Service (Port 3002)
- **GET** `/api/products` - Get all products (with filters)
- **GET** `/api/products/:id` - Get product by ID
- **GET** `/api/products/category/:category` - Get products by category
- **GET** `/api/products/search/:query` - Search products
- **GET** `/api/categories` - Get all categories
- **GET** `/api/products/stock/low/:threshold` - Get low stock products

### Order Service (Port 3003)
- **GET** `/api/orders` - Get all orders (with filters)
- **GET** `/api/orders/:id` - Get order by ID (enriched with user/product data)
- **GET** `/api/orders/user/:userId` - Get orders by user
- **GET** `/api/orders/status/:status` - Get orders by status
- **GET** `/api/orders/stats/summary` - Get order statistics
- **GET** `/api/orders/date-range/:start/:end` - Get orders in date range

## 🧪 **Testing the APIs**

```bash
# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Sample API calls
curl http://localhost:3001/api/users
curl http://localhost:3002/api/products
curl http://localhost:3003/api/orders

# Search examples
curl http://localhost:3001/api/users/search/john
curl http://localhost:3002/api/products/search/laptop
curl http://localhost:3003/api/orders/user/1
```

## 📈 **Monitoring & Scaling**

### Check Resource Usage
```bash
kubectl top pods
kubectl top nodes
```

### Scale Services
```bash
# Scale user service to 3 replicas
kubectl scale deployment user-service-deployment --replicas=3

# Scale product service to 4 replicas
kubectl scale deployment product-service-deployment --replicas=4
```

### View Logs
```bash
# Follow logs for a specific service
kubectl logs -f deployment/user-service-deployment

# View logs from all replicas
kubectl logs -l app=user-service
```

## 🛠️ **Troubleshooting**

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Service connection issues**
   ```bash
   kubectl get endpoints
   kubectl describe service <service-name>
   ```

3. **MongoDB connection problems**
   ```bash
   kubectl logs deployment/mongodb-deployment
   kubectl exec -it deployment/mongodb-deployment -- mongosh --username admin --password password123
   ```

4. **Image pull errors**
   ```bash
   # For local images, ensure imagePullPolicy is set to Never
   # Or push images to a registry and update the deployment files
   ```

### Reset Database
```bash
# Delete and recreate MongoDB
kubectl delete -f mongodb-deployment.yaml
kubectl delete -f mongodb-pvc.yaml
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
```

## 🔒 **Security Considerations**

### Production Recommendations

1. **Use Secrets for sensitive data**
   ```bash
   kubectl create secret generic mongodb-secret \
     --from-literal=mongo-root-username=admin \
     --from-literal=mongo-root-password=your-secure-password
   ```

2. **Enable TLS/SSL**
   - Configure MongoDB with SSL certificates
   - Use HTTPS for service communication

3. **Network Policies**
   - Implement network policies to restrict pod-to-pod communication
   - Use service mesh (Istio, Linkerd) for advanced traffic management

4. **Resource Limits**
   - Set appropriate CPU and memory limits
   - Configure horizontal pod autoscaling

5. **Monitoring**
   - Deploy Prometheus and Grafana for monitoring
   - Set up log aggregation with ELK stack

## 🧹 **Cleanup**

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individual components
kubectl delete deployment user-service-deployment
kubectl delete deployment product-service-deployment
kubectl delete deployment order-service-deployment
kubectl delete deployment mongodb-deployment
kubectl delete service user-service product-service order-service mongodb-service
kubectl delete pvc mongodb-pvc
kubectl delete secret mongodb-secret
kubectl delete configmap mongodb-init-script
```

## 🔄 **CI/CD Integration**

### Example GitHub Actions Workflow
```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build and Deploy
      run: |
        docker build -t user-service:${{ github.sha }} ./user-service
        docker build -t product-service:${{ github.sha }} ./product-service
        docker build -t order-service:${{ github.sha }} ./order-service
        kubectl set image deployment/user-service-deployment user-service=user-service:${{ github.sha }}
        kubectl set image deployment/product-service-deployment product-service=product-service:${{ github.sha }}
        kubectl set image deployment/order-service-deployment order-service=order-service:${{ github.sha }}
```

This setup provides a robust, scalable microservices architecture running on Kubernetes with MongoDB as the data store.
