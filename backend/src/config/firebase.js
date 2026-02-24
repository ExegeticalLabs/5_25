const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// In production, use service account key from environment variable or file
let firebaseApp;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountPath) {
    // Use service account file
    const serviceAccount = require(path.resolve(serviceAccountPath));
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Use service account from environment variable (JSON string)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else {
    // Use application default credentials (for local dev / Cloud Run)
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }

  return firebaseApp;
};

module.exports = { initializeFirebase, admin };
