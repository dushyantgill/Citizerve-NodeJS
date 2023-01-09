# usage: to create a citizen with specific citizenId that 
# increases api response time for the post resource API 
# with citizenapi service running on http://localhost:3000
# ./latency.sh "http://localhost:3000"
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
  post "$1/api/citizens" '{"citizenId":"ba95f09a-df81-4b08-981e-6d413de64949","givenName":"Chiquita","surname":"Leaman","phoneNumber":"(469) 573 - 0631","streetAddress":"842 Grove Avenue","city":"Irving","state":"TX","postalCode":"75038","country":"US"}'
  echo '\nReading citizen\n------------'
  for i in `seq 1 $max`
  do
    get "$1/api/citizens/ba95f09a-df81-4b08-981e-6d413de64949"
  done
  echo '\nDeleting citizen\n------------'
  delete "$1/api/citizens/ba95f09a-df81-4b08-981e-6d413de64949"
done