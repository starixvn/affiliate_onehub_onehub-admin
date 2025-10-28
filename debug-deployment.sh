#!/bin/bash
# Debug script for aff-12b-admin-local deployment

NAMESPACE="aff"
DEPLOYMENT="aff-12b-admin-local-deployment"

echo "======================================"
echo "Debugging: $DEPLOYMENT"
echo "======================================"
echo ""

echo "1. Checking Deployment Status..."
kubectl get deployment $DEPLOYMENT -n $NAMESPACE
echo ""

echo "2. Checking Pod Status..."
kubectl get pods -n $NAMESPACE -l app=aff-12b-admin-local
echo ""

echo "3. Describing Deployment..."
kubectl describe deployment $DEPLOYMENT -n $NAMESPACE
echo ""

echo "4. Getting Pod Events..."
POD=$(kubectl get pods -n $NAMESPACE -l app=aff-12b-admin-local -o jsonpath='{.items[0].metadata.name}')
if [ -n "$POD" ]; then
    echo "Pod: $POD"
    echo ""
    echo "Pod Events:"
    kubectl describe pod $POD -n $NAMESPACE | grep -A 20 "Events:"
    echo ""
    
    echo "5. Checking Pod Logs..."
    echo "===== Current Logs ====="
    kubectl logs $POD -n $NAMESPACE --tail=50
    echo ""
    
    echo "===== Previous Logs (if crashed) ====="
    kubectl logs $POD -n $NAMESPACE --previous --tail=50 2>/dev/null || echo "No previous logs (pod didn't crash)"
else
    echo "No pods found!"
fi
echo ""

echo "6. Checking Service..."
kubectl get svc aff-12b-admin-local-service -n $NAMESPACE
echo ""

echo "7. Quick Fix Commands:"
echo "   Restart deployment: kubectl rollout restart deployment $DEPLOYMENT -n $NAMESPACE"
echo "   Delete pod (force restart): kubectl delete pod \$POD_NAME -n $NAMESPACE"
echo "   View live logs: kubectl logs -f \$POD_NAME -n $NAMESPACE"

