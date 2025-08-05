# MongoDB Deployment Commands
# Apply in this order:

# 1. Create MongoDB Secret
kubectl apply -f mongodb-secret.yaml --validate=false

# 2. Create MongoDB Init ConfigMap
kubectl apply -f mongodb-init-configmap.yaml --validate=false

# 3. Deploy MongoDB StatefulSet
kubectl apply -f mongodb-deployment.yaml --validate=false

# 4. Wait for MongoDB StatefulSet to be ready
kubectl wait --for=condition=ready --timeout=300s pod/mongodb-statefulset-0

echo "MongoDB is ready! Database will be automatically initialized on first startup."

# Microservices Deployment Commands
# Apply after MongoDB is ready:



# 8. Deploy Order Service
kubectl apply -f order-service-deployment.yaml --validate=false

# befor ingress we have to intalll ingress controller
# 8.1 Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml


# 9. Deploy Ingress
kubectl apply -f ingress.yaml --validate=false

echo "Waiting for Ingress to be ready..."
kubectl wait --for=condition=ready --timeout=300s ingress/microservices-ingress

# Verify Deployments
kubectl get pods
kubectl get services
kubectl get statefulsets
kubectl get deployments
kubectl get ingress

# Get Ingress IP/URL
echo ""
echo "🌐 Ingress Information:"
kubectl get ingress microservices-ingress

# For Minikube users - Get Ingress URL
echo ""
echo "🔗 API Endpoints (replace <INGRESS_IP> with actual IP):"
echo "User Service:    http://<INGRESS_IP>/api/users"
echo "Product Service: http://<INGRESS_IP>/api/products" 
echo "Order Service:   http://<INGRESS_IP>/api/orders"
echo ""
echo "Health Checks:"
echo "User Health:     http://<INGRESS_IP>/health/users"
echo "Product Health:  http://<INGRESS_IP>/health/products"
echo "Order Health:    http://<INGRESS_IP>/health/orders"

# Access Services via Ingress (recommended)
echo ""
echo "📝 To get the Ingress IP address:"
echo "kubectl get ingress microservices-ingress"
echo ""
echo "🚀 Example API calls:"
echo "curl http://<INGRESS_IP>/api/users"
echo "curl http://<INGRESS_IP>/api/products"
echo "curl http://<INGRESS_IP>/api/orders"

# Alternative: Direct port forwarding (for development)
# kubectl port-forward service/user-service 3001:3001
# kubectl port-forward service/product-service 3002:3002
# kubectl port-forward service/order-service 3003:3003

# Clean up (if needed)
# kubectl delete -f .

# Check logs
# kubectl logs statefulset/mongodb-statefulset
# kubectl logs deployment/user-service-deployment
# kubectl logs deployment/product-service-deployment
# kubectl logs deployment/order-service-deployment
