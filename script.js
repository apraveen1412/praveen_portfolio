document.getElementById('appearance').onclick=()=>{
    const apElement = document.getElementById('ap');
    const anchorTags = document.getElementsByTagName('a');
  
    if (apElement.style.color === 'white') { 
      apElement.style.color = ''; // Reset to default color
      apElement.style.backgroundColor = '';
      for (let i = 0; i < anchorTags.length; i++) {
        anchorTags[i].style.color = ''; 
      }
    } else {
      apElement.style.color = 'white';
      apElement.style.backgroundColor = 'black';
      for (let i = 0; i < anchorTags.length; i++) {
        anchorTags[i].style.color = 'gray';
      }
    }
  }

window.addEventListener('load', () => {
  document.querySelector('.land-intro').classList.add('loaded'); 
});

document.querySelector('.contact').onclick = (event) => {
  event.preventDefault();
  document.querySelector('.get-in-touch').scrollIntoView({
    behavior:"smooth"
  });
}

document.querySelector('.contact-mail').onclick = (event) => {
  event.preventDefault(); // Prevent the default link behavior

  function isMobileDevice() {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  const email = "aaraveetipraveen@gmail.com";

  if (isMobileDevice()) {
      // On mobile, try to open the Gmail app or default email client with no subject or body
      window.location.href = `mailto:${email}`;
  } else {
      // On desktop, redirect to Gmail web compose page with no subject or body
      window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  }
};
