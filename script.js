// script.js
const slides = Array.from(document.querySelectorAll('.slide'));
let idx = 0, busy = false;

function update() {
  slides.forEach((sl,i) => {
    // текущий — на месте, предыдущие — уже уехали вверх, следующие — изначально внизу
    if (i < idx)      sl.style.transform = 'translateY(-100%)';
    else if (i === idx) sl.style.transform = 'translateY(0)';
    else               sl.style.transform = 'translateY(100%)';
  });
}

// начальная отрисовка
update();

window.addEventListener('wheel', e => {
  if (busy) return;
  busy = true;
  if (e.deltaY > 0 && idx < slides.length -1) idx++;
  else if (e.deltaY < 0 && idx > 0) idx--;
  update();
  setTimeout(() => busy = false, 800);
});
