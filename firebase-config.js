// ================================
// Firebase Configuration
// ================================
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Go to Project Settings → Service Accounts
// 4. Copy your Web API Key and Project ID
// 5. Enable Email/Password authentication:
//    - Go to Authentication → Sign-in method
//    - Enable "Email/Password"
// 6. Create Realtime Database (or Firestore)
// 7. Set security rules (see below)
// 8. Fill in the firebaseConfig object below with your credentials

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Get from Firebase Console → Project Settings
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Replace YOUR_PROJECT_ID
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID", // Get from Firebase Console
  appId: "YOUR_APP_ID", // Get from Firebase Console
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Auth and Database
const auth = firebase.auth();
const database = firebase.database();

// ================================
// Authentication Functions
// ================================

/**
 * Login with email and password
 */
function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

/**
 * Create new user account
 */
function signupUser(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

/**
 * Logout current user
 */
function logoutUser() {
  return auth.signOut();
}

/**
 * Get current user
 */
function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
function isUserLoggedIn() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(!!user);
    });
  });
}

/**
 * Listen for auth state changes
 */
function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

// ================================
// Database Functions
// ================================

/**
 * Save content to database
 * @param {string} path - Database path (e.g., 'projects/project1')
 * @param {object} data - Data to save
 */
function saveContent(path, data) {
  return database.ref(path).set({
    ...data,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
}

/**
 * Get content from database
 * @param {string} path - Database path
 */
function getContent(path) {
  return database.ref(path).once('value').then(snapshot => snapshot.val());
}

/**
 * Listen to content changes in real-time
 * @param {string} path - Database path
 * @param {function} callback - Callback function
 */
function onContentChange(path, callback) {
  return database.ref(path).on('value', snapshot => {
    callback(snapshot.val());
  });
}

/**
 * Update content in database
 * @param {string} path - Database path
 * @param {object} updates - Fields to update
 */
function updateContent(path, updates) {
  return database.ref(path).update({
    ...updates,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
}

/**
 * Delete content from database
 * @param {string} path - Database path
 */
function deleteContent(path) {
  return database.ref(path).remove();
}

// ================================
// Database Security Rules
// ================================
/*
COPY THESE RULES TO YOUR FIREBASE REALTIME DATABASE:

{
  "rules": {
    "admin": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "projects": {
      ".read": true,
      ".write": "auth != null"
    },
    "blog": {
      ".read": true,
      ".write": "auth != null"
    },
    ".read": false,
    ".write": false
  }
}

This allows:
- Public read access to projects and blog
- Authenticated write access only
- Admin data restricted to authenticated users only
*/
