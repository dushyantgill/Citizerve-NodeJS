#!/bin/bash
# usage: to create a citizen with specific citizenId that 
# increases api response time for the post resource API 
# with citizenapi service running on http://localhost:8081
# ./latency.sh "http://localhost:8081"
START=$(date +%s);

get () {
  curl "$1" -s -w "%{http_code}\n"
}

post () {
  curl -X POST "$1" -H 'Content-Type: application/json' -d "$2" -s -w "%{http_code}\n"
}

delete () {
  curl -X DELETE "$1" -s -w "%{http_code}\n"
}

while true
do
  echo '\n'
  echo $(($(date +%s) - START)) | awk '{print int($1/60)":"int($1%60)}'
  sleep 1
  echo '\nCreating citizen\n------------'
  post "$1/api/citizens" '{"citizenId":"16a8efb0-e616-418b-b8fd-4222244db739","givenName":"Dorinda","surname":"Marcum","phoneNumber":"(218) 813 - 3426","streetAddress":"121 Birch  Street","city":"WOLVERTON","state":"MN","postalCode":"56594","country":"US"}'
  echo '\nReading citizen\n------------'
  for i in `seq 1 $max`
  do
    get "$1/api/citizens/16a8efb0-e616-418b-b8fd-4222244db739"
  done
  echo '\nDeleting citizen\n------------'
  delete "$1/api/citizens/16a8efb0-e616-418b-b8fd-4222244db739"
done