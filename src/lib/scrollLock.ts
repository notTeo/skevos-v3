// The mobile menu and the cart drawer both stop the page scrolling behind them. A shared
// counter makes sure one closing never unlocks the page while the other is still open,
// and that the page is always unlocked once both are closed.
let locks = 0;

export function lockScroll(): () => void {
  locks += 1;
  document.documentElement.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.documentElement.style.overflow = '';
  };
}
