#!/bin/bash
echo 'Stopping docker compose...'
docker compose -f docker-compose.yml \
  -f docker-compose-prometheus.yml \
  -f docker-compose-grafana.yml \
  -f docker-compose-load.yml \
  -f docker-compose-zipkin.yml \
  down
