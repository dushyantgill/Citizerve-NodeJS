#!/bin/bash
# usage: to create a citizen with specific citizenId that causes 
# memory leak in citizenapi service running on http://localhost:8081
# ./leakMemory.sh "http://localhost:8081"
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
  post "$1/api/citizens" '{"citizenId":"3b42e011-3491-4018-a893-e0e7c9755fbd","givenName":"Carolyne","surname":"Haygood","phoneNumber":"(574) 605 - 3816","streetAddress":"770 Steve Hunt Road","city":"Michigan City","state":"IN","postalCode":"46360","country":"US"}'
  echo '\nReading citizen\n------------'
  for i in `seq 1 $max`
  do
    get "$1/api/citizens/3b42e011-3491-4018-a893-e0e7c9755fbd"
  done
  echo '\nDeleting citizen\n------------'
  delete "$1/api/citizens/3b42e011-3491-4018-a893-e0e7c9755fbd"
done