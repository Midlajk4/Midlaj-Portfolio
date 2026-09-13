/**
 * Muhammed Midlaj K - Unity Game Developer Portfolio
 * Fully Loaded Version: Interactive Canvas, 5 Projects, Powerups & Boss Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  initNavigation();
  initTerminalTabs();
  initSkillTabs();
  initProjectModalsAndFilters();
  initCvModal();
  initContactSystem();
  initAstroDefenderEXGame();
});

/* ==========================================================================
   GLOBAL AUDIO & TOAST SYSTEM
   ========================================================================== */
let globalAudioCtx = null;
let uiSoundEnabled = true;

function getAudioContext() {
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) globalAudioCtx = new AudioCtx();
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

function playUiSound(type = 'click') {
  if (!uiSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(520, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    // Gracefully handle browser autoplay policies
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);

  playUiSound('success');

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ==========================================================================
   0. BACKGROUND PARTICLES CANVAS
   ========================================================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById('bgParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor(width / 26), 45);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 242, 254,' : 'rgba(157, 78, 221,'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = p.color + '0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   1. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');
  const uiSoundToggle = document.getElementById('uiSoundToggle');

  // Audio toggle
  if (uiSoundToggle) {
    uiSoundToggle.addEventListener('click', () => {
      uiSoundEnabled = !uiSoundEnabled;
      uiSoundToggle.textContent = uiSoundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      if (uiSoundEnabled) playUiSound('click');
    });
  }

  // Attach hover & click sound to interactive buttons
  document.querySelectorAll('button, .btn, .nav-link, .filter-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playUiSound('hover'));
    btn.addEventListener('click', () => playUiSound('click'));
  });

  // Mobile drawer
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. TERMINAL TABS IN HERO
   ========================================================================== */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.term-tab');
  const codes = {
    tab1: document.getElementById('tabCode1'),
    tab2: document.getElementById('tabCode2')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      Object.keys(codes).forEach(key => {
        if (codes[key]) {
          codes[key].classList.toggle('active', key === targetId);
        }
      });
    });
  });
}

/* ==========================================================================
   3. SKILLS TABS
   ========================================================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');
      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. FEATURED ROCKET GAME DATABASE
   ========================================================================== */
const projectDatabase = {
  project1: {
    title: "Galaxy Raider: 2D Arcade Rocket Shooter",
    subtitle: "Unity 2D • C# • Rocket Physics • Rigidbody2D • EXR Study Prototype",
    icon: "🚀",
    overview: "My primary game development prototype built while studying at EXR. Designed to explore real-time gameplay loops, smooth rocket horizontal movement, laser blaster projectile instantiation, asteroid hazard destruction, and audio feedback.",
    mechanics: [
      "Smooth rocket ship horizontal thruster movement clamped to screen bounds using <strong>Rigidbody2D</strong>.",
      "Laser blaster shooting mechanism with custom projectile speed and boundary destruction.",
      "Asteroid obstacle spawner with random velocities, angular rotation, and collision hitboxes.",
      "Real-time score tracking, combo multipliers, and shield/life system.",
      "Playable directly in browser via the Developer Playground above!"
    ],
    architecture: `// Rocket movement and laser firing excerpt
public class RocketController : MonoBehaviour {
    [SerializeField] private float flySpeed = 9.0f;
    [SerializeField] private GameObject laserPrefab;
    private Rigidbody2D rb;

    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update() {
        float h = Input.GetAxisRaw("Horizontal");
        rb.velocity = new Vector2(h * flySpeed, 0f);

        if (Input.GetKeyDown(KeyCode.Space)) {
            Instantiate(laserPrefab, transform.position, Quaternion.identity);
        }
    }
}`
  }
};

function initProjectModalsAndFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal open & close
  const modalBackdrop = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const triggerBtns = document.querySelectorAll('.view-project-details');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectDatabase[projId];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="font-size: 2.2rem;">${data.icon}</span>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--text-main); margin-bottom: 4px;">${data.title}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan);">${data.subtitle}</span>
          </div>
        </div>
        
        <p style="color: var(--text-muted); font-size: 0.98rem; line-height: 1.6; margin-bottom: 20px;">
          ${data.overview}
        </p>

        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-main); margin-bottom: 10px;">
          🎮 Key Gameplay Mechanics:
        </h4>
        <ul style="margin-left: 20px; margin-bottom: 22px; color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
          ${data.mechanics.map(m => `<li style="margin-bottom: 6px;">${m}</li>`).join('')}
        </ul>

        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-main); margin-bottom: 10px;">
          ⚡ C# Architecture Sample:
        </h4>
        <div style="background: #060913; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 14px; margin-bottom: 24px; overflow-x: auto;">
          <pre style="margin: 0; font-family: var(--font-mono); font-size: 0.82rem; color: #38bdf8;"><code>${escapeHtml(data.architecture)}</code></pre>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="https://wa.me/919744525332?text=${encodeURIComponent('Hi Midlaj, I saw your project ' + data.title + ' and would like to discuss it!')}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            Discuss on WhatsApp
          </a>
          <a href="mailto:Muhammadmidlaj20109@gmail.com?subject=Inquiry on ${encodeURIComponent(data.title)}" class="btn btn-primary btn-sm">
            Discuss via Email
          </a>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('projectModal').classList.remove('active')">
            Close Case Study
          </button>
        </div>
      `;

      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    });
  });

  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
        modalBackdrop.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ==========================================================================
   5. CURRICULUM VITAE MODAL
   ========================================================================== */
function initCvModal() {
  const openCvBtn = document.getElementById('openCvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');

  if (openCvBtn && cvModal) {
    openCvBtn.addEventListener('click', () => {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
    });

    if (closeCvModalBtn) {
      closeCvModalBtn.addEventListener('click', () => {
        cvModal.classList.remove('active');
        cvModal.setAttribute('aria-hidden', 'true');
      });
    }

    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        cvModal.classList.remove('active');
        cvModal.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cvModal.classList.remove('active');
        document.getElementById('projectModal').classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   6. CONTACT SYSTEM (DUAL: WHATSAPP + EMAIL + CLIPBOARD COPY)
   ========================================================================== */
function initContactSystem() {
  const form = document.getElementById('contactForm');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const feedback = document.getElementById('formFeedback');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');

  // Copy buttons
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('Muhammadmidlaj20109@gmail.com').then(() => {
        showToast('Email copied to clipboard!');
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+919744525332').then(() => {
        showToast('Phone number copied to clipboard!');
      });
    });
  }

  // Helper to read inputs
  const getFormData = () => {
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('messageSubject').value;
    const message = document.getElementById('senderMessage').value.trim();
    return { name, email, subject, message };
  };

  // WhatsApp Sender
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const data = getFormData();
      if (!data.name || !data.message) {
        alert('Please provide at least your name and message to start a WhatsApp chat.');
        return;
      }
      const text = `Hi Muhammed Midlaj,\n\nName: ${data.name}\nEmail: ${data.email || 'N/A'}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`;
      const waUrl = `https://wa.me/919744525332?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  // Email form submit
  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data.name || !data.email || !data.message) return;

      const mailtoUrl = `mailto:Muhammadmidlaj20109@gmail.com?subject=${encodeURIComponent(data.subject + ' - ' + data.name)}&body=${encodeURIComponent("Sender Name: " + data.name + "\nSender Email: " + data.email + "\n\nMessage:\n" + data.message)}`;

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `✓ Opening your email client to send message to <strong>Muhammadmidlaj20109@gmail.com</strong>...`;
      feedback.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }
}

/* ==========================================================================
   7. ASTRO DEFENDER EX: BOSS BATTLES, POWERUPS, COMBO & SCREEN SHAKE
   ========================================================================== */
