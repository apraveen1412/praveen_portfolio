const THEME_KEY = 'portfolio-theme';
const DARK_THEME_CLASS = 'theme-dark';

const applyTheme = (theme) => {
  document.body.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
};

const getStoredTheme = () => localStorage.getItem(THEME_KEY);

const getInitialTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const toggleTheme = () => {
  const isDark = document.body.classList.contains(DARK_THEME_CLASS);
  const nextTheme = isDark ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
};

applyTheme(getInitialTheme());

const appearanceToggle = document.getElementById('appearance');
if (appearanceToggle) {
  appearanceToggle.addEventListener('click', (event) => {
    event.preventDefault();
    toggleTheme();
  });
}

const showLandingIntro = () => {
  const landingIntro = document.querySelector('.land-intro');
  if (landingIntro) {
    landingIntro.classList.add('loaded');
  }
};

requestAnimationFrame(showLandingIntro);
window.addEventListener('load', showLandingIntro);

const contactLink = document.querySelector('.contact');
if (contactLink) {
  contactLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.get-in-touch')?.scrollIntoView({
      behavior: 'smooth'
    });
  });
}

const contactMail = document.querySelector('.contact-mail');
if (contactMail) {
  contactMail.addEventListener('click', (event) => {
    event.preventDefault();

    const isMobileDevice = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const email = 'aaraveetipraveen@gmail.com';

    if (isMobileDevice()) {
      window.location.href = `mailto:${email}`;
    } else {
      window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    }
  });
}
