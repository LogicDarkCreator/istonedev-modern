const MATERIALS = [
  {
    id: 1,
    emoji: '⚡',
    title: 'Vanilla JS SPA Architecture',
    category: 'Development',
    readTime: '8 min read',
    desc: 'How to structure state management, client routing, and UI rendering without heavy frameworks.',
    fullText: 'Modern browsers provide a rich DOM API and native ES6+ modules. In this guide, we cover state-driven rendering, localStorage persistence, and clean template literal patterns for fast web applications.'
  },
  {
    id: 2,
    emoji: '🎹',
    title: 'Subtractive Synthesis: From Init to Lead',
    category: 'Music',
    readTime: '12 min read',
    desc: 'Breaking down oscillators, ADSR envelopes, and resonant filters to sculpt rich electronic leads.',
    fullText: 'Subtractive synthesis works by sculpting harmonically rich waveforms like sawtooth or square waves through a resonant low-pass filter. Learn how to map LFOs and envelopes for expressive movement.'
  },
  {
    id: 3,
    emoji: '🕹️',
    title: 'Game Loops & Locked 60 FPS in Canvas',
    category: 'Gaming',
    readTime: '10 min read',
    desc: 'Implementing requestAnimationFrame and deltaTime math for frame-rate independent physics.',
    fullText: 'To prevent character speed from changing on high-refresh-rate monitors, physics updates must scale by deltaTime. We build a clean HTML5 Canvas game loop from scratch.'
  },
  {
    id: 4,
    emoji: '🎨',
    title: 'CSS Grid & Custom Properties for Design Systems',
    category: 'Development',
    readTime: '6 min read',
    desc: 'Building fluid responsive layouts and theme tokens powered by :root variables.',
    fullText: 'CSS custom properties enable instant theme switching, while combining CSS Grid auto-fit with minmax() eliminates brittle media queries across screen sizes.'
  },
  {
    id: 5,
    emoji: '🎚️',
    title: 'Sidechain Compression in Electronic Mixes',
    category: 'Music',
    readTime: '7 min read',
    desc: 'Carving clean headroom for the kick drum and achieving a tight, pumping groove.',
    fullText: 'Sidechain ducking dynamically lowers bass and pad volume whenever the kick hits. Explore threshold, ratio, and release timing curves for transparent or aggressive pumping effects.'
  },
  {
    id: 6,
    emoji: '👾',
    title: 'Procedural Dungeon & Level Generation',
    category: 'Gaming',
    readTime: '15 min read',
    desc: 'Random walk algorithms and Perlin noise techniques for generating replayable worlds.',
    fullText: 'Procedural generation keeps every run fresh. Walk through a 2D grid dungeon generator written in pure JavaScript with connected rooms and corridors.'
  },
  {
    id: 7,
    emoji: '🔐',
    title: 'Client-Side Web App Security Basics',
    category: 'Development',
    readTime: '9 min read',
    desc: 'Preventing XSS injection, sanitizing dynamic templates, and validating user input.',
    fullText: 'Never trust raw user input. Learn how to sanitize dynamic DOM strings, validate form schemas properly, and handle browser storage safely.'
  },
  {
    id: 8,
    emoji: '🔊',
    title: 'Adaptive Audio & Interactive Soundscapes',
    category: 'Gaming',
    readTime: '11 min read',
    desc: 'How game soundtracks dynamically react to player actions and tension levels.',
    fullText: 'Modern games split music into horizontal and vertical stems that crossfade seamlessly based on combat state, velocity, or environmental triggers.'
  }
];

// Favorites management in localStorage
function getFavorites() {
  const user = getCurrentUser();
  return user && Array.isArray(user.favorites) ? user.favorites : [];
}

