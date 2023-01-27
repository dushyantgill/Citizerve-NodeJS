#!/bin/bash
kubectl apply -f citizerve-ns.yaml
kubectl apply -f citizerve-secret.yaml
kubectl apply -f citizerve-configmap.yaml

kubectl apply -f mongo/mongodb-pvc.yaml
kubectl apply -f mongo/mongodb-secret.yaml
kubectl apply -f mongo/mongodb-configmap.yaml
kubectl apply -f mongo/mongodb-deployment.yaml
kubectl apply -f mongo/mongo-express-deployment.yaml

#kubectl apply -f zipkin/zipkin-deployment.yaml
#kubectl apply -f jaeger/jaeger-deployment.yaml

kubectl apply -f resourceapi-deployment.yaml
kubectl apply -f citizenapi-deployment.yaml

# kubectl apply -f generators/load-generator-deployment.yaml
# kubectl apply -f generators/latency-generator-deployment.yaml
# kubectl apply -f generators/memory-leak-generator-deployment.yaml
# kubectl apply -f generators/no-start-generator.yaml
# kubectl apply -f generators/snat-port-simulation.yaml

# for GCP
# kubectl apply -f gpc/grafana-data-pvc.yaml
# kubectl apply -f gpc/grafana-ds-pvc.yaml
# kubectl apply -f gpc/grafana-deployment.yaml
# kubectl apply -f gpc/prometheus-ui-deployment.yaml
# kubectl apply -f gpc/citizenapi-pod-monitoring.yaml
# kubectl apply -f gpc/resourceapi-pod-monitoring.yaml

kubectl get all -n citizerve
