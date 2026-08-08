const hallsData = [
  { id: 1, name: 'Grand Royale Wedding Hall', type: 'Wedding', price: 1500, img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400&h=200' },
  { id: 2, name: 'City Logistics Godown', type: 'Storage', price: 200, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&h=200' },
  { id: 3, name: 'Sunset Guesthouse', type: 'Guest', price: 100, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400&h=200' },
  { id: 4, name: 'Crystal Banquet', type: 'Wedding', price: 1200, img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400&h=200' }
];

document.addEventListener('DOMContentLoaded', () => {
  checkNavAuth();
  applyLanguage();
  applyTheme();
  injectThemeToggle();
  initGravityEffects();
  initLoginSecurity();

  if (document.getElementById('hallsGrid')) {
    renderHalls(hallsData);
  }

  if (document.getElementById('hallDetailContent')) {
    loadHallDetails();
  }

  if (document.getElementById('bookingsList')) {
    loadDashboard();
  }
});

function injectThemeToggle() {
  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn && !document.getElementById('theme-toggle')) {
    langToggleBtn.classList.add('action-btn');
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.type = 'button';
    themeBtn.className = 'action-btn';
    themeBtn.textContent = localStorage.getItem('theme') === 'dark' ? '☀ Light' : '🌙 Dark';
    themeBtn.onclick = toggleTheme;
    langToggleBtn.parentNode.insertBefore(themeBtn, langToggleBtn.nextSibling);
  }
}

function toggleTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  applyTheme();
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = !isDark ? '☀ Light' : '🌙 Dark';
  }
}

function applyTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function getRegisteredUsers() {
  try {
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return Array.isArray(storedUsers) ? storedUsers : [];
  } catch (error) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
}

function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const name = document.getElementById('regName').value.trim();
  const password = document.getElementById('regPass').value;
  const users = getRegisteredUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = password;
  } else {
    users.push({ name, email, password });
  }

  saveRegisteredUsers(users);
  localStorage.setItem('currentUser', JSON.stringify({ name, email }));
  alert('Registration Successful! Redirecting to login...');
  window.location.href = 'login.html';
}

function initLoginSecurity() {
  const prompt = document.getElementById('securityPrompt');
  const answerInput = document.getElementById('securityAnswer');
  if (!prompt || !answerInput) return;

  const first = Math.floor(Math.random() * 7) + 2;
  const second = Math.floor(Math.random() * 6) + 1;
  const answer = first + second;

  prompt.textContent = `Quick check: ${first} + ${second} = ?`;
  prompt.dataset.answer = answer;
  answerInput.value = '';
  answerInput.setAttribute('aria-label', 'Security answer');
}

function validateLoginSecurity() {
  const checkbox = document.getElementById('botCheckBox');
  const answerInput = document.getElementById('securityAnswer');
  const prompt = document.getElementById('securityPrompt');

  if (!checkbox || !answerInput || !prompt) return true;

  if (!checkbox.checked) {
    alert('Please complete the security check before logging in.');
    return false;
  }

  const expected = Number(prompt.dataset.answer || 0);
  const provided = Number(answerInput.value);
  if (!Number.isInteger(provided) || provided !== expected) {
    alert('Security check failed. Please solve the math challenge correctly.');
    initLoginSecurity();
    return false;
  }

  return true;
}

