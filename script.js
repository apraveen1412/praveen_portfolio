const appearanceButton = document.getElementById('appearance');

if (appearanceButton) {
  appearanceButton.onclick = (event) => {
    event.preventDefault();

    const apElement = document.getElementById('ap');
    const anchorTags = document.getElementsByTagName('a');
    const apsub = document.querySelector('.apsub');
    const paraTags = document.getElementsByTagName('p');
    const moreBlogs = document.querySelector('.more-blogs');
    const moreBlogsAnchor = document.querySelector('.more-blogs a');

    const toggleColors = (elements, defaultColor, activeColor) => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = elements[i].style.color === activeColor ? defaultColor : activeColor;
      }
    };

    if (apElement) {
      if (apElement.style.color === 'white') {
        apElement.style.color = '';
        apElement.style.backgroundColor = '';
        if (moreBlogs) moreBlogs.style.backgroundColor = 'rgb(31, 31, 31)';
        if (moreBlogsAnchor) moreBlogsAnchor.style.color = 'whitesmoke';
      } else {
        apElement.style.color = 'white';
        apElement.style.backgroundColor = 'black';
        if (moreBlogs) moreBlogs.style.backgroundColor = 'whitesmoke';
        if (moreBlogsAnchor) moreBlogsAnchor.style.color = 'rgb(31, 31, 31)';
      }
    }

    toggleColors(anchorTags, '', 'gray');

    if (apsub) {
      if (apsub.style.color === 'whitesmoke') {
        apsub.style.color = '';
        apsub.style.backgroundColor = '';
      } else {
        apsub.style.color = 'lightgray';
        apsub.style.backgroundColor = 'rgb(31, 31, 31)';
      }
    }

    toggleColors(paraTags, '', 'gray');
  };
}

window.addEventListener('load', () => {
  const introSection = document.querySelector('.land-intro');
  if (introSection) {
    introSection.classList.add('loaded');
  }
});

const contactButton = document.querySelector('.contact');
if (contactButton) {
  contactButton.onclick = (event) => {
    event.preventDefault();
    const contactSection = document.querySelector('.get-in-touch');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

const contactMail = document.querySelector('.contact-mail');
if (contactMail) {
  contactMail.onclick = (event) => {
    event.preventDefault();

    const isMobileDevice = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const email = 'aaraveetipraveen@gmail.com';

    if (isMobileDevice()) {
      window.location.href = `mailto:${email}`;
    } else {
      window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    }
  };
}
