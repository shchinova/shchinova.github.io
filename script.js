const slides   = [...document.querySelectorAll('.slide')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const header   = document.querySelector('.logo-bar');
const progressBar = document.querySelector('.progress-bar');

// Высота шапки
function headerOffset() {
  return header ? header.offsetHeight : 0;
}

// Подсветка активного пункта навигации
function updateActiveLink() {
  const y = window.scrollY + headerOffset() + window.innerHeight * 0.4; // порог ~40% экрана
  let currentIndex = 0;
  slides.forEach((slide, i) => {
    if (y >= slide.offsetTop) currentIndex = i;
  });
  navLinks.forEach(l => l.classList.remove('active'));
  if (navLinks[currentIndex]) navLinks[currentIndex].classList.add('active');
}

// Прокрутка по клику с временным отключением sticky
function smoothGoto(targetEl) {
  document.body.classList.add('body-disable-sticky');

  const extraOffset = 18; // дополнительные пиксели для точной позиции
  const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset() + extraOffset;

  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  const finish = () => {
    document.body.classList.remove('body-disable-sticky');
    updateActiveLink();
  };

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', finish, { once: true });
  } else {
    let lastY = -1;
    const id = setInterval(() => {
      if (window.scrollY === lastY) {
        clearInterval(id);
        finish();
      } else {
        lastY = window.scrollY;
      }
    }, 100);
    setTimeout(() => { clearInterval(id); finish(); }, 1200);
  }
}

// Обновление прогресс-бара
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = scrollTop / docHeight; // от 0 до 1
  progressBar.style.transform = `scaleX(${progress})`;
}

// Объединённый обработчик скролла
function onScroll() {
  updateActiveLink();
  updateProgressBar();
}

// Навигация по клику
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) smoothGoto(target);
  });
});

// Подписка на события
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', () => {
  updateActiveLink();
  updateProgressBar();
});

// Инициализация сразу
updateActiveLink();
updateProgressBar();
