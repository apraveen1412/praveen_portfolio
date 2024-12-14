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