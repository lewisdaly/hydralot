const functions = require('firebase-functions');

exports.currentPrice = functions.https.onRequest((request, response) => {
  //TODO: lookup all of the events in the database, and calculate the price from them;

  response.send(103.42);
});


exports.activity = functions.https.onRequest((request, response) => {

  //Array of timestamps and utilization (0-100%)
  response.send([
    {date:12345,usage:40},
    {date:12346,usage:41},
    {date:12347,usage:42},
    {date:12348,usage:100},
    {date:12349,usage:100},
  ])
});


exports.warningLog = functions.https.onRequest((request, response) => {

  //Array of timestamps and warning messages
  response.send([
    { date: 12345, message: "Crane tipped over" },
    { date: 12345, message: "Maximum usage exeeded" },
  ]);

});


//TODO: look for warnings in database, and send slack/email alerts