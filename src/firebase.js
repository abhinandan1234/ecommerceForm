import firebase from 'firebase/app';
import 'firebase/storage';

// Initialize Firebase
var config = {
    apiKey: 'AIzaSyBEqgwsM5BODFkpW_7YpCDAumFzoyZAiv8',
    authDomain: 'ecommercepro-53bc9.firebaseapp.com',
    databaseURL: 'https://ecommercepro-53bc9.firebaseio.com',
    projectId: 'ecommercepro-53bc9',
    storageBucket: 'ecommercepro-53bc9.appspot.com',
    messagingSenderId: '738241677907',
    appId: '1:738241677907:web:4d1bdff9320d1e83',
};
firebase.initializeApp(config);

const storage = firebase.storage();

export { storage, firebase as default };