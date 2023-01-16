#!/bin/bash
# usage: to fire 25 get citizen requests per second 
# with citizenapi service running on http://localhost:8081
# ./load.sh 25 "http://localhost:8081"
max="$1"
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
  post "$2/api/citizens" '{"citizenId":"dd711c64-0c8d-40ed-88d1-51c534e61d1a","streetAddress":"865 Hamill Avenue","city":"Wilburton","country":"US","givenName":"Everette","phoneNumber":"(918) 710 - 4581","postalCode":"74578","state":"OK","surname":"Mullet"}'
  echo '\nReading citizen\n------------'
  for i in `seq 1 $max`
  do
    get "$2/api/citizens/dd711c64-0c8d-40ed-88d1-51c534e61d1a"
  done
  echo '\nDeleting citizen\n------------'
  delete "$2/api/citizens/dd711c64-0c8d-40ed-88d1-51c534e61d1a"
done