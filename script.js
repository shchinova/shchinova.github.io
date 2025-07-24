const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;

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
  setTimeout(() => isAnimating = false, 800);
}

function showPrev() {
  if (current <= 0 || isAnimating) return;
  isAnimating = true;
  current--;
  updateSlides();
  setTimeout(() => isAnimating = false, 800);
}

window.addEventListener('wheel', e => {
  if (isAnimating) return;
  if (e.deltaY > 0) showNext();
  else if (e.deltaY < 0) showPrev();
});

// Инициализация
updateSlides();