function handleLogin(e) {
  e.preventDefault();
  if (!validateLoginSecurity()) {
    return;
  }

  const email = document.getElementById('logEmail').value.trim().toLowerCase();
  const password = document.getElementById('logPass').value;
  const users = getRegisteredUsers();
  const foundUser = users.find((user) => user.email === email && user.password === password);

  if (!foundUser) {
    alert('You have not registered. Please register first.');
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify({ name: foundUser.name, email }));
  window.location.href = 'dashboard.html';
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function checkNavAuth() {
  const user = localStorage.getItem('currentUser');
  const loginBtn = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');

  if (loginBtn && logoutBtn) {
    if (user) {
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
    }
  }
}

function renderHalls(halls) {
  const grid = document.getElementById('hallsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  if (halls.length === 0) {
    grid.innerHTML = '<p>No halls found matching your search.</p>';
    return;
  }

  halls.forEach((hall) => {
    grid.insertAdjacentHTML('beforeend', `
      <div class="card">
        <img src="${hall.img}" alt="${hall.name}">
        <div class="card-body">
          <div class="card-title">${hall.name}</div>
          <p>Type: ${hall.type}</p>
          <div class="card-price">$${hall.price} / day</div>
          <a href="hall-details.html?id=${hall.id}" class="btn" data-i18n="view_btn">View Details</a>
        </div>
      </div>
    `);
  });

  applyLanguage();
}

function filterHalls() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase();
  const filtered = hallsData.filter((hall) => hall.name.toLowerCase().includes(query) || hall.type.toLowerCase().includes(query));
  renderHalls(filtered);
}

function loadHallDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const hall = hallsData.find((item) => item.id == id);
  const content = document.getElementById('hallDetailContent');

  if (!content) return;
  if (!hall) {
    content.innerHTML = '<h3>Hall not found.</h3>';
    return;
  }

  content.innerHTML = `
    <img src="${hall.img}" style="width:100%; height:400px; object-fit:cover; border-radius:12px;">
    <h2 class="mt-2">${hall.name}</h2>
    <p class="mt-2"><b>Category:</b> ${hall.type}</p>
    <h3 class="card-price mt-2">Price: $${hall.price} per day</h3>
    <p class="mt-2">Features: Air Conditioning, Parking, 24/7 Power Backup, Security.</p>
    <a href="booking.html?id=${hall.id}" class="btn btn-large mt-2" data-i18n="book_now_btn">Book Now</a>
  `;

  applyLanguage();
}

function handleBooking(e) {
  e.preventDefault();
  if (!localStorage.getItem('currentUser')) {
    alert('Please login first to book a hall!');
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const hall = hallsData.find((item) => item.id == id);
  const date = document.getElementById('bookDate').value;
  const guests = document.getElementById('bookGuests').value;

  if (!hall) {
    alert('Selected hall not found.');
    return;
  }

  const booking = { id: Date.now(), hallName: hall.name, date, guests, price: hall.price };
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  alert(`Successfully booked ${hall.name} for ${date}!`);
  window.location.href = 'dashboard.html';
}

function loadDashboard() {
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
    return;
  }

  const list = document.getElementById('bookingsList');
  if (!list) return;

  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (bookings.length === 0) {
    list.innerHTML = '<p>You have no active bookings.</p>';
    return;
  }

  list.innerHTML = bookings.map((booking) => `
    <div class="card p-3 mt-2" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4>${booking.hallName}</h4>
        <p>Date: ${booking.date} | Guests: ${booking.guests}</p>
      </div>
      <div class="card-price" style="margin:0;">$${booking.price}</div>
    </div>
  `).join('');
}

