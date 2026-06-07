/* Line icons — <Icon name="..." size={18} /> ; exported to window.Icon */
const ICON_PATHS = {
  dashboard: 'M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z',
  scrape:    'M3 7h13M3 12h9M3 17h11 M19 14l3 3-3 3M22 17h-6',
  flow:      'M5 4h5v5H5zM14 15h5v5h-5zM7.5 9v3a3 3 0 0 0 3 3H14',
  mail:      'M3 6.5h18v11H3zM3 7l9 6 9-6',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1zM18 8a4 4 0 0 1 0 8',
  inbox:     'M4 13l2.5-8h11L20 13v6H4zM4 13h5l1.5 3h3L14 13h5',
  contacts:  'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 21h18',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6h.1A1.6 1.6 0 0 0 9 1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus:      'M12 5v14M5 12h14',
  download:  'M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3',
  upload:    'M12 21V9m0 0l-4 4m4-4l4 4M4 7V4h16v3',
  play:      'M6 4l14 8-14 8z',
  pause:     'M7 4h4v16H7zM13 4h4v16h-4z',
  filter:    'M3 5h18l-7 8v6l-4 2v-8z',
  clock:     'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  check:     'M5 12l5 5 9-11',
  checkCircle:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 12l2.5 2.5 4.5-5',
  x:         'M6 6l12 12M18 6L6 18',
  send:      'M21 3L3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5',
  edit:      'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  trash:     'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  chevR:     'M9 6l6 6-6 6',
  chevD:     'M6 9l6 6 6-6',
  chevL:     'M15 6l-6 6 6 6',
  arrowR:    'M5 12h14M13 6l6 6-6 6',
  arrowUp:   'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  bell:      'M18 9a6 6 0 1 0-12 0c0 6-2 8-2 8h16s-2-2-2-8M10 21h4',
  sparkles:  'M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3zM18 14l.9 2.3 2.1.7-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.7z',
  link:      'M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 6 6l-1 1M13.5 17.5l-1 1a4 4 0 0 1-6-6l1-1',
  user:      'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  users:     'M15 19a4 4 0 0 0-8 0M11 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M17 11a3 3 0 1 0-1-5.8M21 19a4 4 0 0 0-3-3.8',
  building:  'M5 21V4h10v17M15 9h4v12M8 8h2M8 12h2M8 16h2',
  reply:     'M9 14L4 9l5-5M4 9h9a7 7 0 0 1 7 7v3',
  eye:       'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  eyeOff:    'M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 4.4-4.4M9.5 4.5A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-3.2 4M6.5 6.5A18 18 0 0 0 2 12s3.5 8 10 8a10 10 0 0 0 5.5-1.7',
  click:     'M9 3v4M5 5l2.5 2.5M3 9h4M12 11l9 4-4 1.5L15 21z',
  calendar:  'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  bolt:      'M13 3L4 14h7l-1 7 9-11h-7z',
  message:   'M4 5h16v11H9l-4 4v-4H4z',
  doc:       'M6 3h8l4 4v14H6zM14 3v4h4',
  dots:      'M5 12h.01M12 12h.01M19 12h.01',
  globe:     'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18',
  target:    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  rocket:    'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 11a4 4 0 0 1 1-2c3-3 7-3 7-3s0 4-3 7a4 4 0 0 1-2 1zM9 11l-3 1 3 3 1-3M14 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  pin:       'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  copy:      'M9 9h11v11H9zM5 15H4V4h11v1',
  external:  'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  linkedin:  'M5 9v10H2V9zM3.5 6a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM9 9h3v1.5c.5-1 1.7-1.8 3.3-1.8 2.7 0 3.7 1.6 3.7 4.5V19h-3v-5c0-1.4-.5-2.2-1.7-2.2-1 0-1.6.7-1.6 2.2v5H9z',
};
function Icon({ name, size = 18, color, strokeWidth = 1.7, fill = false, style, className }) {
  const p = ICON_PATHS[name] || ICON_PATHS.dots;
  const solid = name === 'play' || name === 'pause' || name === 'linkedin';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || solid ? 'currentColor' : 'none'}
      stroke={fill || solid ? 'none' : 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" style={{ color, flex: '0 0 auto', display: 'block', ...style }} className={className}>
      <path d={p} />
    </svg>
  );
}
window.Icon = Icon;
