// Mobile burger menu toggle
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Get current session user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Log out user
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Update header state based on auth
function updateHeaderAuth() {
  const user = getCurrentUser();
  const headerUserName = document.getElementById('headerUserName');

  if (user) {
    document.body.classList.add('logged-in');
    if (headerUserName) {
      headerUserName.textContent = user.name;
    }
  } else {
    document.body.classList.remove('logged-in');
  }
}

document.querySelectorAll('#logoutBtn, #cabLogoutBtn').forEach(btn => {
  btn.addEventListener('click', logout);
});

updateHeaderAuth();

// Switch tabs on auth.html
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    loginForm.classList.toggle('active', target === 'login');
    registerForm.classList.toggle('active', target === 'register');
  });
});

// Registration validation & storage
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const agree = document.getElementById('regAgree').checked;

    document.querySelectorAll('#registerForm .error-msg, #regGlobalError').forEach(el => {
      el.textContent = '';
    });

    let isValid = true;

    if (!name) {
      document.getElementById('regNameError').textContent = 'Please enter your name or handle';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('regEmailError').textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (password.length < 6) {
      document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirm) {
      document.getElementById('regConfirmError').textContent = 'Passwords do not match';
      isValid = false;
    }

    if (!agree) {
      document.getElementById('regAgreeError').textContent = 'You must agree to the terms';
      isValid = false;
    }

    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
      document.getElementById('regGlobalError').textContent = 'An account with this email already exists';
      return;
    }

    const newUser = {
      name,
      email,
      password,
      favorites: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    window.location.href = 'cabinet.html';
  });
}

// Login validation & session creation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    document.querySelectorAll('#loginForm .error-msg, #loginGlobalError').forEach(el => {
      el.textContent = '';
    });

    let isValid = true;
    if (!email) {
      document.getElementById('loginEmailError').textContent = 'Please enter your email';
      isValid = false;
    }
    if (!password) {
      document.getElementById('loginPasswordError').textContent = 'Please enter your password';
      isValid = false;
    }
    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      document.getElementById('loginGlobalError').textContent = 'Invalid email or password';
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'cabinet.html';
  });
}

// Dashboard access protection on cabinet.html
const cabinetContent = document.getElementById('cabinetContent');
const deniedBlock = document.getElementById('deniedBlock');

if (cabinetContent && deniedBlock) {
  const user = getCurrentUser();
  if (!user) {
    deniedBlock.style.display = 'block';
    cabinetContent.style.display = 'none';
  } else {
    deniedBlock.style.display = 'none';
    cabinetContent.style.display = 'block';

    document.getElementById('cabUserName').textContent = user.name;
    document.getElementById('cabUserEmail').textContent = user.email;
    document.getElementById('cabUserDate').textContent = new Date(user.createdAt).toLocaleDateString('en-US');
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
  }
}