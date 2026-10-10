/**
 * Muhammed Midlaj K - Unity Game Developer Portfolio
 * Based strictly on Verified PDF Resume
 * Theme: Cinematic Dark + Subtle Orange Accent
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  initNavigation();
  initSoundToggle();
  initCvModal();
  initCopyButtons();
  initContactSystem();
  initInteractiveCards();
});

/* ==========================================================================
   1. GLOBAL AUDIO SYNTHESIZER & SOUND FX (Web Audio API)
   ========================================================================== */
let globalAudioCtx = null;
let uiSoundEnabled = true;

function getAudioContext() {
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
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
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.linearRampToValueAtTime(540, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === 'modal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    // Graceful handling of browser autoplay restrictions
  }
}

function initSoundToggle() {
  const toggleBtn = document.getElementById('uiSoundToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    uiSoundEnabled = !uiSoundEnabled;
    toggleBtn.textContent = uiSoundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
    toggleBtn.classList.toggle('muted', !uiSoundEnabled);
    if (uiSoundEnabled) {
      playUiSound('success');
      showToast('Sound effects enabled');
    } else {
      showToast('Sound effects muted');
    }
  });

  // Attach hover sounds to major buttons & interactive cards
  const interactiveElements = document.querySelectorAll(
    '.btn, .nav-link, .info-card, .info-card-interactive, .copy-btn, .project-card, .skill-category-card'
  );
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => playUiSound('hover'), { passive: true });
    el.addEventListener('click', () => playUiSound('click'), { passive: true });
  });
}

/* ==========================================================================
   2. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `
    <span class="toast-check">✓</span>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  playUiSound('success');

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 2600);
}

/* ==========================================================================
   3. AMBIENT EMBER & FLOATING PARTICLES CANVAS
   ========================================================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById('bgParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 55);

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.45 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.55 + 0.15;
      this.fadeSpeed = Math.random() * 0.004 + 0.002;
      this.hue = Math.random() > 0.3 ? 24 : 36; // Warm amber & golden orange
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 55%, ${this.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.7)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });
}

/* ==========================================================================
   4. NAVIGATION & ACTIVE SECTION SPY
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const allNavAnchors = document.querySelectorAll('.nav-links .nav-link');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileBtn.classList.toggle('active');
      navLinks.classList.toggle('open');
      playUiSound('click');
    });

    // Close menu when clicking a link
    allNavAnchors.forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavAnchors.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   5. AUTHENTIC CV MODAL (PREVIEW & PRINT)
   ========================================================================== */
function initCvModal() {
  const openCvBtn = document.getElementById('openCvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');

  if (!cvModal) return;

  function openModal() {
    cvModal.classList.add('active');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playUiSound('modal');
  }

  function closeModal() {
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playUiSound('click');
  }

  if (openCvBtn) {
    openCvBtn.addEventListener('click', openModal);
  }

  if (closeCvModalBtn) {
    closeCvModalBtn.addEventListener('click', closeModal);
  }

  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. COPY TO CLIPBOARD BUTTONS
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        showToast(`Error copying: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM & WHATSAPP DISPATCH
   ========================================================================== */
function initContactSystem() {
  const contactForm = document.getElementById('contactForm');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const formFeedback = document.getElementById('formFeedback');

  function getFormValues() {
    const name = document.getElementById('userName')?.value.trim() || '';
    const email = document.getElementById('userEmail')?.value.trim() || '';
    const subject = document.getElementById('userSubject')?.value.trim() || '';
    const message = document.getElementById('userMessage')?.value.trim() || '';
    return { name, email, subject, message };
  }

  // Send via WhatsApp
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const { name, email, subject, message } = getFormValues();

      if (!name || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please enter your Name and Message before sending via WhatsApp.';
          formFeedback.classList.remove('hidden');
        }
        showToast('Please enter your Name and Message');
        return;
      }

      const formattedText = `Hello Muhammed Midlaj,\n\nI am contacting you from your portfolio website.\n\n*Name:* ${name}\n*Email:* ${email || 'Not provided'}\n*Subject:* ${subject || 'Game Developer Inquiry'}\n\n*Message:*\n${message}`;
      const waUrl = `https://wa.me/919744525332?text=${encodeURIComponent(formattedText)}`;

      playUiSound('success');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp chat...');

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Opening WhatsApp with your pre-filled message...';
        formFeedback.classList.remove('hidden');
      }
    });
  }

  // Submit via Email
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email, subject, message } = getFormValues();

      if (!name || !email || !subject || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please complete all required fields.';
          formFeedback.classList.remove('hidden');
        }
        return;
      }

      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - ${name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from Muhammed Midlaj K Portfolio`
      );
      const mailtoUrl = `mailto:muhammadmidlaj20109@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      playUiSound('success');
      window.location.href = mailtoUrl;

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Opening your email client to dispatch the message. Thank you!';
        formFeedback.classList.remove('hidden');
      }
      showToast('Draft created in your email client');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   8. INTERACTIVE CARDS & HOVER TILT
   ========================================================================== */
function initInteractiveCards() {
  const cards = document.querySelectorAll('.project-card, .skill-category-card, .dev-profile-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      card.style.transform = `perspective(1000px) rotateY(${deltaX * 2}deg) rotateX(${-deltaY * 2}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