function initAstroDefenderEXGame() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const viewport = document.getElementById('canvasViewport');
  const overlay = document.getElementById('gameOverlay');
  const startBtn = document.getElementById('startPlayBtn');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const scoreEl = document.getElementById('gameScore');
  const highScoreEl = document.getElementById('gameHighScore');
  const livesEl = document.getElementById('gameLives');
  const waveEl = document.getElementById('gameWave');
  const comboEl = document.getElementById('gameCombo');
  const soundToggleBtn = document.getElementById('soundToggleBtn');

  // Boss Health Bar Elements
  const bossBarContainer = document.getElementById('bossBarContainer');
  const bossHpFill = document.getElementById('bossHpFill');
  const bossHpText = document.getElementById('bossHpText');

  // Mobile controls
  const btnLeft = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');
  const btnFire = document.getElementById('btnFire');

  let gameSoundEnabled = true;

  function playSynth(type) {
    if (!gameSoundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      if (type === 'laser') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'powerup') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.08);
        osc.frequency.setValueAtTime(800, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'explosion') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'boss_alert') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'hit') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.setValueAtTime(70, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'gameover') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function triggerScreenShake() {
    viewport.classList.remove('screen-shake');
    void viewport.offsetWidth; // trigger reflow
    viewport.classList.add('screen-shake');
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      getAudioContext();
      gameSoundEnabled = !gameSoundEnabled;
      soundToggleBtn.textContent = gameSoundEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
    });
  }

  let savedHighScore = localStorage.getItem('astro_midlaj_highscore') || 0;
  highScoreEl.textContent = savedHighScore;

  // Game Engine State
  let isRunning = false;
  let score = 0;
  let lives = 3;
  let wave = 1;
  let combo = 1;
  let comboTimer = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let shootCooldown = 0;

  // Powerup State
  let tripleShotTimer = 0;

  // Boss State
  let activeBoss = null;

  const keys = { left: false, right: false, space: false };

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'Space') {
      keys.space = true;
      if (isRunning) e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'Space') keys.space = false;
  });

  // Mobile Touch Controls
  if (btnLeft && btnRight && btnFire) {
    const bindTouch = (elem, keyName) => {
      elem.addEventListener('touchstart', (e) => {
        e.preventDefault();
        getAudioContext();
        keys[keyName] = true;
      });
      elem.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys[keyName] = false;
      });
      elem.addEventListener('mousedown', () => {
        getAudioContext();
        keys[keyName] = true;
      });
      elem.addEventListener('mouseup', () => (keys[keyName] = false));
      elem.addEventListener('mouseleave', () => (keys[keyName] = false));
    };

    bindTouch(btnLeft, 'left');
    bindTouch(btnRight, 'right');
    bindTouch(btnFire, 'space');
  }

  // Entities
  const player = {
    x: canvas.width / 2 - 21,
    y: canvas.height - 55,
    width: 42,
    height: 36,
    speed: 400,
    vx: 0,
    invincibleTimer: 0
  };

  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let powerups = [];
  let particles = [];
  let stars = [];

  for (let i = 0; i < 75; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 50 + 15,
      brightness: Math.random() * 0.7 + 0.3
    });
  }

  function resetGame() {
    score = 0;
    lives = 3;
    wave = 1;
    combo = 1;
    comboTimer = 0;
    tripleShotTimer = 0;
    activeBoss = null;
    player.x = canvas.width / 2 - 21;
    player.vx = 0;
    player.invincibleTimer = 0;
    bullets = [];
    enemyBullets = [];
    enemies = [];
    powerups = [];
    particles = [];
    spawnTimer = 0;
    shootCooldown = 0;
    bossBarContainer.classList.add('hidden');
    updateHUD();
  }

  function updateHUD() {
    scoreEl.textContent = score;
    highScoreEl.textContent = savedHighScore;
    livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
    waveEl.textContent = wave;
    comboEl.textContent = `x${combo}`;
  }

  function spawnEnemy() {
    // If boss is active, fewer minions
    if (activeBoss && enemies.length >= 2) return;

    const type = Math.random() > 0.4 ? 'asteroid' : 'drone';
    const size = type === 'asteroid' ? Math.random() * 18 + 18 : 26;
    enemies.push({
      type: type,
      x: Math.random() * (canvas.width - size * 2) + size,
      y: -40,
      size: size,
      speedY: (Math.random() * 60 + 90) * (1 + wave * 0.08),
      speedX: type === 'drone' ? Math.random() * 90 - 45 : 0,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 3,
      hp: type === 'drone' ? 2 : 1,
      color: type === 'asteroid' ? '#94a3b8' : '#f43f5e'
    });
  }

  function spawnBoss() {
    playSynth('boss_alert');
    triggerScreenShake();

    activeBoss = {
      x: canvas.width / 2,
      y: -70,
      targetY: 85,
      width: 140,
      height: 50,
      hp: 30 + wave * 10,
      maxHp: 30 + wave * 10,
      vx: 120,
      shootTimer: 0
    };

    bossBarContainer.classList.remove('hidden');
    updateBossHUD();
  }

  function updateBossHUD() {
    if (!activeBoss) {
      bossBarContainer.classList.add('hidden');
      return;
    }
    const pct = Math.max(0, Math.floor((activeBoss.hp / activeBoss.maxHp) * 100));
    bossHpFill.style.width = `${pct}%`;
    bossHpText.textContent = `${pct}%`;
  }

  function spawnPowerup(x, y) {
    const r = Math.random();
    let type = 'triple';
    if (r > 0.65) type = 'shield';
    else if (r > 0.4) type = 'bomb';

    powerups.push({
      x: x,
      y: y,
      type: type,
      size: 16,
      vy: 110
    });
  }

  function createExplosion(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 180 + 40;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
        size: Math.random() * 3 + 1.5,
        color: color
      });
    }
  }

  function gameOver() {
    isRunning = false;
    playSynth('gameover');
    triggerScreenShake();

    if (score > savedHighScore) {
      savedHighScore = score;
      localStorage.setItem('astro_midlaj_highscore', savedHighScore);
    }
    updateHUD();
    bossBarContainer.classList.add('hidden');

    overlayTitle.textContent = "MISSION OVER";
    overlayTitle.style.color = "#ef4444";
    overlayDesc.innerHTML = `Outstanding performance! Final Score: <strong style="color: #00f2fe">${score}</strong> • Wave Reached: <strong>${wave}</strong>`;
    startBtn.textContent = "↺ REPLAY MISSION";
    overlay.classList.remove('hidden');
  }

  startBtn.addEventListener('click', () => {
    getAudioContext();
    resetGame();
    overlay.classList.add('hidden');
    isRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  });

  function gameLoop(timestamp) {
    if (!isRunning) return;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    // Starfield
    stars.forEach(s => {
      s.y += s.speed * dt;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    });

    // Combo timer decay
    if (comboTimer > 0) {
      comboTimer -= dt;
      if (comboTimer <= 0) {
        combo = 1;
        updateHUD();
      }
    }

    // Powerup timer decay
    if (tripleShotTimer > 0) {
      tripleShotTimer -= dt;
    }

    // Player input & velocity
    let moveDir = 0;
    if (keys.left) moveDir -= 1;
    if (keys.right) moveDir += 1;

    player.vx = moveDir * player.speed;
    player.x += player.vx * dt;

    if (player.x < 10) player.x = 10;
    if (player.x > canvas.width - player.width - 10) {
      player.x = canvas.width - player.width - 10;
    }

    if (player.invincibleTimer > 0) {
      player.invincibleTimer -= dt;
    }

    // Firing logic
    shootCooldown -= dt;
    if (keys.space && shootCooldown <= 0) {
      if (tripleShotTimer > 0) {
        // Triple spread shot!
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, vx: 0, vy: -580 });
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, vx: -120, vy: -560 });
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, vx: 120, vy: -560 });
      } else {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, vx: 0, vy: -580 });
      }
      playSynth('laser');
      shootCooldown = 0.17;
    }

    // Update player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += (b.vx || 0) * dt;
      b.y += (b.vy || -580) * dt;
      if (b.y < -20 || b.x < -20 || b.x > canvas.width + 20) {
        bullets.splice(i, 1);
      }
    }

    // Update enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];
      eb.y += eb.vy * dt;
      eb.x += eb.vx * dt;

      // Check hit player
      if (player.invincibleTimer <= 0) {
        const dist = Math.hypot(eb.x - (player.x + player.width / 2), eb.y - (player.y + player.height / 2));
        if (dist < 18) {
          enemyBullets.splice(i, 1);
          lives -= 1;
          player.invincibleTimer = 1.6;
          playSynth('hit');
          triggerScreenShake();
          createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 24);
          updateHUD();
          if (lives <= 0) {
            gameOver();
            return;
          }
          continue;
        }
      }

      if (eb.y > canvas.height + 20) {
        enemyBullets.splice(i, 1);
      }
    }

    // Spawn Boss on wave 3, 6, etc
    if (wave % 3 === 0 && !activeBoss) {
      spawnBoss();
    }

    // Update Boss if active
    if (activeBoss) {
      if (activeBoss.y < activeBoss.targetY) {
        activeBoss.y += 60 * dt;
      } else {
        activeBoss.x += activeBoss.vx * dt;
        if (activeBoss.x < activeBoss.width / 2 + 10 || activeBoss.x > canvas.width - activeBoss.width / 2 - 10) {
          activeBoss.vx *= -1;
        }

        activeBoss.shootTimer += dt;
        if (activeBoss.shootTimer > 0.9) {
          // Boss fires plasma pulses
          enemyBullets.push({ x: activeBoss.x - 30, y: activeBoss.y + 20, vx: -40, vy: 220 });
          enemyBullets.push({ x: activeBoss.x + 30, y: activeBoss.y + 20, vx: 40, vy: 220 });
          activeBoss.shootTimer = 0;
        }
      }

      // Check bullets vs Boss
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (
          b.x > activeBoss.x - activeBoss.width / 2 &&
          b.x < activeBoss.x + activeBoss.width / 2 &&
          b.y > activeBoss.y - activeBoss.height / 2 &&
          b.y < activeBoss.y + activeBoss.height / 2
        ) {
          bullets.splice(j, 1);
          activeBoss.hp -= 1;
          createExplosion(b.x, b.y, '#f59e0b', 5);
          updateBossHUD();

          if (activeBoss.hp <= 0) {
            triggerScreenShake();
            createExplosion(activeBoss.x, activeBoss.y, '#ef4444', 45);
            playSynth('explosion');
            score += 250 * combo;
            spawnPowerup(activeBoss.x, activeBoss.y);
            activeBoss = null;
            wave++;
            updateBossHUD();
            updateHUD();
            break;
          }
        }
      }
    }

    // Normal Enemy Spawning
    spawnTimer += dt;
    const spawnRate = Math.max(0.65, 1.4 - wave * 0.08);
    if (spawnTimer >= spawnRate) {
      spawnEnemy();
      spawnTimer = 0;
    }

    // Update Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += e.speedY * dt;
      e.x += e.speedX * dt;
      e.rotation += e.rotSpeed * dt;

      if (e.type === 'drone') {
        if (e.x < e.size || e.x > canvas.width - e.size) {
          e.speedX *= -1;
        }
      }

      // Bullets vs enemies
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dist = Math.hypot(b.x - e.x, b.y - e.y);

        if (dist < e.size) {
          bullets.splice(j, 1);
          e.hp -= 1;
          createExplosion(b.x, b.y, '#00f2fe', 6);

          if (e.hp <= 0) {
            createExplosion(e.x, e.y, e.color, 20);
            playSynth('explosion');

            // Chance to drop powerup
            if (Math.random() < 0.25) {
              spawnPowerup(e.x, e.y);
            }

            enemies.splice(i, 1);

            combo = Math.min(combo + 1, 5);
            comboTimer = 2.5;

            score += (e.type === 'drone' ? 30 : 15) * combo;
            if (score % 150 === 0 && !activeBoss) {
              wave++;
            }
            updateHUD();
            break;
          }
        }
      }

      // Player collision
      if (player.invincibleTimer <= 0) {
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const distToPlayer = Math.hypot(pCenterX - e.x, pCenterY - e.y);

        if (distToPlayer < e.size + player.width / 2.5) {
          lives -= 1;
          player.invincibleTimer = 1.6;
          playSynth('hit');
          triggerScreenShake();
          createExplosion(pCenterX, pCenterY, '#ef4444', 24);
          enemies.splice(i, 1);
          combo = 1;
          updateHUD();

          if (lives <= 0) {
            gameOver();
            return;
          }
        }
      }

      if (e.y > canvas.height + 50) {
        enemies.splice(i, 1);
      }
    }

    // Update Powerups
    for (let i = powerups.length - 1; i >= 0; i--) {
      const p = powerups[i];
      p.y += p.vy * dt;

      // Check pickup
      const pCenterX = player.x + player.width / 2;
      const pCenterY = player.y + player.height / 2;
      const dist = Math.hypot(pCenterX - p.x, pCenterY - p.y);

      if (dist < player.width / 2 + p.size) {
        playSynth('powerup');
        createExplosion(p.x, p.y, '#00ffcc', 14);

        if (p.type === 'triple') {
          tripleShotTimer = 7.0; // 7 seconds of spread fire
        } else if (p.type === 'shield') {
          lives = Math.min(lives + 1, 3);
          updateHUD();
        } else if (p.type === 'bomb') {
          triggerScreenShake();
          enemies.forEach(e => createExplosion(e.x, e.y, e.color, 16));
          enemies = [];
          score += 100 * combo;
          updateHUD();
        }

        powerups.splice(i, 1);
        continue;
      }

      if (p.y > canvas.height + 20) {
        powerups.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player ship
    if (player.invincibleTimer <= 0 || Math.floor(player.invincibleTimer * 10) % 2 === 0) {
      drawPlayerShip(player.x, player.y, player.width, player.height);
    }

    // Bullets
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = tripleShotTimer > 0 ? '#fbbf24' : '#00f2fe';
    bullets.forEach(b => {
      ctx.fillRect(b.x, b.y, 4, 14);
    });
    ctx.shadowBlur = 0;

    // Enemy bullets
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ef4444';
    ctx.fillStyle = '#ef4444';
    enemyBullets.forEach(eb => {
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Boss
    if (activeBoss) {
      ctx.save();
      ctx.translate(activeBoss.x, activeBoss.y);
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#991b1b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;

      // Mothership hull
      ctx.beginPath();
      ctx.moveTo(-activeBoss.width / 2, 0);
      ctx.lineTo(-activeBoss.width / 3, activeBoss.height / 2);
      ctx.lineTo(activeBoss.width / 3, activeBoss.height / 2);
      ctx.lineTo(activeBoss.width / 2, 0);
      ctx.lineTo(activeBoss.width / 4, -activeBoss.height / 2);
      ctx.lineTo(-activeBoss.width / 4, -activeBoss.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Reactor core
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Enemies
    enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rotation);

      if (e.type === 'asteroid') {
        ctx.fillStyle = e.color;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(-e.size * 0.3, -e.size * 0.2, e.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f43f5e';
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.moveTo(0, e.size);
        ctx.lineTo(-e.size, -e.size * 0.7);
        ctx.lineTo(0, -e.size * 0.2);
        ctx.lineTo(e.size, -e.size * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    });

    // Powerups
    powerups.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.type === 'triple' ? '#38bdf8' : p.type === 'shield' ? '#10b981' : '#f59e0b';
      ctx.fillStyle = p.type === 'triple' ? '#0284c7' : p.type === 'shield' ? '#059669' : '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.type === 'triple' ? '⚡' : p.type === 'shield' ? '🛡️' : '💥', 0, 0);
      ctx.restore();
    });

    // Particles
    particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1.0;
    });
  }

  function drawPlayerShip(x, y, w, h) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);

    // Thruster flame
    const flameHeight = 8 + Math.random() * 8;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-6, h / 2 - 2);
    ctx.lineTo(0, h / 2 + flameHeight);
    ctx.lineTo(6, h / 2 - 2);
    ctx.closePath();
    ctx.fill();

    // Ship Hull
    ctx.shadowBlur = 12;
    ctx.shadowColor = tripleShotTimer > 0 ? '#38bdf8' : '#00f2fe';
    ctx.fillStyle = tripleShotTimer > 0 ? '#38bdf8' : '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(0, h / 3);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  draw();
}
