import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBoCOVs0xweW3UIyXRppGFzMOFErAJRmkU",
    authDomain: "virtual-classroom-65503.firebaseapp.com",
    projectId: "virtual-classroom-65503",
    storageBucket: "virtual-classroom-65503.appspot.com",
    messagingSenderId: "874824854095",
    appId: "1:874824854095:web:d30a683308271fd43e983a"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const store = firebase.storage();


  export {db, auth, store};