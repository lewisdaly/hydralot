const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const fs = admin.firestore();
const nodemailer = require('nodemailer');

exports.currentPrice = functions.https.onRequest((request, response) => {
  //price per warning: 2.00
  //Price per activity log: 50c
  const warningPrice = 2.05;
  const logPrice = 0.01;

  return Promise.all([
    fs.collection('warnings').get().then(snap => snap.size),
    fs.collection('logs').get().then(snap => snap.size),
  ])
  .then(([warningCount, logCount]) => {
    return warningCount * warningPrice + logCount * logPrice;
  })
  .then(price => {
    response.send(`${price}`);
  });
});


exports.random = functions.https.onRequest((request, response) => {
  response.send({value: Math.floor(Math.random() * Math.floor(100))});
});

exports.activity = functions.https.onRequest((request, response) => {
  
  return fs.collection('logs').orderBy('date', 'desc').limit(1).get()
    .then(snapshot => {
      const values = [];
      snapshot.forEach(doc => {
        values.push(doc.data().usage);
      });

      response.send({value: values[0]});
    });

});


exports.warningLog = functions.https.onRequest((request, response) => {

  return fs.collection('warnings').orderBy('date', 'asc').get()
  .then(snapshot => {

    const values = [];
    snapshot.forEach(doc => values.push(doc.data()));
    console.log("found values");
    response.send(values);
  });
});

exports.addUsageLog = functions.https.onRequest((request, response) => {
  const { date, usage } = request.body;

  return fs.collection(`logs`).doc(`${date}`).set({ date, usage })
    .then(() => response.send(true));
});


exports.addWarningLog = functions.https.onRequest((request, response) => {
  const { date, message } = request.body;

  return fs.collection(`warnings`).doc(`${date}`).set({ date, message })
    .then(() => sendEmail(message))
    .then(() => response.send(true));
});

exports.clearLogs = functions.https.onRequest((request, response) => {
  return Promise.all([
    deleteCollection(fs, 'warnings', 100),
    deleteCollection(fs, 'logs', 100),
  ])
  .then(() => response.send(true));
});



/**
 * Utils
 * 
 */

function sendEmail(message) {
  return new Promise((resolve, reject) => {
    const user = functions.config().gmail.username;
    const pass = functions.config().gmail.password;
    const destination = functions.config().gmail.destination;
    console.log("email, password, dest", user, pass, destination);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      }
    });

    var mailOptions = {
      from: user,
      to: destination ,
      subject: 'You have an alert from HydralIOT',
      text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info.response);
      }
    }); 
  });
}


//ref: https://firebase.google.com/docs/firestore/manage-data/delete-data
function deleteCollection(db, collectionPath, batchSize) {
  var collectionRef = db.collection(collectionPath);
  var query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  return query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
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
        resolve(true);
        return true;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        return deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
