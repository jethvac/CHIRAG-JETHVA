/* ═══════════════════════════════════════════════
   CHIRAG JETHVA — PORTFOLIO SCRIPT.JS
   ═══════════════════════════════════════════════ */
'use strict';

/* ─── 1. LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
    document.body.style.overflow = '';
    startAll();
  }, 2400);
});
document.body.style.overflow = 'hidden';

/* ─── 2. CUSTOM CURSOR ─── */
const cur  = document.getElementById('cur');
const curT = document.getElementById('curT');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});
(function trailLoop() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  curT.style.left = tx + 'px';
  curT.style.top  = ty + 'px';
  requestAnimationFrame(trailLoop);
})();
document.querySelectorAll('a,button,.sk-card,.pcard,.cc,.pf-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('big'); curT.classList.add('big'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curT.classList.remove('big'); });
});

/* ─── 3. SCROLL PROGRESS ─── */
const spBar = document.getElementById('spBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  spBar.style.width = pct + '%';
}, { passive: true });

/* ─── 4. NAVBAR ─── */
const nav      = document.getElementById('nav');
const nlLinks  = document.querySelectorAll('.nl');
const sections = document.querySelectorAll('section[id]');
const btt      = document.getElementById('btt');

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
  btt.classList.toggle('show',  window.scrollY > 400);

  // active nav link
  let cur2 = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur2 = s.id; });
  nlLinks.forEach(l => {
    l.classList.remove('on');
    if (l.getAttribute('href') === '#' + cur2) l.classList.add('on');
  });
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── 5. HAMBURGER / MOBILE MENU ─── */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
const mobOv   = document.getElementById('mobOv');
const mobClose= document.getElementById('mobClose');

function openMob()  { burger.classList.add('x'); mobMenu.classList.add('open'); mobOv.classList.add('show'); }
function closeMob() { burger.classList.remove('x'); mobMenu.classList.remove('open'); mobOv.classList.remove('show'); }

burger.addEventListener('click', openMob);
mobClose.addEventListener('click', closeMob);
mobOv.addEventListener('click', closeMob);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMob));

/* ─── 6. THEME TOGGLE ─── */
const themeBtn = document.getElementById('themeBtn');
const themeIco = document.getElementById('themeIco');
const html     = document.documentElement;
const saved    = localStorage.getItem('cj-theme') || 'dark';
html.setAttribute('data-theme', saved);
updateThemeIco(saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('cj-theme', next);
  updateThemeIco(next);
});
function updateThemeIco(t) {
  themeIco.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ─── 7. SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); }
  });
});

/* ─── 8. HERO CANVAS PARTICLES ─── */
function initCanvas() {
  const cvs = document.getElementById('cvs');
  const ctx = cvs.getContext('2d');
  let W = cvs.width = cvs.offsetWidth;
  let H = cvs.height = cvs.offsetHeight;
  const N = window.innerWidth > 768 ? 75 : 32;
  const pts = [];

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .28;
      this.vy = (Math.random() - .5) * .28;
      this.r  = Math.random() * 1.4 + .5;
      this.a  = Math.random() * .5 + .1;
      this.col= Math.random() > .6 ? '#00d4ff' : '#8b5cf6';
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.globalAlpha = this.a;
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) pts.push(new P());

  function connect() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.globalAlpha = (1 - d/115) * .11;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    pts.forEach(p => { p.move(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = cvs.width = cvs.offsetWidth;
    H = cvs.height = cvs.offsetHeight;
  });
}

/* ─── 9. TYPING EFFECT ─── */
function initTyping() {
  const el = document.getElementById('typed');
  const phrases = [
    'Full Stack Developer',
    'Flutter Developer',
    'Mobile App Engineer',
    'UI/UX Enthusiast',
    'Problem Solver 🚀',
    'Cyber Security Learner 🛡️'
  ];
  let pi = 0, ci = 0, del = false, speed = 120;

  function tick() {
    const cur = phrases[pi];
    if (del) {
      el.textContent = cur.substring(0, ci - 1);
      ci--; speed = 60;
    } else {
      el.textContent = cur.substring(0, ci + 1);
      ci++; speed = 120;
    }
    if (!del && ci === cur.length)  { speed = 2200; del = true; }
    if ( del && ci === 0)           { del = false; pi = (pi+1) % phrases.length; speed = 400; }
    setTimeout(tick, speed);
  }
  tick();
}

