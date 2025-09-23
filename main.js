/* Replaced main.js: cleaned implementations for countdown, discord expansion, copy, scrolling, animations, etc. */

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  initLandingOverlay();
  initThemeToggle();
});

function initializeApp() {
  try {
    // Don't initialize hearts immediately - wait for landing to finish
    initCountdown();
    initDiscordExpansion();
    initCopyFunctionality();
    initScrollAnimations();
    initSmoothScroll();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    initMusicPlayer();
    initGunTooltip(); // Add this line
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

/* =========================
   THEME TOGGLE
========================= */
function initThemeToggle() {
  const themeCheckbox = document.getElementById('themeCheckbox');
  const avatarImage = document.getElementById('avatarImage');
  
  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', toggleTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update checkbox state to match theme
    if (themeCheckbox) {
      themeCheckbox.checked = theme === 'dark';
    }
    
    // Update avatar based on theme
    if (avatarImage) {
      avatarImage.src = theme === 'dark' ? '333.png' : 'bleh.png';
    }
    
    // Update gun icon based on theme
    const gunIcon = document.getElementById('gunIcon');
    if (gunIcon) {
      gunIcon.src = theme === 'dark' ? 'gunsdark.png' : 'gunslight.png';
    }
    
    // Update favicon based on theme
    updateFavicon(theme);
    
    // Update existing heart colors without regenerating them
    updateHeartColors(theme);
    
    // Update landing hearts colors without regenerating them
    updateLandingHeartColors(theme);
    
    announceToScreenReader(`Switched to ${theme} theme`);
  }

  function updateFavicon(theme) {
    const favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    
    if (favicon) {
      // Update existing favicon
      favicon.href = theme === 'dark' ? 'favicon2.png' : 'favicon1.png';
    } else {
      // Create favicon if it doesn't exist
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/png';
      newFavicon.href = theme === 'dark' ? 'favicon2.png' : 'favicon1.png';
      document.head.appendChild(newFavicon);
    }
  }
}

/* =========================
   LANDING OVERLAY
========================= */
function initLandingOverlay() {
  const overlay = document.getElementById('landingOverlay');
  const body = document.body;
  
  if (!overlay) {
    // No landing overlay, just initialize everything normally
    initHeartAnimation();
    return;
  }
  
  generateLandingHearts();
  
  // REMOVE blur-active immediately so content loads normally
  body.classList.remove('blur-active');
  
  function enterPortfolio() {
    const audio = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    overlay.style.pointerEvents = 'none';
    
    if (audio) {
      audio.volume = 0;
      audio.play().catch(err => console.log('Audio error:', err));
    }
    
    overlay.classList.add('hidden');
    
    if (audio) {
      const sliderValue = document.getElementById('volumeSlider')?.value || 50;
      const targetVolume = Math.max(0, Math.min(1, parseFloat(sliderValue) / 100));
      fadeAudioVolume(audio, 0, targetVolume, 500);
      
      if (playPauseBtn) {
        playPauseBtn.classList.add('playing');
      }
    }
    
    // Start hearts after overlay is gone
    setTimeout(() => {
      initHeartAnimation();
    }, 600);
    
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    }, 650);
  }
  
  // Helper function to smoothly fade audio volume
  function fadeAudioVolume(audioElement, startVolume, endVolume, duration) {
    if (!audioElement) return;
    
    // Clamp values between 0 and 1
    startVolume = Math.max(0, Math.min(1, startVolume));
    endVolume = Math.max(0, Math.min(1, endVolume));
    
    const startTime = performance.now();
    audioElement.volume = startVolume;
    
    function updateVolume(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newVolume = startVolume + (progress * (endVolume - startVolume));
      // Clamp the calculated volume between 0 and 1
      audioElement.volume = Math.max(0, Math.min(1, newVolume));
      
      if (progress < 1) {
        requestAnimationFrame(updateVolume);
      }
    }
    
    requestAnimationFrame(updateVolume);
  }
  
  // Click anywhere on overlay to enter
  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    enterPortfolio();
  });
  
  // Enter key to enter
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !overlay.classList.contains('hidden')) {
      e.preventDefault();
      enterPortfolio();
    }
  });
  
  // Prevent any scrolling while overlay is active
  document.addEventListener('wheel', function(e) {
    if (!overlay.classList.contains('hidden')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('touchmove', function(e) {
    if (!overlay.classList.contains('hidden')) {
      e.preventDefault();
    }
  }, { passive: false });
}

function generateLandingHearts() {
  const heartsContainer = document.querySelector('.landing-hearts');
  if (!heartsContainer) return;
  
  // Clear existing hearts first
  heartsContainer.innerHTML = '';
  
  const heartCount = 30;
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  
  // Theme-specific heart colors
  const heartVariants = currentTheme === 'dark' ? [
    { color: '#1e3a8a', size: 15 },
    { color: '#3b82f6', size: 18 },
    { color: '#60a5fa', size: 12 },
    { color: '#93c5fd', size: 20 },
    { color: '#2563eb', size: 14 },
    { color: '#1e40af', size: 16 },
    { color: '#1d4ed8', size: 22 },
    { color: '#dbeafe', size: 13 }
  ] : [
    { color: '#ff9bbf', size: 15 },
    { color: '#ff7fb0', size: 18 },
    { color: '#ffa4c9', size: 12 },
    { color: '#ff6ba3', size: 20 },
    { color: '#ffb3d1', size: 14 },
    { color: '#ff8bc1', size: 16 },
    { color: '#ff5b9e', size: 22 },
    { color: '#ffcde0', size: 13 }
  ];
  
  // Generate falling hearts
  for (let i = 0; i < heartCount; i++) {
    const variant = heartVariants[Math.floor(Math.random() * heartVariants.length)];
    const heart = document.createElement('div');
    heart.className = 'landing-heart';
    
    // Random properties
    const x = Math.random() * 100; // 0-100%
    const duration = (Math.random() * 3 + 4); // 4-7 seconds
    const delay = Math.random() * 10; // 0-10 seconds
    const drift = (Math.random() - 0.5) * 120; // -60px to 60px drift
    const rotation = (Math.random() - 0.5) * 360; // random rotation
    
    // Heart SVG with dynamic color
    const heartSvg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(variant.color)}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
    
    // Set styles
    heart.style.width = `${variant.size}px`;
    heart.style.height = `${variant.size}px`;
    heart.style.backgroundImage = heartSvg;
    heart.style.setProperty('--x', `${x}%`);
    heart.style.setProperty('--duration', `${duration}s`);
    heart.style.setProperty('--delay', `${delay}s`);
    heart.style.setProperty('--drift', `${drift}px`);
    heart.style.setProperty('--rotation', `${rotation}deg`);
    
    heartsContainer.appendChild(heart);
  }
  
  console.log(`Generated ${heartCount} ${currentTheme} theme falling hearts`);
}

/* =========================
   FLOATING HEARTS ANIMATION
========================= */
function initHeartAnimation() {
  const heartsContainer = document.querySelector('.hearts');
  if (!heartsContainer) {
    console.warn('Hearts container not found');
    return;
  }

  // Get the current theme (which should be set by now from localStorage)
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  const config = {
    colors: ['a', 'b', 'c'],
    sizes: [18, 24, 32, 28],
    count: 20,
    speeds: { min: 12, max: 25 }
  };

  heartsContainer.innerHTML = '';
  
  for (let i = 0; i < config.count; i++) {
    createFloatingHeart(heartsContainer, config, currentTheme);
  }
}

function createFloatingHeart(container, config, theme) {
  const heart = document.createElement('div');
  heart.className = 'heart';

  const color = config.colors[Math.floor(Math.random() * config.colors.length)];
  const size = config.sizes[Math.floor(Math.random() * config.sizes.length)];
  const speed = (Math.random() * (config.speeds.max - config.speeds.min) + config.speeds.min).toFixed(2);
  const delay = (Math.random() * 15).toFixed(2);
  const horizontalPos = (Math.random() * 110 - 5).toFixed(3);
  const driftDirection = Math.random() > 0.5 ? 1 : -1;
  const driftAmount = (Math.random() * 20 + 5) * driftDirection;

  heart.dataset.color = color;
  heart.style.left = `${horizontalPos}%`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.animationDuration = `${speed}s`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.setProperty('--drift-x', `${driftAmount}px`);

  // Set the correct heart color based on theme
  const colorMap = theme === 'dark' ? {
    'a': '%231e3a8a',
    'b': '%233b82f6', 
    'c': '%2360a5fa'
  } : {
    'a': '%23ff9bbf',
    'b': '%23ff7fb0',
    'c': '%23ffa4c9'
  };

  if (colorMap[color]) {
    const heartSvg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorMap[color]}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
    heart.style.backgroundImage = heartSvg;
  }

  container.appendChild(heart);
}

