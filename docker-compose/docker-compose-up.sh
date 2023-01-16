#!/bin/bash
echo 'Building docker images...'
docker compose -f docker-compose.yml \
  -f docker-compose-prometheus.yml \
  -f docker-compose-grafana.yml \
  -f docker-compose-load.yml \
  -f docker-compose-zipkin.yml \
  build

echo 'Starting docker compose...'
docker compose -f docker-compose.yml \
  -f docker-compose-prometheus.yml \
  -f docker-compose-grafana.yml \
  -f docker-compose-load.yml \
  -f docker-compose-zipkin.yml \
  up -d

echo '----------------------------------------'
echo 'Citizen API should be running at http://localhost:8081/api/citizens'
echo 'Resource API should be running at http://localhost:8082/api/resources'
echo 'Mongo DB should be runnint at localhost:27017'
echo 'Prometheus should be running at http://localhost:9090'
echo 'Grafana should be running at http://localhost:3000'
echo 'Zipkin should be running at http://localhost:9411'
echo 'Load Generator should be running and generating load against the Citizen API'
