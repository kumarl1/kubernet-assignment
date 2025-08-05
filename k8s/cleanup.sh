#!/bin/bash
# Cleanup Script for Kubernetes Resources
# Run this if you need to clean up and restart the deployment

echo "Cleaning up existing Kubernetes resources..."

# Delete existing deployments
echo "Deleting deployments..."
kubectl delete deployment mongodb-deployment --ignore-not-found=true
kubectl delete deployment user-service-deployment --ignore-not-found=true
kubectl delete deployment product-service-deployment --ignore-not-found=true
kubectl delete deployment order-service-deployment --ignore-not-found=true

# Delete services
echo "Deleting services..."
kubectl delete service mongodb-service --ignore-not-found=true
kubectl delete service user-service --ignore-not-found=true
kubectl delete service product-service --ignore-not-found=true
kubectl delete service order-service --ignore-not-found=true

# Delete PVC and PV
echo "Deleting persistent volumes..."
kubectl delete pvc mongodb-pvc --ignore-not-found=true
kubectl delete pv mongodb-pv --ignore-not-found=true

# Delete ConfigMap and Secret
echo "Deleting ConfigMap and Secret..."
kubectl delete configmap mongodb-init-script --ignore-not-found=true
kubectl delete secret mongodb-secret --ignore-not-found=true

echo "Cleanup completed! You can now run the deployment script again."
echo "Run: ./deploy.sh"