/* =========================
   COUNTDOWN
========================= */
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function updateCountdown() {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      let birthday = new Date(currentYear, 9, 7, 0, 0, 0, 0);

      if (now > birthday) {
        birthday = new Date(currentYear + 1, 9, 7, 0, 0, 0, 0);
      }

      const timeDiff = birthday - now;
      if (timeDiff <= 0) {
        countdownEl.textContent = '🎉 LEGAL! 🎉';
        countdownEl.setAttribute('aria-label', 'Birthday is today');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      const formattedTime = [
        String(days).padStart(2, '0'),
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':');

      countdownEl.textContent = formattedTime;
      countdownEl.setAttribute('aria-label', `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds until next birthday`);
    } catch (err) {
      console.error('Countdown error:', err);
      countdownEl.textContent = 'Soon! :3';
    }
  }

  updateCountdown();
  const id = setInterval(updateCountdown, 1000);
  window.addEventListener('beforeunload', () => clearInterval(id));
}

/* =========================
   DISCORD EXPANSION
========================= */
function initDiscordExpansion() {
  const discordCard = document.getElementById('discordCard');
  const discordSubcards = document.getElementById('discordSubcards');

  if (!discordCard || !discordSubcards) {
    console.warn('Discord elements not found');
    return;
  }

  function setExpanded(expand) {
    discordCard.setAttribute('aria-expanded', String(expand));
    discordSubcards.setAttribute('aria-hidden', String(!expand));
    const subtitle = discordCard.querySelector('.link-subtitle');
    if (subtitle) subtitle.textContent = expand ? 'click to collapse' : 'click to expand';

    if (expand) {
      discordSubcards.classList.add('show');
    } else {
      discordSubcards.classList.remove('show');
    }

    announceToScreenReader(expand ? 'Discord options expanded' : 'Discord options collapsed');
  }

  function toggleDiscordExpansion() {
    const isExpanded = discordCard.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded);
  }

  discordCard.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDiscordExpansion();
  });

  discordCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggleDiscordExpansion();
      return;
    }
    if (e.key === 'Escape') {
      setExpanded(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (!discordCard.contains(e.target) && !discordSubcards.contains(e.target)) {
      setExpanded(false);
    }
  });
}

