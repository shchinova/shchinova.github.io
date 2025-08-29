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
  return header ? header.offsetHeight : 0;
}

/// -----------------------------------------------------
// ПОДСВЕТКА АКТИВНОГО ПУНКТА НАВИГАЦИИ
// -----------------------------------------------------
function updateActiveLink() {
  // y — текущая позиция скролла с учётом верхней панели и небольшой поправки для середины экрана
  const y = window.scrollY + headerOffset() + window.innerHeight * 0.4;
  let currentIndex = 0;

  slides.forEach((slide, i) => {
    // если верх слайда находится выше текущей позиции y, считаем его активным
    if (y >= slide.offsetTop) {
      currentIndex = i;
    }
  });

  // снимаем класс active со всех ссылок
  navLinks.forEach(link => link.classList.remove('active'));

  // добавляем active только для текущей ссылки
  if (navLinks[currentIndex]) {
    navLinks[currentIndex].classList.add('active');
  }
}

// -----------------------------------------------------
// ПЛАВНАЯ ПРОКРУТКА ПО КЛИКУ
// -----------------------------------------------------
function smoothGoto(targetEl) {
  document.body.classList.add('body-disable-sticky');

  const extraOffset = 18;
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

// -----------------------------------------------------
// ОБНОВЛЕНИЕ ПРОГРЕСС-БАРА
// -----------------------------------------------------
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress  = scrollTop / docHeight;
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
// ЭЛЕМЕНТЫ
// -----------------------------------------------------
const projectItems = document.querySelectorAll('.project-item');
const projectTitle = document.querySelector('.project-title');
const projectDesc = document.querySelector('.project-description');
const projectTools = document.querySelector('.project-tools');
const projectNumber = document.querySelector('.project-number');
const allTools = document.querySelectorAll('.tool');

let activeProject = null;   // текущий активный проект
let selectedTool = null;    // выбранный инструмент (tool.choice)

// -----------------------------------------------------
// УТИЛИТЫ
// -----------------------------------------------------
function parseToolsList(str) {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

// -----------------------------------------------------
// ВИЗУАЛИЗАЦИЯ ПРОЕКТА
// -----------------------------------------------------
function showProject(item) {
  projectTitle.textContent = item.dataset.title || '';
  projectDesc.textContent = item.dataset.description || '';
  projectNumber.textContent = (item.dataset.project || '').toString().padStart(2, '0');

  projectTools.innerHTML = '';
  const toolsOfProject = parseToolsList(item.dataset.tools);

  toolsOfProject.forEach(t => {
    const span = document.createElement('span');
    span.classList.add('tool', 'active');
    const leftTool = document.querySelector(`.tool[data-tool="${t}"]`);
    span.textContent = leftTool ? leftTool.textContent : t;
    projectTools.appendChild(span);
  });

  // сброс активных у всех инструментов
  allTools.forEach(tool => tool.classList.remove('active'));

  // подсветка инструментов активного проекта
  toolsOfProject.forEach(t => {
    const el = document.querySelector(`.tool[data-tool="${t}"]`);
    if (el) el.classList.add('active');
  });

  // если инструмент выбран – он остаётся выделенным
  if (selectedTool) {
    selectedTool.classList.add('choice');
  }
}

// -----------------------------------------------------
// УСТАНОВКА АКТИВНОГО ПРОЕКТА
// -----------------------------------------------------
function setActiveProject(item) {
  if (activeProject) activeProject.classList.remove('active');
  activeProject = item;
  item.classList.add('active');
  showProject(item);

  // сброс подсветок остальных
  projectItems.forEach(p => {
    if (p !== item) {
      p.classList.remove('active');
      p.classList.remove('highlight');
    }
  });

  // если выбранный инструмент не входит в проект – сброс выбора
  if (selectedTool) {
    const toolName = selectedTool.dataset.tool;
    const tools = parseToolsList(item.dataset.tools);
    if (!tools.includes(toolName)) {
      clearToolSelection();
    }
  }
}

// -----------------------------------------------------
// ПОДСВЕТКА
// -----------------------------------------------------
function highlightProjects(toolName) {
  clearHighlights();
  let related = [];
  projectItems.forEach(p => {
    const tools = parseToolsList(p.dataset.tools);
    if (tools.includes(toolName)) {
      if (!p.classList.contains('active')) {
        p.classList.add('highlight');
      }
      related.push(p);
    }
  });
  return related;
}

function clearHighlights() {
  projectItems.forEach(p => p.classList.remove('highlight'));
}

function clearToolSelection() {
  if (selectedTool) {
    selectedTool.classList.remove('choice');
    selectedTool = null;
  }
  clearHighlights();
}

// -----------------------------------------------------
// ОБРАБОТЧИКИ ИНСТРУМЕНТОВ
// -----------------------------------------------------
allTools.forEach(tool => {
  const toolName = tool.dataset.tool;

  tool.addEventListener('mouseenter', () => {
    // всегда подсвечиваем проекты по наведённому инструменту
    highlightProjects(toolName);
  });

  tool.addEventListener('mouseleave', () => {
    if (selectedTool) {
      // если есть выбранный инструмент → восстанавливаем его подсветку
      highlightProjects(selectedTool.dataset.tool);
    } else {
      // если выбора нет → снимаем подсветку
      clearHighlights();
    }
  });

  tool.addEventListener('click', () => {
    // если уже выбран этот инструмент → снять выбор
    if (selectedTool === tool) {
      tool.classList.remove('choice');
      selectedTool = null;

      // если активный проект использует инструмент → оставить .active
      if (activeProject) {
        const tools = parseToolsList(activeProject.dataset.tools);
        if (tools.includes(toolName)) {
          tool.classList.add('active');
        }
      }
      clearHighlights();
      return;
    }

    // выбор другого инструмента
    clearToolSelection();
    selectedTool = tool;
    tool.classList.add('choice');

    const related = highlightProjects(toolName);

    if (related.length === 1) {
      setActiveProject(related[0]);
    }
  });
});

// -----------------------------------------------------
// ОБРАБОТЧИКИ ПРОЕКТОВ
// -----------------------------------------------------
projectItems.forEach(item => {
  item.addEventListener('click', () => {
    setActiveProject(item);
  });
});

// -----------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ
// -----------------------------------------------------
if (projectItems.length > 0) {
  setActiveProject(projectItems[0]);
}

// -----------------------------------------------------
// КОПИРОВАНИЕ ПОЧТЫ В БУФЕР
// -----------------------------------------------------
const emailEl = document.querySelector(".contacts-email");

if (emailEl) {
  emailEl.addEventListener("click", () => {
    const rawEmail = emailEl.dataset.email || emailEl.textContent.trim();
    const email = rawEmail.toLowerCase(); // копируем строчными

    navigator.clipboard.writeText(email).then(() => {
      emailEl.classList.add("copied");
      setTimeout(() => emailEl.classList.remove("copied"), 2000);
    });
  });
}

// -----------------------------------------------------
// QR-КОД → ОТКРЫТЬ TELEGRAM
// -----------------------------------------------------
const qrEl = document.querySelector(".tg-qr");

if (qrEl) {
  qrEl.addEventListener("click", () => {
    const url = qrEl.dataset.url;
    if (url) {
      window.open(url, "_blank");
    }
  });
}
