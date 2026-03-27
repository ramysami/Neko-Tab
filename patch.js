const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');
const oldStr = `  return (
    <>
      <div className="focus-trigger-wrapper">
        <button
          className="focus-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Focus Dashboard"
        >
          {isActive ? <Shield size={20} className="text-red-400" /> : <Target size={20} />}
          {isActive && <span className="focus-timer-mini">{formatTime(timeLeft)}</span>}
        </button>
      </div>`;
const newStr = `  return (
    <>
      {isActive && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-red-500/50 z-50">
          <div 
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: \`\${Math.max(0, Math.min(100, ((focusState.duration * 60 - timeLeft) / (focusState.duration * 60)) * 100))}\%\` }}
          />
        </div>
      )}

      {/* Button to open Focus Dashboard */}
      {!import.meta.env.VITE_HIDE_STANDALONE_FOCUS && (
        <div className="fixed top-6 left-6 z-40">
          <button
            className="app-btn cmd-trigger"
            onClick={() => setIsOpen(true)}
            title="Focus Dashboard"
            style={{ position: 'relative' }}
          >
            {isActive ? <Shield size={20} className="text-red-400" /> : <Target size={20} />}
            {isActive && (
               <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                 {formatTime(timeLeft)}
               </span>
            )}
          </button>
        </div>
      )}`;
content = content.replace(oldStr, newStr);
fs.writeFileSync('src/components/FocusMode.tsx', content);
