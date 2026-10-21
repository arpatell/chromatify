import React from 'react';

const paths = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.5 14.3A9 9 0 0 1 9.7 3.5 9 9 0 1 0 20.5 14.3Z" />,
  coffee: <path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 1h1a3 3 0 0 1 0 6h-1M4 22h14M7 2v3m4-3v3m4-3v3" />,
  user: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="9" r="3" /><path d="M5 19a7 7 0 0 1 14 0" /></>,
  share: <path d="M12 16V3m-5 5 5-5 5 5M5 12H3v9h18v-9h-2" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
  link: <path d="m10 13 4-4M8 15l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 10a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1" transform="translate(0 -1)" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  refresh: <path d="M20 8V3l-3 3A8 8 0 1 0 20 15M15 8h5" />,
  music: <><path d="M9 18V5l12-2v13M9 8l12-2" /><ellipse cx="6" cy="18" rx="3" ry="3" /><ellipse cx="18" cy="16" rx="3" ry="3" /></>,
  external: <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />,
  github: <path d="M9 20c-4 1-4-2-6-2m12 4v-4c0-1 .1-1.8-.5-2.5 3.2-.4 6.5-1.5 6.5-7A5.5 5.5 0 0 0 19.5 5 5 5 0 0 0 19.4 1S18.2.6 15 2.5a13 13 0 0 0-6 0C5.8.6 4.6 1 4.6 1A5 5 0 0 0 4.5 5 5.5 5.5 0 0 0 3 8.5c0 5.5 3.3 6.6 6.5 7C8.9 16.2 9 17 9 18v4" />,
};

export default function Icon({ name, size = 22, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name] || paths.music}</svg>;
}
