export const getFirebaseToken = async () => {
  console.log('>> getFirebaseToken')

  const { initializeApp } = await import('firebase/app')
  const { getMessaging, getToken } = await import('firebase/messaging')

  console.log('>> getFirebaseToken', 'got packages')

  const firebaseApp = initializeApp({
    apiKey: 'AIzaSyAtOP2BXP4RNK0pN_AEBMkVjgmYqklUlKc',
    authDomain: 'javascript-48655.firebaseapp.com',
    projectId: 'javascript-48655',
    storageBucket: 'javascript-48655.appspot.com',
    messagingSenderId: '295861682652',
    appId: '1:295861682652:web:60f4b1e4e1d8adca230f19',
    measurementId: 'G-0BLLC7N3KW'
  })

  console.log('>> getFirebaseToken', 'initialized app')

  const messaging = getMessaging(firebaseApp)

  console.log('>> getFirebaseToken', 'initialized messaging')

  return getToken(messaging, {
    vapidKey: import.meta.env.VITE_VAPID_KEY
  })
}