/* =========================
   COPY TO CLIPBOARD
========================= */
function initCopyFunctionality() {
  const copyTargets = {
    'discordCopyUser': { text: 'dwnless', label: 'Discord username' },
    'discordCopyUid': { text: '1376650471900450827', label: 'Discord UID' }
  };

  Object.entries(copyTargets).forEach(([elementId, cfg]) => {
    const button = document.getElementById(elementId);
    if (!button) return;

    async function handleCopy(e) {
      e.preventDefault();
      await copyToClipboard(cfg.text, cfg.label, button);
    }

    button.addEventListener('click', handleCopy);
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleCopy(e);
      }
    });
  });
}

async function copyToClipboard(text, label, buttonEl) {
  const subtitleEl = buttonEl.querySelector('.copy-subtitle');
  const originalText = subtitleEl?.textContent || '';

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      await fallbackCopyTextToClipboard(text);
    }

    showCopyFeedback(subtitleEl, originalText, 'copied!');
    showToast(`${label} copied to clipboard!`);
    announceToScreenReader(`${label} copied to clipboard`);
  } catch (error) {
    console.error('Copy failed:', error);
    showCopyFeedback(subtitleEl, originalText, 'copy failed');
    showToast('Copy failed. Please try again.', 'error');
    announceToScreenReader(`Failed to copy ${label}`);
  }
}

function fallbackCopyTextToClipboard(text) {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) resolve();
      else reject(new Error('execCommand returned false'));
    } catch (err) {
      document.body.removeChild(textarea);
      reject(err);
    }
  });
}

