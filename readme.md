# Hyrdalot
## TechFest Munich 2018
IOT for Hyrdalics Systems

View the dashboard [here](/)




### Curl Examples:



#### Sending a usage log:

curl -X POST \
  https://us-central1-hydralot-8025a.cloudfunctions.net/addUsageLog \
  -H 'Content-Type: application/json' \
  -d '{
	"date":123456,
	"usage": 100
}'


#### Sending a warning message

curl -X POST \
  https://us-central1-hydralot-8025a.cloudfunctions.net/addWarningLog \
  -H 'Content-Type: application/json' \
  -d '{
	"date":123456,
	"message": "Exceeded maximum capacity"
}'


curl -X POST https://us-central1-hydralot-8025a.cloudfunctions.net/addWarningLog -H 'Content-Type: application/json' -d '{"date":123456, "message":"Exceeded maximum capacity"}'


#### Get Current Price
curl https://us-central1-hydralot-8025a.cloudfunctions.net/currentPrice

#### Get activity log
curl https://us-central1-hydralot-8025a.cloudfunctions.net/activity

#### Get Warning Log
curl https://us-central1-hydralot-8025a.cloudfunctions.net/warningLog

#### Clear all data
curl https://us-central1-hydralot-8025a.cloudfunctions.net/clearLogs



## Configure Env Variables
source .env
firebase functions:config:set gmail.username="lwdaly92@gmail.com" gmail.password=$GMAIL_PASSWORD gmail.destination='m0t3h2f3w7g4v1d0@vessels-tech.slack.com'
