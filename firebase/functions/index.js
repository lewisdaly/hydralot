const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const fs = admin.firestore();

exports.currentPrice = functions.https.onRequest((request, response) => {
  //TODO: lookup all of the events in the database, and calculate the price from them;

  response.send("103.42");
});


exports.activity = functions.https.onRequest((request, response) => {

  //TODO: lookup in the database: `/logs`
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
  
  //TODO: lookup in the database: `/warnings`
  //Array of timestamps and warning messages
  response.send([
    { date: 12345, message: "Crane tipped over" },
    { date: 12345, message: "Maximum usage exeeded" },
  ]);
});


exports.addUsageLog = functions.https.onRequest((request, response) => {
  const { date, usage } = request.body;

  return fs.collection(`logs`).doc(`${date}`).set({ usage })
    .then(() => response.send(true));
});


exports.addWarning = functions.https.onRequest((request, response) => {
  const { date, message } = request.body;

  return fs.collection(`warnings`).doc(`${date}`).set({ message })
    .then(() => response.send(true));
});

//TODO: look for warnings in database, and send slack/email alerts



exports.clearLogs = functions.https.onRequest((request, response) => {
  return Promise.all([
    deleteCollection(fs, 'warnings', 100),
    deleteCollection(fs, 'logs', 100),
  ])
  .then(() => response.send(true));
});


function deleteCollection(db, collectionPath, batchSize) {
  var collectionRef = db.collection(collectionPath);
  var query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