function toggleFavorite(id) {
  const user = getCurrentUser();
  if (!user) {
    alert('Please sign in to save materials to your favorites!');
    window.location.href = 'auth.html';
    return;
  }

  const favs = user.favorites || [];
  const index = favs.indexOf(id);
  if (index === -1) {
    favs.push(id);
  } else {
    favs.splice(index, 1);
  }
  user.favorites = favs;

  localStorage.setItem('currentUser', JSON.stringify(user));
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIdx = users.findIndex(u => u.email === user.email);
  if (userIdx !== -1) {
    users[userIdx] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }

  renderCards();
  renderCabinetFavorites();
}

// Generate single card HTML
function createCardHTML(item, favIds) {
  const isFav = favIds.includes(item.id);
  return `
    <article class="card">
      <div class="card-cover">
        <span>${item.emoji}</span>
        <button type="button" class="fav-icon-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${item.id})" title="Save to favorites">
          ♥
        </button>
      </div>
      <div class="card-body">
        <span class="card-tag">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        <button type="button" class="btn btn-outline btn-sm" onclick="openMaterial(${item.id})">
          Read More →
        </button>
      </div>
    </article>
  `;
}

// Render cards on home page
let currentCategory = 'all';
let searchQuery = '';

function renderCards() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  const favIds = getFavorites();
  const filtered = MATERIALS.filter(item => {
    const matchCategory = currentCategory === 'all' || item.category === currentCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="subtitle">No materials match your search query.</p>';
    return;
  }

  grid.innerHTML = filtered.map(item => createCardHTML(item, favIds)).join('');
}

// Render saved items on dashboard
function renderCabinetFavorites() {
  const favGrid = document.getElementById('favGrid');
  const favCount = document.getElementById('favCount');
  if (!favGrid) return;

  const favIds = getFavorites();
  const favItems = MATERIALS.filter(m => favIds.includes(m.id));

  if (favCount) favCount.textContent = favItems.length;

  if (favItems.length === 0) {
    favGrid.innerHTML = '<p class="subtitle">You have no saved materials yet. Head back to Home and bookmark cards with the heart icon!</p>';
    return;
  }

  favGrid.innerHTML = favItems.map(item => createCardHTML(item, favIds)).join('');
}

// Filter & search listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    renderCards();
  });
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderCards();
  });
}

// Details modal
const modal = document.getElementById('materialModal');
let activeModalId = null;

function openMaterial(id) {
  const item = MATERIALS.find(m => m.id === id);
  if (!item || !modal) return;

  activeModalId = id;
  document.getElementById('modalEmoji').textContent = item.emoji;
  document.getElementById('modalCategory').textContent = item.category;
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalMeta').textContent = item.readTime;
  document.getElementById('modalText').textContent = item.fullText;

  const isFav = getFavorites().includes(id);
  document.getElementById('modalFavBtn').textContent = isFav ? 'Remove from Favorites' : 'Add to Favorites ♥';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

if (modal) {
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalCloseSecondary').addEventListener('click', closeModal);
  document.getElementById('modalFavBtn').addEventListener('click', () => {
    if (activeModalId) {
      toggleFavorite(activeModalId);
      const isFav = getFavorites().includes(activeModalId);
      document.getElementById('modalFavBtn').textContent = isFav ? 'Remove from Favorites' : 'Add to Favorites ♥';
    }
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Slider logic
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const slider = document.getElementById('slider');
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startSliderAuto() {
  if (!slides.length) return;
  slideTimer = setInterval(nextSlide, 4500);
}

function stopSliderAuto() {
  clearInterval(slideTimer);
}

if (slider) {
  document.getElementById('nextSlide').addEventListener('click', nextSlide);
  document.getElementById('prevSlide').addEventListener('click', prevSlide);
  dots.forEach((dot, idx) => dot.addEventListener('click', () => showSlide(idx)));

  slider.addEventListener('mouseenter', stopSliderAuto);
  slider.addEventListener('mouseleave', startSliderAuto);
  startSliderAuto();
}

// Initial render
renderCards();
renderCabinetFavorites();