function showCopyFeedback(element, originalText, feedbackText) {
  if (!element) return;
  element.textContent = feedbackText;
  setTimeout(() => {
    element.textContent = originalText;
  }, 2000);
}

/* =========================
   TOASTS
========================= */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* =========================
   SCROLL / ANIMATIONS
========================= */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section-animate');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => observer.observe(el));
}

/* =========================
   SMOOTH SCROLL
========================= */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.btn[href^="#"], .footer-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* =========================
   KEYBOARD NAVIGATION
========================= */
function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const discordCard = document.getElementById('discordCard');
      if (discordCard) discordCard.setAttribute('aria-expanded', 'false');
      const discordSubcards = document.getElementById('discordSubcards');
      if (discordSubcards) {
        discordSubcards.setAttribute('aria-hidden', 'true');
        discordSubcards.classList.remove('show');
      }
    }
  });
}

/* =========================
   MUSIC PLAYER
========================= */
function initMusicPlayer() {
  const audio = document.getElementById('backgroundMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumePercent = document.getElementById('volumePercent');
  
  if (!audio || !playPauseBtn || !volumeSlider || !volumePercent) return;

  audio.volume = 0.5;
  playPauseBtn.classList.remove('playing');
  
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        playPauseBtn.classList.add('playing');
      }).catch(error => {
        console.warn('Audio play failed:', error);
        showToast('Music play failed - try clicking play again');
      });
    } else {
      audio.pause();
      playPauseBtn.classList.remove('playing');
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    volumePercent.textContent = `${e.target.value}%`;
    
    const volumeIcon = document.querySelector('.volume-control iconify-icon');
    if (volumeIcon) {
      const iconMap = {
        0: 'mdi:volume-mute',
        0.5: 'mdi:volume-low',
        1: 'mdi:volume-high'
      };
      volumeIcon.setAttribute('icon', volume === 0 ? iconMap[0] : volume < 0.5 ? iconMap[0.5] : iconMap[1]);
    }
  });

  ['error', 'play', 'pause'].forEach(event => {
    audio.addEventListener(event, () => {
      if (event === 'error') {
        console.warn('Audio error');
        showToast('Music file could not be loaded');
        playPauseBtn.classList.remove('playing');
      } else {
        playPauseBtn.classList.toggle('playing', event === 'play');
      }
    });
  });
}

/* =========================
   PERFORMANCE OPTIMIZATIONS
========================= */
function initPerformanceOptimizations() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      console.warn(`Failed to load image: ${this.src}`);
      Object.assign(this.style, {
        background: 'linear-gradient(135deg, var(--sky-secondary), var(--sky-tertiary))',
        display: 'grid',
        placeItems: 'center'
      });
      this.innerHTML = '📷';
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition', '0.01ms');
  }
}