/* ─── 10. SCROLL ANIMATIONS (Intersection Observer) ─── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');

        // Trigger skill bars inside
        e.target.querySelectorAll('.sk-fill').forEach(b => {
          const w = b.getAttribute('data-w');
          setTimeout(() => { b.style.width = w + '%'; }, 200);
        });
        // CV skill bars
        e.target.querySelectorAll('.cv-sk-bar div[data-p]').forEach(b => {
          setTimeout(() => { b.style.width = b.getAttribute('data-p') + '%'; }, 200);
        });

        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ─── 11. COUNTER ANIMATION ─── */
function initCounters() {
  const cnts = document.querySelectorAll('.snum[data-c]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, +e.target.getAttribute('data-c'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  cnts.forEach(c => obs.observe(c));
}
function animCount(el, target) {
  const dur = 1800, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ─── 12. SKILL TABS ─── */
function initSkillTabs() {
  document.querySelectorAll('.sk-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sk-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sk-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.getAttribute('data-tab'));
      panel.classList.add('active');

      // Re-animate bars
      panel.querySelectorAll('.sk-fill').forEach(b => {
        b.style.width = '0%';
        setTimeout(() => { b.style.width = b.getAttribute('data-w') + '%'; }, 80);
      });
      // Re-trigger AOS items
      panel.querySelectorAll('[data-aos]').forEach((el, i) => {
        el.classList.remove('vis');
        setTimeout(() => el.classList.add('vis'), i * 55);
      });
    });
  });

  // Init first panel bars
  const firstPanel = document.querySelector('.sk-panel.active');
  if (firstPanel) {
    setTimeout(() => {
      firstPanel.querySelectorAll('.sk-fill').forEach(b => {
        b.style.width = b.getAttribute('data-w') + '%';
      });
    }, 900);
  }
}

/* ─── 13. PROJECT CARD 3D TILT ─── */
function initTilt() {
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      card.style.transform = `translateY(-8px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ─── 14. CERTIFICATE FILTER ─── */
function initCertFilter() {
  document.querySelectorAll('.cf').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cf').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-f');
      document.querySelectorAll('.cc').forEach(c => {
        if (f === 'all' || c.getAttribute('data-cat') === f) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });
}

/* ─── 15. CERTIFICATE MODAL ─── */
window.showCert = function(el) {
  const org   = el.querySelector('.cc-org').textContent;
  const title = el.querySelector('h4').textContent;
  const date  = el.querySelector('p').textContent;
  const key   = el.getAttribute('data-key');
  const pdf   = el.getAttribute('data-pdf') || '';

  document.getElementById('mOrg').textContent   = org;
  document.getElementById('mTitle').textContent = title;
  document.getElementById('mDate').textContent  = date;

  
 
  // PDF section
  const pdfBtn    = document.getElementById('mPdfBtn');
  const pdfViewer = document.getElementById('mPdfViewer');
  const pdfFrame  = document.getElementById('mPdfFrame');
  const pdfLink   = document.getElementById('mPdfLink');

  if (pdf) {
    pdfLink.href = pdf;
    pdfFrame.src = pdf;
    pdfBtn.style.display    = 'block';
    pdfViewer.style.display = 'block';
  } else {
    pdfBtn.style.display    = 'none';
    pdfViewer.style.display = 'none';
    pdfFrame.src = '';
  }

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ─── 16. CONTACT FORM ─── */
window.sendMsg = function(e) {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');
  const ok  = document.getElementById('formOk');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    ok.classList.add('show');
    document.getElementById('ctForm').reset();
    setTimeout(() => ok.classList.remove('show'), 5000);
  }, 2000);
};

/* ─── 17. PRINT / DOWNLOAD CV ─── */
window.printCV = function() {
  window.print();
};

/* ─── 18. CV SKILL BARS OBSERVER ─── */
function initCVSkills() {
  const bars = document.querySelectorAll('.cv-sk-bar div[data-p]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-p') + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => obs.observe(b));
}

/* ─── 19. FLOATING BADGE INTERACTION ─── */
function initBadges() {
  document.querySelectorAll('.tb').forEach(b => {
    b.addEventListener('mouseenter', () => { b.style.transform = 'scale(1.18)'; b.style.zIndex = '10'; });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; b.style.zIndex = ''; });
  });
}

/* ─── 20. STAGGERED GRID REVEAL ─── */
function initGridStagger() {
  const grids = document.querySelectorAll('.proj-grid,.certs-grid,.pf-grid,.stats-grid');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-aos]').forEach((el, i) => {
          setTimeout(() => el.classList.add('vis'), i * 70);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .04 });
  grids.forEach(g => obs.observe(g));
}

/* ─── START ALL ─── */
function startAll() {
  initCanvas();
  initTyping();
  initAOS();
  initCounters();
  initSkillTabs();
  initTilt();
  initCertFilter();
  initCVSkills();
  initBadges();
  initGridStagger();
}
