import { useEffect, useState } from 'react';

// Temporary: an on-screen readout of scroll and viewport values for chasing the Chrome-on-iPhone
// scroll bug. Opening any page with ?debug turns it on for the tab (it survives navigation);
// ?debug=off turns it off. Remove once the bug is understood.
const KEY = 'skevos-debug';

function enabled() {
  try {
    const q = new URLSearchParams(window.location.search).get('debug');
    if (q === 'off') sessionStorage.removeItem(KEY);
    else if (q !== null) sessionStorage.setItem(KEY, '1');
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return new URLSearchParams(window.location.search).has('debug');
  }
}

const r = (n: number | undefined) => (n === undefined ? '-' : Math.round(n * 10) / 10);

export default function DebugOverlay() {
  const [on] = useState(enabled);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!on) return;
    let minY = Infinity;
    let maxGap = 0;
    let gapWindow = 0;
    let scrollEvents = 0;
    let last = performance.now();
    let frame = 0;

    const read = () => {
      const de = document.documentElement;
      const vv = window.visualViewport;
      const nav = document.querySelector('.app-shell > div');
      const hero = document.querySelector('[data-nav-hero]');
      minY = Math.min(minY, window.scrollY);
      setLines([
        `scrollY ${r(window.scrollY)}  min ${r(minY)}`,
        `sEl.scrollTop ${r(document.scrollingElement?.scrollTop)}`,
        `scrollH ${de.scrollHeight}  bodyH ${document.body.scrollHeight}`,
        `innerH ${window.innerHeight}  innerW ${window.innerWidth}`,
        `clientH ${de.clientHeight}  clientW ${de.clientWidth}`,
        `outerH ${window.outerHeight}  screenH ${window.screen.height}`,
        `vv h ${r(vv?.height)} w ${r(vv?.width)}`,
        `vv offTop ${r(vv?.offsetTop)} pageTop ${r(vv?.pageTop)}`,
        `vv scale ${r(vv?.scale)}`,
        `nav top ${r(nav?.getBoundingClientRect().top)} h ${r(nav?.getBoundingClientRect().height)}`,
        `hero top ${r(hero?.getBoundingClientRect().top)} h ${r(hero?.getBoundingClientRect().height)}`,
        `--screen-h ${de.style.getPropertyValue('--screen-h') || '-'}`,
        `html overflow '${de.style.overflow}'`,
        `scroll ev/s ${scrollEvents}  max frame ${Math.round(maxGap)}ms`,
      ]);
    };

    // frame gaps show jank: anything well over 17ms is a dropped frame
    const tick = (now: number) => {
      gapWindow = Math.max(gapWindow, now - last);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onScroll = () => {
      scrollEvents += 1;
      read();
    };
    const interval = window.setInterval(() => {
      maxGap = gapWindow;
      gapWindow = 0;
      read();
      scrollEvents = 0;
    }, 1000);

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', read);
    window.visualViewport?.addEventListener('resize', read);
    window.visualViewport?.addEventListener('scroll', read);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', read);
      window.visualViewport?.removeEventListener('resize', read);
      window.visualViewport?.removeEventListener('scroll', read);
    };
  }, [on]);

  if (!on) return null;
  return (
    <pre
      style={{
        position: 'fixed',
        top: 'calc(var(--nav-h) + 8px)',
        right: 8,
        zIndex: 1000,
        margin: 0,
        padding: '6px 8px',
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#7CFC9A',
        font: '11px/1.35 ui-monospace, Menlo, monospace',
        borderRadius: 4,
        pointerEvents: 'none',
        whiteSpace: 'pre',
      }}
    >
      {`${navigator.userAgent.includes('CriOS') ? 'Chrome iOS' : 'other'}\n${lines.join('\n')}`}
    </pre>
  );
}
