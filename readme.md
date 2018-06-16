# Hyrdalot
## TechFest Munich 2018
IOT for Hyrdalics Systems

View the dashboard [here](/)




### Curl Examples:



#### Sending a usage log:

curl -X POST \
  http://localhost:5000/hydralot-8025a/us-central1/addUsageLog \
  -H 'Content-Type: application/json' \
  -d '{
	"date":123456,
	"usage": 100
}'


#### Sending a warning message

curl -X POST \
  http://localhost:5000/hydralot-8025a/us-central1/addWarningLog \
  -H 'Content-Type: application/json' \
  -d '{
	"date":123456,
	"message": "Exceeded maximum capacity"
}'


#### Get Current Price
curl http://localhost:5000/hydralot-8025a/us-central1/currentPrice

#### Get activity log
curl http://localhost:5000/hydralot-8025a/us-central1/activity

#### Get Warning Log
curl http://localhost:5000/hydralot-8025a/us-central1/warningLog

#### Clear all data
curl http://localhost:5000/hydralot-8025a/us-central1/clearLogs
