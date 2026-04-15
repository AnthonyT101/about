// ================================
// Login Page Logic
// ================================

// Check if user is already logged in
onAuthStateChanged((user) => {
  if (user) {
    // Redirect to admin panel if already logged in
    window.location.href = 'admin.html';
  }
});

// ================================
// Login Form Handling
// ================================

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginCard = document.querySelector('.login-card');
const signupCard = document.getElementById('signupCard');
const signupToggle = document.getElementById('signupToggle');
const loginToggle = document.getElementById('loginToggle');

// Toggle between login and signup
signupToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  loginCard.style.display = 'none';
  signupCard.style.display = 'block';
});

loginToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  signupCard.style.display = 'none';
  loginCard.style.display = 'block';
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMessage');
  const successMsg = document.getElementById('successMessage');

  // Clear previous messages
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
  successMsg.textContent = '';
  successMsg.classList.remove('show');

  // Disable button and show spinner
  loginBtn.disabled = true;
  loginBtn.querySelector('.btn-text').style.display = 'none';
  loginBtn.querySelector('.btn-spinner').style.display = 'inline';

  try {
    await loginUser(email, password);

    // Save preference
    if (rememberMe) {
      localStorage.setItem('rememberEmail', email);
    } else {
      localStorage.removeItem('rememberEmail');
    }

    successMsg.textContent = 'Login successful! Redirecting...';
    successMsg.classList.add('show');

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1000);

  } catch (error) {
    errorMsg.textContent = formatErrorMessage(error.code);
    errorMsg.classList.add('show');

    // Re-enable button
    loginBtn.disabled = false;
    loginBtn.querySelector('.btn-text').style.display = 'inline';
    loginBtn.querySelector('.btn-spinner').style.display = 'none';
  }
});

// Signup form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const signupBtn = document.getElementById('signupBtn');
  const errorMsg = document.getElementById('signupError');
  const successMsg = document.getElementById('signupSuccess');

  // Clear previous messages
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
  successMsg.textContent = '';
  successMsg.classList.remove('show');

  // Validate passwords match
  if (password !== confirm) {
    errorMsg.textContent = 'Passwords do not match';
    errorMsg.classList.add('show');
    return;
  }

  // Disable button and show spinner
  signupBtn.disabled = true;
  signupBtn.querySelector('.btn-text').style.display = 'none';
  signupBtn.querySelector('.btn-spinner').style.display = 'inline';

  try {
    await signupUser(email, password);

    successMsg.textContent = 'Account created successfully! Redirecting...';
    successMsg.classList.add('show');

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1000);

  } catch (error) {
    errorMsg.textContent = formatErrorMessage(error.code);
    errorMsg.classList.add('show');

    // Re-enable button
    signupBtn.disabled = false;
    signupBtn.querySelector('.btn-text').style.display = 'inline';
    signupBtn.querySelector('.btn-spinner').style.display = 'none';
  }
});

// ================================
// Helper Functions
// ================================

/**
 * Format Firebase error messages
 */
function formatErrorMessage(errorCode) {
  const messages = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/missing-email': 'Email address is required',
    'auth/missing-password': 'Password is required'
  };

  return messages[errorCode] || 'An error occurred. Please try again.';
}

// Pre-fill email if "Remember me" was checked
window.addEventListener('load', () => {
  const savedEmail = localStorage.getItem('rememberEmail');
  if (savedEmail) {
    document.getElementById('email').value = savedEmail;
    document.getElementById('rememberMe').checked = true;
  }
});
