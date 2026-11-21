import { useEffect, useState } from 'react';

export interface Route {
  path: string;
  query: URLSearchParams;
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(qs ?? '') };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(to: string) {
  const target = to.startsWith('#') ? to : `#${to}`;
  if (window.location.hash === target) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else window.location.hash = target;
}

export const href = (to: string) => `#${to}`;
