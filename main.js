// ...existing code...
/* Replaced main.js: cleaned implementations for countdown, discord expansion, copy, scrolling, animations, etc. */

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  try {
    initHeartAnimation();
    initCountdown();
    initDiscordExpansion();
    initCopyFunctionality();
    initScrollAnimations();
    initSmoothScroll();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    initAnalytics();
    initThemeSupport();
    initProjectFilters(); // Add project filtering functionality
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

/* =========================
   FLOATING HEARTS ANIMATION
   (keeps original logic)
========================= */
function initHeartAnimation() {
  const heartsContainer = document.querySelector('.hearts');
  if (!heartsContainer) return;

  const config = {
    colors: ['a', 'b', 'c'],
    sizes: [18, 24, 32, 28],
    count: 15,
    speeds: { min: 12, max: 25 }
  };

  heartsContainer.innerHTML = '';
  for (let i = 0; i < config.count; i++) {
    createFloatingHeart(heartsContainer, config);
  }
}

function createFloatingHeart(container, config) {
  const heart = document.createElement('div');
  heart.className = 'heart';

  const color = config.colors[Math.floor(Math.random() * config.colors.length)];
  const size = config.sizes[Math.floor(Math.random() * config.sizes.length)];
  const speed = (Math.random() * (config.speeds.max - config.speeds.min) + config.speeds.min).toFixed(2);
  const delay = (Math.random() * 15).toFixed(2);
  const horizontalPos = (Math.random() * 100).toFixed(3);

  heart.dataset.color = color;
  heart.style.left = `${horizontalPos}%`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.animationDuration = `${speed}s`;
  heart.style.animationDelay = `${delay}s`;

  container.appendChild(heart);
}

/* =========================
   BIRTHDAY COUNTDOWN
========================= */
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function updateCountdown() {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      // Target date: October 7 (month index 9)
      let birthday = new Date(currentYear, 9, 7, 0, 0, 0, 0);

      // If birthday this year already passed, use next year
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 9, 7, 0, 0, 0, 0);
      }

      const timeDiff = birthday - now;
      if (timeDiff <= 0) {
        countdownEl.textContent = '00:00:00:00';
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

  window.addEventListener('beforeunload', () => {
    clearInterval(id);
  });
}

/* =========================
   DISCORD EXPANSION (single robust impl)
========================= */
function initDiscordExpansion() {
  const discordCard = document.getElementById('discordCard');
  const discordSubcards = document.getElementById('discordSubcards');

  if (!discordCard || !discordSubcards) {
    console.warn('Discord elements not found');
    return;
  }

  // Ensure initial collapsed styling for transition (CSS must allow transition on max-height)
  discordSubcards.classList.remove('show');
  discordSubcards.style.overflow = 'hidden';
  discordSubcards.style.maxHeight = '0';
  discordSubcards.style.transition = 'max-height 260ms ease, opacity 200ms ease';
  discordSubcards.style.opacity = '0';

  function setExpanded(expand) {
    discordCard.setAttribute('aria-expanded', String(expand));
    discordSubcards.setAttribute('aria-hidden', String(!expand));
    const subtitle = discordCard.querySelector('.link-subtitle');
    if (subtitle) subtitle.textContent = expand ? 'click to collapse' : 'click to expand';

    if (expand) {
      // measure natural height
      discordSubcards.style.display = 'block';
      const natural = discordSubcards.scrollHeight;
      // force reflow then expand
      requestAnimationFrame(() => {
        discordSubcards.style.maxHeight = natural + 'px';
        discordSubcards.style.opacity = '1';
        discordSubcards.classList.add('show');
      });
    } else {
      // collapse
      discordSubcards.style.maxHeight = '0';
      discordSubcards.style.opacity = '0';
      discordSubcards.classList.remove('show');
      // remove display after transition
      setTimeout(() => {
        if (discordSubcards.getAttribute('aria-hidden') === 'true') {
          discordSubcards.style.display = '';
        }
      }, 300);
    }

    announceToScreenReader(expand ? 'Discord options expanded' : 'Discord options collapsed');
  }

  function toggleDiscordExpansion() {
    const isExpanded = discordCard.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded);
  }

  // Click
  discordCard.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDiscordExpansion();
  });

  // Keyboard: Enter / Space to toggle, Escape to close
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

  // Close clicking outside
  document.addEventListener('click', (e) => {
    if (!discordCard.contains(e.target) && !discordSubcards.contains(e.target)) {
      setExpanded(false);
    }
  });

  // Ensure height recalculation on resize if expanded
  window.addEventListener('resize', debounce(() => {
    if (discordCard.getAttribute('aria-expanded') === 'true') {
      discordSubcards.style.maxHeight = discordSubcards.scrollHeight + 'px';
    }
  }, 200));
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
  const subtitleEl = buttonEl.querySelector('.link-subtitle');
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
      } else {
        // optional: remove to allow re-triggering
        // entry.target.classList.remove('animate-in');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => observer.observe(el));
}

