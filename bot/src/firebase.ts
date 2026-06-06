import admin from 'firebase-admin';
import firebaseAccount from '../firebase-account.json';

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount as admin.ServiceAccount)
});

export const db = admin.firestore();