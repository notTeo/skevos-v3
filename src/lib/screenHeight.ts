// Chrome on iPhone resizes the page while its toolbars slide away and back, so anything
// sized in vh/svh grows and shrinks mid-scroll: the content below jumps, the nav feels
// laggy and the page can stop short of the top. The screen height is measured once into
// --screen-h instead, and only re-measured when the width changes (a phone turning) or on
// a desktop window, where a height change is a real resize.
export function trackScreenHeight() {
  const root = document.documentElement;
  const touch = window.matchMedia('(pointer: coarse)');
  let width = 0;
  const measure = () => {
    if (touch.matches && window.innerWidth === width) return;
    width = window.innerWidth;
    const h = window.innerHeight;
    root.style.setProperty('--screen-h', `${h}px`);
    // short phone screens get less space under the hero text (see Home.module.css)
    root.classList.toggle('short-screen', h <= 720);
  };
  measure();
  window.addEventListener('resize', measure);
}
