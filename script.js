const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;

// Устанавливаем начальный активный слайд
slides[current].classList.add('active');
slides[current].style.transform = 'translateY(0)';

function showNext() {
  if (current >= slides.length - 1 || isAnimating) return;
  isAnimating = true;

  const currentSlide = slides[current];
  const nextSlide = slides[current + 1];

  nextSlide.classList.add('active'); // сделать видимым
  nextSlide.style.transform = 'translateY(0)';
  currentSlide.style.transform = 'translateY(-100vh)';

  current++;

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

function showPrev() {
  if (current <= 0 || isAnimating) return;
  isAnimating = true;

  const currentSlide = slides[current];
  const prevSlide = slides[current - 1];

  currentSlide.style.transform = 'translateY(100vh)';
  prevSlide.classList.add('active');
  prevSlide.style.transform = 'translateY(0)';

  current--;

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

window.addEventListener('wheel', e => {
  if (isAnimating) return;
  if (e.deltaY > 0) showNext();
  else if (e.deltaY < 0) showPrev();
});