const i18n = {
  en: {
    site_title: 'Hall Booking Platform',
    nav_home: 'Home',
    nav_halls: 'Halls',
    nav_services: 'Services',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_dashboard: 'Dashboard',
    nav_logout: 'Logout',
    hero_title: 'Find Your Perfect Venue',
    hero_subtitle: 'Book wedding halls, party venues, and storage spaces effortlessly.',
    hero_btn: 'Explore Halls',
    gravity_hint: '(Hint: Click the floating emojis to see gravity in action!)',
    halls_title: 'Available Venues',
    search_placeholder: 'Search by name or type...',
    view_btn: 'View Details',
    book_now_btn: 'Book Now',
    book_title: 'Confirm Booking',
    date_label: 'Date',
    guests_label: 'Number of Guests',
    confirm_btn: 'Confirm & Book',
    email_label: 'Email',
    pass_label: 'Password',
    name_label: 'Full Name',
    no_account: "Don't have an account?",
    dash_title: 'Your Bookings',
    about_text: 'We are the leading platform for finding and booking the best venues, wedding halls, and guesthouses. Our mission is to make events easy to organize and simple to attend.',
    send_btn: 'Send Message',
    type_wedding: 'Wedding Halls',
    type_storage: 'Storage Godowns',
    type_guest: 'Guesthouses'
  },
  te: {
    site_title: 'హాల్ బుకింగ్ ప్లాట్‌ఫారం',
    nav_home: 'హోమ్',
    nav_halls: 'హాళ్లు',
    nav_services: 'సేవలు',
    nav_about: 'గురించి',
    nav_contact: 'సంప్రదించండి',
    nav_login: 'లాగిన్',
    nav_register: 'నమోదు',
    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_logout: 'లాగ్ అవుట్',
    hero_title: 'మీ Ideal వేదికను కనుగొనండి',
    hero_subtitle: 'వివాహ హాళ్లు, పార్టీ వేదికలు మరియు నిల్వ స్థలాలను సులభంగా బుక్ చేయండి.',
    hero_btn: 'హాళ్లను అన్వేషించండి',
    gravity_hint: '(సూచన: తేలుతున్న ఈమోజీలపై క్లిక్ చేసి చూడండి!)',
    halls_title: 'ఉపయోగించదగిన వేదికలు',
    search_placeholder: 'పేరు లేదా రకాన్ని శోధించండి...',
    view_btn: 'వివరాలు చూడండి',
    book_now_btn: 'ఇప్పుడే బుక్ చేయండి',
    book_title: 'బుకింగ్ నిర్ధారించండి',
    date_label: 'తేదీ',
    guests_label: 'అతిథుల సంఖ్య',
    confirm_btn: 'నిర్ధారించి బుక్ చేయండి',
    email_label: 'ఇమెయిల్',
    pass_label: 'పాస్వర్డ్',
    name_label: 'పూర్తి పేరు',
    no_account: 'ఖాతా లేదా?',
    dash_title: 'మీ బుకింగ్లు',
    about_text: 'మేము ఉత్తమ వేదికలు, వివాహ హాళ్లు మరియు గెస్ట్‌హౌస్లను కనుగొని బుక్ చేసే ప్రముఖ ప్లాట్‌ఫారం.',
    send_btn: 'సందేశం పంపండి',
    type_wedding: 'వివాహ హాళ్లు',
    type_storage: 'స్టోరేజ్ గోడౌన్స్',
    type_guest: 'గెస్ట్‌హౌస్‌లు'
  }
};

function toggleLanguage() {
  const currentLang = localStorage.getItem('lang') === 'te' ? 'en' : 'te';
  localStorage.setItem('lang', currentLang);
  applyLanguage();
}

function applyLanguage() {
  const lang = localStorage.getItem('lang') || 'en';
  const dict = i18n[lang];

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (dict[key]) {
      if (element.tagName.toLowerCase() === 'title') {
        document.title = dict[key];
      } else {
        element.textContent = dict[key];
      }
    }
  });

  document.querySelectorAll('[data-placeholder-i18n], [data-placeholderi18n]').forEach((element) => {
    const key = element.getAttribute('data-placeholder-i18n') || element.getAttribute('data-placeholderi18n');
    if (dict[key]) {
      element.placeholder = dict[key];
    }
  });
}

function initGravityEffects() {
  const container = document.getElementById('gravity-container');
  const items = document.querySelectorAll('.gravity-item');
  if (!container || items.length === 0) return;

  items.forEach((item) => {
    item.style.left = `${Math.random() * 80 + 10}%`;
    item.style.top = `${Math.random() * 40 + 10}%`;

    item.addEventListener('click', () => {
      item.classList.remove('gravity-anti');
      item.classList.add('gravity-fall');
      const distance = container.offsetHeight - item.offsetTop - 80;
      item.style.transform = `translateY(${distance}px)`;
    });
  });
}