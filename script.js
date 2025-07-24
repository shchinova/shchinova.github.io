const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let isScrolling = false;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateY(${(i - index) * 100}vh)`;
  });
}

// Начальная позиция
showSlide(currentSlide);

window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  isScrolling = true;

  if (e.deltaY > 0 && currentSlide < slides.length - 1) {
    currentSlide++;
  } else if (e.deltaY < 0 && currentSlide > 0) {
    currentSlide--;
  }

  showSlide(currentSlide);
  setTimeout(() => isScrolling = false, 1000);
});
