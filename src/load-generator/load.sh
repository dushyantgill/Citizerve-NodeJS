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

generate_unique_id() {
    uuid=$(printf "%04x%04x-%04x-%04x-%04x-%04x%04x%04x\n" \
    $RANDOM $RANDOM \
    $RANDOM \
    $(($RANDOM & 0x0fff | 0x4000)) \
    $(($RANDOM & 0x3fff | 0x8000)) \
    $RANDOM $RANDOM $RANDOM)
    echo "$uuid"
}

while true
do
  echo '\n'
  echo $(($(date +%s) - START)) | awk '{print int($1/60)":"int($1%60)}'
  sleep 1

  unique_id=$(generate_unique_id)
  # echo "The unique ID is: $unique_id"

  echo '\nCreating citizen\n------------'
  # echo "{\"citizenId\":\"${unique_id}\",\"streetAddress\":\"865 Hamill Avenue\",\"city\":\"Wilburton\",\"country\":\"US\",\"givenName\":\"Everette\",\"phoneNumber\":\"(918) 710 - 4581\",\"postalCode\":\"74578\",\"state\":\"OK\",\"surname\":\"Mullet\"}"
  post "$2/api/citizens" "{\"citizenId\":\"${unique_id}\",\"streetAddress\":\"865 Hamill Avenue\",\"city\":\"Wilburton\",\"country\":\"US\",\"givenName\":\"Everette\",\"phoneNumber\":\"(918) 710 - 4581\",\"postalCode\":\"74578\",\"state\":\"OK\",\"surname\":\"Mullet\"}"
  echo '\nReading citizen\n------------'
  for i in `seq 1 $max`
  do
    # echo "$2/api/citizens/$unique_id"
    get "$2/api/citizens/$unique_id"
  done
  echo '\nDeleting citizen\n------------'
  # echo "$2/api/citizens/$unique_id"
  delete "$2/api/citizens/$unique_id"
done