const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
let isAnimating = false;

function showNext() {
  if (current >= slides.length - 1) return;
  isAnimating = true;

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
  if (current <= 0) return;
  isAnimating = true;

  slides[current - 1].style.transition = 'transform 0.8s ease-in-out';
  slides[current - 1].style.transform = 'translateY(0)';

  slides[current].style.transition = 'none';
  slides[current].style.transform = 'translateY(100vh)';

  current--;
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

// 💡 Новая функция — проверка, достигнут ли верх/низ у скролла
function canScrollSlide2(e) {
  const slide2 = document.querySelector('#slide2');
  const atTop = slide2.scrollTop === 0;
  const atBottom = slide2.scrollHeight - slide2.clientHeight === slide2.scrollTop;

  if (e.deltaY > 0 && atBottom) return false; // вниз, но уже внизу
  if (e.deltaY < 0 && atTop) return false;    // вверх, но уже наверху
  return true; // внутри области скролла
}

window.addEventListener('wheel', e => {
  if (isAnimating) return;

  // 🔒 Блокируем переход, если пользователь скроллит внутри slide2
  if (current === 1 && canScrollSlide2(e)) return;

  if (e.deltaY > 0)       showNext();
  else if (e.deltaY < 0)  showPrev();
});
