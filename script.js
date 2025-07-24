const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;
let lastScrollTime = 0;
const scrollCooldown = 800;

function showNext() {
  if (current >= slides.length - 1 || isAnimating) return;
  isAnimating = true;
  lastScrollTime = Date.now(); // Обновляем сразу

  slides[current].style.transition = 'transform 0.8s ease-in-out';
  slides[current].style.transform = 'translateY(-100vh)';

  current++;
  slides[current].style.transition = 'none';
  slides[current].style.transform = 'translateY(0)';

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

function showPrev() {
  if (current <= 0 || isAnimating) return;
  isAnimating = true;
  lastScrollTime = Date.now(); // Обновляем сразу

  slides[current - 1].style.transition = 'transform 0.8s ease-in-out';
  slides[current - 1].style.transform = 'translateY(0)';

  slides[current].style.transition = 'none';
  slides[current].style.transform = 'translateY(100vh)';

  current--;
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

window.addEventListener('wheel', e => {
  const now = Date.now();
  if (now - lastScrollTime < scrollCooldown) return;

  if (e.deltaY > 0) {
    showNext();
  } else if (e.deltaY < 0) {
    showPrev();
  }
});
