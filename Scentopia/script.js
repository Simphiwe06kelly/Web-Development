const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Responsive nav adjustment
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    nav.style.display = 'flex';
  } else {
    nav.style.display = 'none';
  }
});
