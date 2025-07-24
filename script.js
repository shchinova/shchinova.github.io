// script.js
const c = document.querySelector('.slides-container');
let idx = 0, busy = false;
function go(i) {
  c.style.transform = `translateY(-${i*100}vh)`;
}
go(idx);
window.addEventListener('wheel', e => {
  if (busy) return;
  busy = true;
  if (e.deltaY>0 && idx<2) idx++;
  else if (e.deltaY<0 && idx>0) idx--;
  go(idx);
  setTimeout(() => busy = false, 800);
});
