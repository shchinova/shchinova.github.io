const container = document.querySelector('.slides-container');
let currentSlide = 0;
let isScrolling = false;

function showSlide(index) {
  container.style.transform = `translateY(-${index * 100}vh)`;
}

showSlide(currentSlide);

window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  isScrolling = true;

  if (e.deltaY > 0 && currentSlide < 2) {
    currentSlide++;
  } else if (e.deltaY < 0 && currentSlide > 0) {
    currentSlide--;
  }

  showSlide(currentSlide);
  setTimeout(() => isScrolling = false, 1000);
});
