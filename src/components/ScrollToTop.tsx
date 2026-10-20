import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The router keeps the old scroll position between pages, so a new page could open halfway
// down. Start each page at the top; links with a #hash scroll to their target themselves.
// Switching finish on a product page (/product/:id/:finish) keeps the position.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const page = pathname.replace(/^(\/product\/[^/]+)\/.*$/, '$1');

  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [page, hash]);

  return null;
}