/* =========================
   SMOOTH SCROLL
========================= */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('nav a[href^="#"], .btn[href^="#"], .footer-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        // cleanup tabindex after a bit
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      }
    });
  });
}

/* =========================
   KEYBOARD NAVIGATION
========================= */
function initKeyboardNavigation() {
  const interestCards = document.querySelectorAll('.interest-card');
  interestCards.forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.click();
      }
      // support arrow navigation if desired (left/right)
    });
  });

  // Global shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const discordCard = document.getElementById('discordCard');
      if (discordCard) discordCard.setAttribute('aria-expanded', 'false');
      const discordSubcards = document.getElementById('discordSubcards');
      if (discordSubcards) {
        discordSubcards.setAttribute('aria-hidden', 'true');
        discordSubcards.style.maxHeight = '0';
        discordSubcards.style.opacity = '0';
      }
    }

    // Alt + 1..4 quick nav (example)
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === '1') document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === '2') document.querySelector('#interests')?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === '3') document.querySelector('#links')?.scrollIntoView({ behavior: 'smooth' });
    }
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
  setTimeout(() => {
    if (announcement && announcement.parentNode) document.body.removeChild(announcement);
  }, 1200);
}

function debounce(func, wait = 200) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* =========================
   PERFORMANCE
========================= */
function initPerformanceOptimizations() {
  // Lazy load images with loading="lazy"
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window && images.length) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        // if data-src exists, swap
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      });
    }, { rootMargin: '200px' });

    images.forEach(img => imgObserver.observe(img));
  }

  // Reduced motion adjustments
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-base', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  }
}

/* =========================
   ANALYTICS (minimal)
========================= */
function initAnalytics() {
  const counters = { pageViews: 0, linkClicks: 0, discordExpansions: 0, copies: 0 };

  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) counters.pageViews++;
  });

  document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button, [role="button"]');
    if (!target) return;
    if (target.classList.contains('discord-main')) counters.discordExpansions++;
    if (target.id && target.id.startsWith('discordCopy')) counters.copies++;
    if (target.tagName === 'A' && target.href && target.href.startsWith('http')) counters.linkClicks++;
    // (store/send counters as needed, privacy-first)
  });
}

/* =========================
   THEME SUPPORT
========================= */
function initThemeSupport() {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function handleThemeChange(e) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
  handleThemeChange(darkModeQuery);
  if (darkModeQuery.addEventListener) darkModeQuery.addEventListener('change', handleThemeChange);
}
// ...existing code...

// =========================
// ANALYTICS & INSIGHTS (Privacy-Friendly)
// =========================
function initAnalytics() {
  // Privacy-friendly interaction tracking (no personal data)
  const interactions = {
    pageViews: 0,
    linkClicks: 0,
    discordExpansions: 0,
    copies: 0
  };
  
  // Track page visibility
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      interactions.pageViews++;
    }
  });
  
  // Track interaction patterns (anonymous)
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button, [role="button"]');
    if (!target) return;
    
    if (target.href && target.href.includes('http')) {
      interactions.linkClicks++;
    } else if (target.id === 'discordCard') {
      interactions.discordExpansions++;
    } else if (target.id?.includes('Copy')) {
      interactions.copies++;
    }
  });
}

