import type { Stats } from '../types'

interface Props {
  stats: Stats
  myName: string
}

export default function StatsCards({ stats, myName }: Props) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card wins">
          <div className="stat-value">{stats.totalWins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-card losses">
          <div className="stat-value">{stats.totalLosses}</div>
          <div className="stat-label">Losses</div>
        </div>
        <div className="stat-card ties">
          <div className="stat-value">{stats.totalTies}</div>
          <div className="stat-label">Ties</div>
        </div>
      </div>
      <div className="stats-grid-streaks">
        <div className="stat-card streak">
          <div className="stat-value">
            {stats.currentStreak > 0 ? `🔥 ${stats.currentStreak}` : stats.currentStreak}
          </div>
          <div className="stat-label">{myName}'s Streak</div>
        </div>
        <div className="stat-card longest">
          <div className="stat-value">
            {stats.longestStreak > 0 ? `★ ${stats.longestStreak}` : stats.longestStreak}
          </div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>
    </>
  )
}
