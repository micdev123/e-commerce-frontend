// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXY-OHvHMXd4y8WCvBNIQL8JZt7ttcksU",
  authDomain: "e-commerce-app-7a85f.firebaseapp.com",
  projectId: "e-commerce-app-7a85f",
  storageBucket: "e-commerce-app-7a85f.appspot.com",
  messagingSenderId: "445038725240",
  appId: "1:445038725240:web:230b70fa5a5a3d946a858d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export app
export default app;