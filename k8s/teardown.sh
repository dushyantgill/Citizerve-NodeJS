#!/bin/bash
kubectl delete -f generators/memory-leak-generator-deployment.yaml
kubectl delete -f generators/latency-generator-deployment.yaml
kubectl delete -f generators/load-generator-deployment.yaml

kubectl delete -f resourceapi-deployment.yaml
kubectl delete -f citizenapi-deployment.yaml

kubectl delete -f zipkin/zipkin-deployment.yaml
kubectl delete -f mongo/mongo-express-deployment.yaml
kubectl delete -f mongo/mongodb-deployment.yaml
