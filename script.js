// script.js
const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;

function showNext() {
  if (current >= slides.length - 1) return;
  isAnimating = true;

  // Прячем текущий «занавес»
  slides[current].style.transition = 'transform 0.8s ease-in-out';
  slides[current].style.transform   = 'translateY(-100vh)';

  current++;
  // Сразу задаём у нового слайда transform = 0 (он уже под ним)
  slides[current].style.transition = 'none';
  slides[current].style.transform  = 'translateY(0)';

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

function showPrev() {
  if (current <= 0) return;
  isAnimating = true;

  // Сдвигаем обратно предыдущий слайд вниз
  slides[current - 1].style.transition = 'transform 0.8s ease-in-out';
  slides[current - 1].style.transform   = 'translateY(0)';

  // Уезжающий (текущий) может оставаться на месте или скрываться под ним:
  slides[current].style.transition = 'none';
  slides[current].style.transform   = 'translateY(100vh)';

  current--;
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

let lastScrollTime = 0;
const scrollCooldown = 1000;

window.addEventListener('wheel', e => {
  const now = Date.now();
  if (isAnimating || now - lastScrollTime < scrollCooldown) return;

  if (e.deltaY > 0 && current < slides.length - 1) {
    showNext();
    lastScrollTime = now;
  } else if (e.deltaY < 0 && current > 0) {
    showPrev();
    lastScrollTime = now;
  }
});



