/* ============================================
   Texas Tangles Salon
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loading Screen ----
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 800);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 800);
    }
  }

  // ---- Navbar Scroll ----
  const navbar = document.querySelector('.navbar');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Active Nav Link ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile Menu ----
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Reviews Slider ----
  const reviewTrack = document.querySelector('.reviews__track');
  const reviewCards = document.querySelectorAll('.reviews__card');
  const reviewDots = document.querySelectorAll('.reviews__dot');
  const prevBtn = document.querySelector('.reviews__nav-btn--prev');
  const nextBtn = document.querySelector('.reviews__nav-btn--next');
  let currentReview = 0;
  let reviewAutoplay;

  function goToReview(index) {
    if (index < 0) index = reviewCards.length - 1;
    if (index >= reviewCards.length) index = 0;
    currentReview = index;

    if (reviewTrack) {
      reviewTrack.style.transform = `translateX(-${currentReview * 100}%)`;
    }

    reviewDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentReview);
    });
  }

  function startReviewAutoplay() {
    reviewAutoplay = setInterval(() => {
      goToReview(currentReview + 1);
    }, 6000);
  }

  function resetReviewAutoplay() {
    clearInterval(reviewAutoplay);
    startReviewAutoplay();
  }

  if (reviewCards.length > 0) {
    reviewDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToReview(i);
        resetReviewAutoplay();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToReview(currentReview - 1);
        resetReviewAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToReview(currentReview + 1);
        resetReviewAutoplay();
      });
    }

    startReviewAutoplay();

    // Touch/swipe support for reviews
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.querySelector('.reviews__slider');

    if (slider) {
      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            goToReview(currentReview + 1);
          } else {
            goToReview(currentReview - 1);
          }
          resetReviewAutoplay();
        }
      }, { passive: true });
    }
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Back to Top Button ----
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Dynamic Years in Business ----
  const FOUNDED_YEAR = 1948;
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - FOUNDED_YEAR;

  // Populate all static .years-count spans
  document.querySelectorAll('.years-count').forEach(el => {
    el.textContent = yearsInBusiness;
  });

  // Set data-count on the animated heritage stat so the counter works dynamically
  const yearsCountStat = document.querySelector('.years-count-stat');
  if (yearsCountStat) {
    yearsCountStat.setAttribute('data-count', yearsInBusiness);
  }

  // ---- Counter Animation for Stats ----
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * eased);
          el.textContent = prefix + current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ---- Highlight Today's Hours ----
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = daysMap[new Date().getDay()];
  const hoursRows = document.querySelectorAll('.hours-table tr[data-day]');

  hoursRows.forEach(row => {
    if (row.getAttribute('data-day') === today) {
      row.classList.add('today');
    }
  });

  // ---- Parallax for Heritage Section ----
  const heritage = document.querySelector('.heritage');
  if (heritage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = (scrolled - heritage.offsetTop) * 0.15;
      if (scrolled > heritage.offsetTop - window.innerHeight && scrolled < heritage.offsetTop + heritage.offsetHeight) {
        heritage.style.backgroundPositionY = `${rate}px`;
      }
    }, { passive: true });
  }

  // ---- Year Copyright Auto Update ----
  const yearEl = document.querySelector('.footer__copy');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace('2026', currentYear);
  }
});
