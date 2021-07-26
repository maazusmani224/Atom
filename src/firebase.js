import firebase from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyDW8Cxe89WYRV63YkKNSCWLKSbieDQldJ4",
  authDomain: "atom-vc.firebaseapp.com",
  projectId: "atom-vc",
  storageBucket: "atom-vc.appspot.com",
  messagingSenderId: "47508187801",
  appId: "1:47508187801:web:1cd45c85e6f51c84cb6608",
  measurementId: "G-ZNRJPKZ3E3"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const store = firebase.storage();


  export {db, auth, store};