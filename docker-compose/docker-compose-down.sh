#!/bin/bash
echo 'Stopping docker compose...'
docker compose \
 -f docker-compose.yml \
 -f docker-compose-jaeger.yml \
 -f docker-compose-grafana.yml \
 -f docker-compose-load.yml \
 -f docker-compose-prometheus.yml \
 down
