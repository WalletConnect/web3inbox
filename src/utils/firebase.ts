export const getFirebaseToken = async () => {
  const { initializeApp } = await import('firebase/app')
  const { getMessaging, getToken } = await import('firebase/messaging')

  const firebaseApp = initializeApp({
    apiKey: 'AIzaSyAtOP2BXP4RNK0pN_AEBMkVjgmYqklUlKc',
    authDomain: 'javascript-48655.firebaseapp.com',
    projectId: 'javascript-48655',
    storageBucket: 'javascript-48655.appspot.com',
    messagingSenderId: '295861682652',
    appId: '1:295861682652:web:60f4b1e4e1d8adca230f19',
    measurementId: 'G-0BLLC7N3KW'
  })

  const messaging = getMessaging(firebaseApp)

  return getToken(messaging, {
    vapidKey: import.meta.env.VITE_VAPID_KEY
  })
}