// Initialize theme and analytics
document.addEventListener('DOMContentLoaded', function() {
  initThemeSupport();
  initAnalytics();
  initPerformanceOptimizations();
});
// Enhanced Discord expansion with smooth collapse animation
function initDiscordExpansion() {
  const discordCard = document.getElementById('discordCard');
  const discordSubcards = document.getElementById('discordSubcards');
  
  if (!discordCard || !discordSubcards) {
    console.warn('Discord elements not found');
    return;
  }

  // Store the natural height for smooth animations
  let naturalHeight = 0;
  
  // Calculate natural height after DOM is ready
  setTimeout(() => {
    discordSubcards.style.display = 'flex';
    discordSubcards.style.flexDirection = 'column';
    discordSubcards.style.visibility = 'hidden';
    discordSubcards.style.maxHeight = 'none';
    discordSubcards.style.opacity = '1';
    
    naturalHeight = discordSubcards.scrollHeight;
    
    // Reset to collapsed state
    discordSubcards.style.display = '';
    discordSubcards.style.visibility = '';
    discordSubcards.style.maxHeight = '';
    discordSubcards.style.opacity = '';
    discordSubcards.classList.remove('show');
  }, 100);

  function toggleDiscordExpansion(expand = null) {
    const isCurrentlyExpanded = discordCard.getAttribute('aria-expanded') === 'true';
    const shouldExpand = expand !== null ? expand : !isCurrentlyExpanded;
    
    discordCard.setAttribute('aria-expanded', String(shouldExpand));
    discordSubcards.setAttribute('aria-hidden', String(!shouldExpand));
    
    if (shouldExpand) {
      // Expanding
      discordSubcards.style.display = 'flex';
      discordSubcards.style.flexDirection = 'column';
      
      // Force reflow
      discordSubcards.offsetHeight;
      
      // Update CSS custom property for the actual height
      discordSubcards.style.maxHeight = `${naturalHeight || 200}px`;
      discordSubcards.classList.add('show');
      
    } else {
      // Collapsing
      discordSubcards.style.maxHeight = `${discordSubcards.scrollHeight}px`;
      
      // Force reflow
      discordSubcards.offsetHeight;
      
      // Start collapse animation
      discordSubcards.style.maxHeight = '0';
      discordSubcards.classList.remove('show');
      
      // Clean up after animation
      setTimeout(() => {
        if (discordCard.getAttribute('aria-expanded') === 'false') {
          discordSubcards.style.display = '';
        }
      }, 400); // Match your CSS transition duration
    }
    
    // Update subtitle text
    const subtitle = discordCard.querySelector('.link-subtitle');
    if (subtitle) {
      subtitle.textContent = shouldExpand ? 'click to collapse' : 'click to expand';
    }
    
    // Announce change to screen readers
    announceToScreenReader(shouldExpand ? 'Discord options expanded' : 'Discord options collapsed');
  }

  // Click handler
  discordCard.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDiscordExpansion();
  });

  // Keyboard support
  discordCard.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDiscordExpansion();
        break;
      case 'Escape':
        e.preventDefault();
        toggleDiscordExpansion(false);
        break;
    }
  });
  
  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!discordCard.contains(e.target) && !discordSubcards.contains(e.target)) {
      toggleDiscordExpansion(false);
    }
  });
  
  // Recalculate height on window resize
  window.addEventListener('resize', debounce(() => {
    if (discordCard.getAttribute('aria-expanded') === 'true') {
      discordSubcards.style.maxHeight = 'none';
      naturalHeight = discordSubcards.scrollHeight;
      discordSubcards.style.maxHeight = `${naturalHeight}px`;
    }
  }, 250));
}

// Alternative implementation using CSS Grid (more reliable)
function initDiscordExpansionGrid() {
  const discordCard = document.getElementById('discordCard');
  const discordSubcards = document.getElementById('discordSubcards');
  
  if (!discordCard || !discordSubcards) {
    console.warn('Discord elements not found');
    return;
  }

  // Add the grid-based classes
  discordSubcards.classList.add('discord-subcards-grid');
  
  // Wrap the content for the grid method
  const existingContent = discordSubcards.innerHTML;
  discordSubcards.innerHTML = `<div class="discord-subcards-inner">${existingContent}</div>`;
  
  function toggleDiscordExpansion(expand = null) {
    const isCurrentlyExpanded = discordCard.getAttribute('aria-expanded') === 'true';
    const shouldExpand = expand !== null ? expand : !isCurrentlyExpanded;
    
    discordCard.setAttribute('aria-expanded', String(shouldExpand));
    discordSubcards.setAttribute('aria-hidden', String(!shouldExpand));
    discordSubcards.classList.toggle('show', shouldExpand);
    
    // Update subtitle text
    const subtitle = discordCard.querySelector('.link-subtitle');
    if (subtitle) {
      subtitle.textContent = shouldExpand ? 'click to collapse' : 'click to expand';
    }
    
    announceToScreenReader(shouldExpand ? 'Discord options expanded' : 'Discord options collapsed');
  }

  // Same event handlers as before...
  discordCard.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDiscordExpansion();
  });

  discordCard.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDiscordExpansion();
        break;
      case 'Escape':
        e.preventDefault();
        toggleDiscordExpansion(false);
        break;
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!discordCard.contains(e.target) && !discordSubcards.contains(e.target)) {
      toggleDiscordExpansion(false);
    }
  });
}

/* =========================
   PROJECT FILTERING
========================= */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!filterButtons.length || !projectCards.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
      
      // Add animation delay for visible cards
      const visibleCards = document.querySelectorAll('.project-card:not(.hidden)');
      visibleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
      });
    });
  });
}

/* =========================
   THEME SUPPORT & ANALYTICS
========================= */