/* =========================
   GUN TOOLTIP
========================= */
function initGunTooltip() {
  const gunLink = document.querySelector('.gun-link');
  if (!gunLink) return;

  let tooltip = null;
  let isAnimating = false;
  let animationFrame = null;
  let currentScale = 0; // Track current scale

  gunLink.addEventListener('mouseenter', () => {
    // Cancel any ongoing animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    // Remove existing tooltip if any and get its current scale
    let startScale = 0;
    if (tooltip) {
      const transform = tooltip.style.transform;
      const match = transform.match(/scale\((-?\d+(?:\.\d+)?)\)/);
      if (match) {
        startScale = parseFloat(match[1]);
      }
      tooltip.remove();
    }

    // Get gun link position
    const rect = gunLink.getBoundingClientRect();
    
    // Create tooltip
    tooltip = document.createElement('div');
    tooltip.textContent = 'guns.lol/dwnless';
    
    // Style tooltip
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    Object.assign(tooltip.style, {
      position: 'fixed',
      left: (rect.right + 8) + 'px', // Position to the right of the gun
      top: (rect.top + rect.height / 2) + 'px', // Vertically center with gun
      transform: `translateY(-50%) scale(${startScale})`, // Start from current scale, center vertically
      transformOrigin: 'left center', // Pop from left edge (closest to gun)
      background: currentTheme === 'dark' 
        ? 'linear-gradient(135deg, var(--glass-strong), var(--sky-tertiary))' 
        : 'linear-gradient(135deg, var(--glass-strong), var(--sky-tertiary))',
      color: currentTheme === 'dark' ? 'var(--brand-primary)' : 'var(--brand-primary)',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700',
      fontFamily: 'Poppins, sans-serif',
      border: currentTheme === 'dark' 
        ? '1px solid var(--border)' 
        : '1px solid var(--border)',
      boxShadow: currentTheme === 'dark'
        ? 'var(--shadow)'
        : 'var(--shadow)',
      zIndex: '9999',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      opacity: '0',
      transition: 'none' // Remove CSS transitions to use JS animation
    });
    
    document.body.appendChild(tooltip);
    
    // Animate pop in
    isAnimating = true;
    const targetScale = 1; // Pop to full size
    const startTime = performance.now();
    const duration = 250; // Slightly faster for snappy pop effect
    
    function animateIn(currentTime) {
      if (!tooltip || !isAnimating) return;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Bouncy easing for pop effect
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      currentScale = startScale + (targetScale - startScale) * easeProgress;
      const opacity = Math.min(progress * 3, 1); // Fade in quickly
      
      tooltip.style.transform = `translateY(-50%) scale(${currentScale})`;
      tooltip.style.opacity = opacity;
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateIn);
      } else {
        isAnimating = false;
        animationFrame = null;
      }
    }
    
    animationFrame = requestAnimationFrame(animateIn);
  });

  gunLink.addEventListener('mouseleave', () => {
    if (!tooltip) return;
    
    // Cancel any ongoing animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    
    // Get current scale for smooth animation
    const transform = tooltip.style.transform;
    const match = transform.match(/scale\((-?\d+(?:\.\d+)?)\)/);
    const startScale = match ? parseFloat(match[1]) : 1;
    
    isAnimating = true;
    const targetScale = 0; // Shrink to nothing
    const startTime = performance.now();
    const duration = 200; // Quick pop out
    
    function animateOut(currentTime) {
      if (!tooltip) return;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quick ease-in for snappy disappearance
      const easeProgress = Math.pow(progress, 2);
      
      currentScale = startScale + (targetScale - startScale) * easeProgress;
      const opacity = Math.max(1 - progress * 2, 0); // Fade out quickly
      
      tooltip.style.transform = `translateY(-50%) scale(${currentScale})`;
      tooltip.style.opacity = opacity;
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateOut);
      } else {
        // Animation complete, remove tooltip
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
        isAnimating = false;
        animationFrame = null;
        currentScale = 0; // Reset for next time
      }
    }
    
    animationFrame = requestAnimationFrame(animateOut);
  });
}

/* =========================
   UTILS
========================= */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.className = 'sr-only';
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement?.remove(), 1200);
}

function updateHeartColors(theme) {
  const hearts = document.querySelectorAll('.heart');
  if (!hearts.length) return;

  const colorMap = theme === 'dark' ? {
    'a': '%231e3a8a',
    'b': '%233b82f6', 
    'c': '%2360a5fa'
  } : {
    'a': '%23ff9bbf',
    'b': '%23ff7fb0',
    'c': '%23ffa4c9'
  };

  hearts.forEach(heart => {
    const color = heart.dataset.color;
    if (color && colorMap[color]) {
      const heartSvg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorMap[color]}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
      heart.style.backgroundImage = heartSvg;
    }
  });
}

function updateLandingHeartColors(theme) {
  const landingHearts = document.querySelectorAll('.landing-heart');
  if (!landingHearts.length) return;

  const themeColors = theme === 'dark' ? [
    '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', 
    '#2563eb', '#1e40af', '#1d4ed8', '#dbeafe'
  ] : [
    '#ff9bbf', '#ff7fb0', '#ffa4c9', '#ff6ba3', 
    '#ffb3d1', '#ff8bc1', '#ff5b9e', '#ffcde0'
  ];

  landingHearts.forEach(heart => {
    // Get a random color from the new theme
    const randomColor = themeColors[Math.floor(Math.random() * themeColors.length)];
    const heartSvg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(randomColor)}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
    heart.style.backgroundImage = heartSvg;
  });
}