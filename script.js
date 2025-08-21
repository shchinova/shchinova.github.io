// -----------------------------------------------------
// ЭЛЕМЕНТЫ DOM
// -----------------------------------------------------
const slides      = [...document.querySelectorAll('.slide')];
const navLinks    = [...document.querySelectorAll('.nav-links a')];
const header      = document.querySelector('.logo-bar');
const progressBar = document.querySelector('.progress-bar');

// -----------------------------------------------------
// ВЫСОТА ШАПКИ
// -----------------------------------------------------
function headerOffset() {
  // возвращает высоту верхней панели, чтобы учитывать при скролле
  return header ? header.offsetHeight : 0;
}

// -----------------------------------------------------
// ПОДСВЕТКА АКТИВНОГО ПУНКТА НАВИГАЦИИ
// -----------------------------------------------------
function updateActiveLink() {
  // позиция скролла + поправка на шапку и 40% высоты экрана
  const y = window.scrollY + headerOffset() + window.innerHeight * 0.4;
  let currentIndex = 0;

  slides.forEach((slide, i) => {
    if (y >= slide.offsetTop) currentIndex = i;
  });

  // убираем активный класс у всех ссылок
  navLinks.forEach(l => l.classList.remove('active'));

  // добавляем активный класс текущей
  if (navLinks[currentIndex]) navLinks[currentIndex].classList.add('active');
}

// -----------------------------------------------------
// ПЛАВНАЯ ПРОКРУТКА ПО КЛИКУ
// -----------------------------------------------------
function smoothGoto(targetEl) {
  document.body.classList.add('body-disable-sticky');

  const extraOffset = 18; // дополнительные пиксели для точного позиционирования
  const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset() + extraOffset;

  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  // функция завершения прокрутки
  const finish = () => {
    document.body.classList.remove('body-disable-sticky');
    updateActiveLink();
  };

  // проверка поддержки события scrollend
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

    // защита от зависания (макс. 1.2 сек)
    setTimeout(() => { clearInterval(id); finish(); }, 1200);
  }
}

// -----------------------------------------------------
// ОБНОВЛЕНИЕ ПРОГРЕСС-БАРА
// -----------------------------------------------------
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress  = scrollTop / docHeight; // значение от 0 до 1
  progressBar.style.transform = `scaleX(${progress})`;
}

// -----------------------------------------------------
// ОБЪЕДИНЁННЫЙ ОБРАБОТЧИК СКРОЛЛА
// -----------------------------------------------------
function onScroll() {
  updateActiveLink();
  updateProgressBar();
}

// -----------------------------------------------------
// НАВИГАЦИЯ ПО КЛИКУ
// -----------------------------------------------------
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) smoothGoto(target);
  });
});

// -----------------------------------------------------
// ПОДПИСКА НА СОБЫТИЯ
// -----------------------------------------------------
window.addEventListener('scroll', onScroll);

window.addEventListener('resize', () => {
  updateActiveLink();
  updateProgressBar();
});

// -----------------------------------------------------
// ПЕРВИЧНАЯ ИНИЦИАЛИЗАЦИЯ
// -----------------------------------------------------
updateActiveLink();
updateProgressBar();

// -----------------------------------------------------
// КАРТОЧКИ ПРОЕКТОВ: сворачивание / разворачивание
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // если клик по ссылке внутри карточки — не мешаем переходу
      const link = e.target.closest('a');
      if (link) return;

      const isExpanded = card.classList.contains('expanded');

      // сворачиваем все
      cards.forEach(c => c.classList.remove('expanded'));

      // если текущая была закрыта — раскрываем
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
});
