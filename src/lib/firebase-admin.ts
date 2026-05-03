import admin from "firebase-admin";

let initError = null;
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } else {
      admin.initializeApp({ projectId: "demo-project" });
    }
  }
} catch (e: any) {
  initError = e.message;
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get: (target, prop) => {
    if (initError) throw new Error("Firebase Init Failed: " + initError);
    return (admin.firestore() as any)[prop];
  }
});
