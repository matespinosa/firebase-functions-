const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

//  express
const app = express();

// initialize app
admin.initializeApp({
  credential: admin.credential.cert('./credentials.json'),
});

// Actions
app.get('/hello-world', (req, res) => {
  res.status(200).json({message: 'Hello world'});
});

// products
app.use(require('./routes/products.routes'));

// Exprot
exports.app = functions.https.onRequest(app);
