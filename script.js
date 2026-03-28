const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(express.json()); // To handle JSON data from your website

// 1. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Use Firestore for flexible pet data

// 2. Create a "Book Appointment" Route
app.post('/book-appointment', async (req, res) => {
  try {
    const { petName, service, ownerEmail } = req.body;

    // Save to Firestore collection named 'appointments'
    const docRef = await db.collection('appointments').add({
      petName,
      service,
      ownerEmail,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send({ message: 'Success!', id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));