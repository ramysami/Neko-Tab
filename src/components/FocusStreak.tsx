import { useFocusSessions } from '../hooks/useFocusSessions'

export function FocusStreak() {
  const { streak, weeklyBlocks } = useFocusSessions()
  const maxBlocks = Math.max(...weeklyBlocks, 1)

  return (
    <div className="stat-item focus-streak-item" title="Focus streak — days with at least one completed session">
      <span className="stat-label">FOCUS</span>
      <div className="gh-sparkline">
        {weeklyBlocks.map((count, i) => (
          <div
            key={i}
            className="gh-spark-bar focus-spark-bar"
            style={{ height: `${Math.max(2, Math.round((count / maxBlocks) * 14))}px` }}
            title={`${count} block${count !== 1 ? 's' : ''}`}
          />
        ))}
      </div>
      <span className="stat-value">
        {streak > 0 ? `● ${streak}D` : '◌ 0D'}
      </span>
    </div>
  )
}
