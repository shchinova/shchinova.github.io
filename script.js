const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let isAnimating = false;

function showNextSlide() {
  if (isAnimating || currentSlide >= slides.length - 1) return;
  isAnimating = true;

  slides[currentSlide].style.transform = 'translateY(-100%)';
  currentSlide++;
  
  setTimeout(() => {
    isAnimating = false;
  }, 1000);
}

function showPrevSlide() {
  if (isAnimating || currentSlide <= 0) return;
  isAnimating = true;

  currentSlide--;
  slides[currentSlide].style.transform = 'translateY(0)';
  
  setTimeout(() => {
    isAnimating = false;
  }, 1000);
}

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    showNextSlide();
  } else {
    showPrevSlide();
  }
});
