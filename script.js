const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;
let isReady = false;

function updateSlides() {
  slides.forEach((slide, i) => {
    if (i < current) {
      slide.style.transform = 'translateY(-100vh)';
      slide.classList.remove('active');
    } else if (i === current) {
      slide.style.transform = 'translateY(0)';
      slide.classList.add('active');
    } else {
      slide.style.transform = 'translateY(100vh)';
      slide.classList.remove('active');
    }
  });
}

function showNext() {
  if (current >= slides.length - 1 || isAnimating) return;
  isAnimating = true;
  current++;
  updateSlides();
  setTimeout(() => { isAnimating = false; }, 800);
}

function showPrev() {
  if (current <= 0 || isAnimating) return;
  isAnimating = true;
  current--;
  updateSlides();
  setTimeout(() => { isAnimating = false; }, 800);
}

window.addEventListener('wheel', e => {
  e.preventDefault();
  if (!isReady || isAnimating) return;   // ← игнорим, пока не готов
  if (e.deltaY > 0)      showNext();
  else if (e.deltaY < 0) showPrev();
}, { passive: false });

window.addEventListener('DOMContentLoaded', () => {
  updateSlides();
  window.scrollTo(0, 0);
  // Разрешаем обработку скролла через 300ms
  setTimeout(() => { isReady = true; }, 300);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
