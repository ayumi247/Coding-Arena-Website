// ============================================
// Coding Arena - Main JavaScript
// ============================================

const API_BASE = 'http://localhost:3000/api';

// ─── Dark Mode ────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const htmlEl = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('ca_theme', theme);
  darkToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

(function initTheme() {
  const saved = localStorage.getItem('ca_theme') || 'light';
  setTheme(saved);
})();

darkToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ─── Page Loader ──────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }, 600);
  }
});

// ─── Mobile Nav ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger?.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  hamburger.classList.toggle('open');
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
  });
});

// ─── Navbar Scroll Effect ─────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ─── Scroll to Top ────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Animate on Scroll ────────────────────────
const animateEls = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
animateEls.forEach(el => observer.observe(el));

// ─── Curriculum Tabs ──────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) {
      target.classList.add('active');
    }
  });
});

// ─── Star Rating ──────────────────────────────
let selectedRating = 0;
document.querySelectorAll('.star-rating button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRating = parseInt(btn.dataset.val);
    document.querySelectorAll('.star-rating button').forEach((b, i) => {
      b.classList.toggle('active', i < selectedRating);
    });
  });
});

// ─── Contact Form Submit ──────────────────────
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const msg = document.getElementById('contactMsg');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const data = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    phone: contactForm.phone.value.trim(),
    school_name: contactForm.school_name.value.trim(),
    role: contactForm.role.value,
    message: contactForm.message.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      showMsg(msg, result.message, 'success');
      contactForm.reset();
    } else {
      showMsg(msg, result.error || 'Something went wrong.', 'error');
    }
  } catch (err) {
    showMsg(msg, 'Could not connect to server. Please email us directly.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
});

// ─── Feedback Form Submit ─────────────────────
const feedbackForm = document.getElementById('feedbackForm');
feedbackForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = feedbackForm.querySelector('button[type="submit"]');
  const msg = document.getElementById('feedbackMsg');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const data = {
    name: feedbackForm.fname.value.trim(),
    email: feedbackForm.femail.value.trim(),
    school_name: feedbackForm.fschool.value.trim(),
    rating: selectedRating || null,
    message: feedbackForm.fmessage.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      showMsg(msg, result.message, 'success');
      feedbackForm.reset();
      selectedRating = 0;
      document.querySelectorAll('.star-rating button').forEach(b => b.classList.remove('active'));
    } else {
      showMsg(msg, result.error || 'Something went wrong.', 'error');
    }
  } catch (err) {
    showMsg(msg, 'Could not connect to server.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Feedback';
  }
});

// ─── Newsletter ───────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector('input[type="email"]');
  const btn = newsletterForm.querySelector('button');
  const email = emailInput.value.trim();
  if (!email) return;
  btn.disabled = true; btn.textContent = '...';
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await res.json();
    if (result.success) {
      emailInput.value = '';
      btn.textContent = '✓ Done!';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    } else {
      btn.textContent = 'Try again'; btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Error'; btn.disabled = false;
  }
});

// ─── Load Featured Testimonials ───────────────
async function loadTestimonials() {
  const container = document.getElementById('testimonialsList');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/feedback/featured`);
    const data = await res.json();
    if (data.length) {
      container.innerHTML = data.map(t => `
        <div class="testimonial-card animate-on-scroll">
          <div class="stars">${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}</div>
          <p>"${escapeHtml(t.message)}"</p>
          <div class="testimonial-author">
            <strong>${escapeHtml(t.name)}</strong>
            <span>${escapeHtml(t.school_name || '')}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    // Keep static fallback content
  }
}
loadTestimonials();

// ─── Counter Animation ────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ─── Helpers ──────────────────────────────────
function showMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}
function escapeHtml(str) {
  return str?.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') || '';
}
