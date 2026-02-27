document.getElementById('appearance').onclick = () => {
  const apElement = document.getElementById('ap');
  const anchorTags = document.getElementsByTagName('a');
  const apsub = document.querySelector('.ap-sub');
  const paraTags = document.getElementsByTagName('p');
  const moreBlogs = document.querySelector('.more-blogs');
  const moreBlogsAnchor = document.querySelector('.more-blogs a');

  const toggleColors = (elements, defaultColor, activeColor) => {
      for (let i = 0; i < elements.length; i++) {
          elements[i].style.color = elements[i].style.color === activeColor ? defaultColor : activeColor;
      }
  };

  // Toggle colors and backgrounds for apElement and anchorTags
  if (apElement.style.color === 'white') {
      apElement.style.color = ''; // Reset to default
      apElement.style.backgroundColor = '';
      moreBlogs.style.backgroundColor = 'rgb(31, 31, 31)';
      moreBlogsAnchor.style.color = 'whitesmoke';
  } else {
      apElement.style.color = 'white';
      apElement.style.backgroundColor = 'black';
      moreBlogs.style.backgroundColor = 'whitesmoke';
      moreBlogsAnchor.style.color = 'rgb(31, 31, 31)';
  }
  toggleColors(anchorTags, '', 'gray');

  // Toggle colors and backgrounds for apsub and paraTags
  if (apsub.style.color === 'whitesmoke') {
      apsub.style.color = ''; // Reset to default
      apsub.style.backgroundColor = '';
  } else {
      apsub.style.color = 'lightgray';
      apsub.style.backgroundColor = 'rgb(31, 31, 31)';
  }
  toggleColors(paraTags, '', 'gray');
};





window.addEventListener('load', () => {
  document.querySelector('.land-intro').classList.add('loaded'); 
});

document.querySelector('.contact').onclick = (event) => {
  event.preventDefault();
  document.querySelector('.get-in-touch').scrollIntoView({
    behavior:"smooth"
  });
}

const contactMailLink = document.querySelector('.contact-mail');

if (contactMailLink) {
  contactMailLink.addEventListener('click', (event) => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Keep normal mailto behavior on mobile and when JavaScript is unavailable.
    if (isMobileDevice) {
      return;
    }

    event.preventDefault();

    const gmailComposeUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=aaraveetipraveen@gmail.com';
    const fallbackMailto = contactMailLink.getAttribute('href') || 'mailto:aaraveetipraveen@gmail.com';

    const gmailWindow = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

    // If popup is blocked, fall back to the standard mailto behavior.
    if (!gmailWindow) {
      window.location.href = fallbackMailto;
    }
  });
}
