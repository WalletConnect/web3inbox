const MAX_FIREBASE_RETRY_COUNT = 3;

export const getFirebaseToken = async (retryCount = 0): Promise<string | null> => {
  if (retryCount >= MAX_FIREBASE_RETRY_COUNT) {
    return null
  }

  const { initializeApp } = await import('firebase/app')
  const { getMessaging, getToken } = await import('firebase/messaging')

  const firebaseApp = initializeApp({
    apiKey: "AIzaSyC-tpdIHBkzdEvGXtpIc-pS6qwVhyNkTc4",
    authDomain: "javascript-fcm-v1.firebaseapp.com",
    projectId: "javascript-fcm-v1",
    storageBucket: "javascript-fcm-v1.appspot.com",
    messagingSenderId: "407161152156",
    appId: "1:407161152156:web:c85abffa07cfa1af90c359"
  })

  const messaging = getMessaging(firebaseApp)

  try {
    return getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY
    })
  } catch (e) {
    return getFirebaseToken(retryCount + 1)
  }
}
