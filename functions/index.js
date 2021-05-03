const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

//  Inicializar la app
const app = express();
admin.initializeApp({
  credential: admin.credential.cert('./credentials.json'),
});
// db firestore
const db = admin.firestore();

// Actions
app.get('/hello-world', (req, res) => {
  res.status(200).json({ message: 'Hello world' });
});

app.post('/api/products', async (req, res) => {
  try {
    await db
      .collection('products')
      .doc('/' + req.body.id + '/')
      .create({ name: req.body.name });
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.get('/api/products/:product_id', (req, res) => {
  (async () => {
    try {
      const doc = db.collection('products').doc(req.params.product_id);
      const item = await doc.get();
      const response = item.data();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

app.get('/api/products', async (req, res) => {
  try {
    const query = db.collection('products');
    const querySanpshot = await query.get();
    const docs = querySanpshot.docs;
    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/api/products/:product_id', async (req, res) => {
  try {
    const document = db.collection('products').doc(req.params.product_id);
    await document.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

// Exprot
exports.app = functions.https.onRequest(app);
