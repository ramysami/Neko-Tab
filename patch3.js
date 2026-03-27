const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const svgComponent = `
const ConsistencyIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 12 25 H 88 C 92 25 94 27 94 32 V 75 H 77 C 73 75 70 78 70 82 V 95 H 12 C 8 95 6 93 6 88 V 32 C 6 27 8 25 12 25 Z" />
    <path d="M 70 95 C 75 95 80 92 84 87 C 89 82 94 77 94 75" />
    <line x1="6" y1="36" x2="94" y2="36" />
    <line x1="20" y1="8" x2="20" y2="17" /> <circle cx="20" cy="21" r="2.5" />
    <line x1="40" y1="8" x2="40" y2="17" /> <circle cx="40" cy="21" r="2.5" />
    <line x1="60" y1="8" x2="60" y2="17" /> <circle cx="60" cy="21" r="2.5" />
    <line x1="80" y1="8" x2="80" y2="17" /> <circle cx="80" cy="21" r="2.5" />
    <path d="M 18 52 L 23 57 L 32 46" />
    <path d="M 43 52 L 48 57 L 57 46" />
    <path d="M 68 52 L 73 57 L 82 46" />
    <path d="M 18 70 L 23 75 L 32 64" />
    <path d="M 43 70 L 48 75 L 57 64" />
    <path d="M 68 70 L 73 75 L 82 64" />
    <rect x="18" y="80" width="8" height="8" rx="1.5" />
    <rect x="43" y="80" width="8" height="8" rx="1.5" />
  </svg>
);

`;

if (!content.includes('ConsistencyIcon')) {
  // Insert before DURATION_PRESETS
  content = content.replace('const DURATION_PRESETS', svgComponent + 'const DURATION_PRESETS');
}

const oldLabel = '<div className="weekly-label">▓▓▓▓▓▒▒ this week (Mon–Sun)</div>';
const newLabel = `<div className="weekly-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-start' }}>
                  <ConsistencyIcon size={16} /> this week (Mon–Sun)
                </div>`;

content = content.replace(oldLabel, newLabel);

fs.writeFileSync('src/components/FocusMode.tsx', content);
