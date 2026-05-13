import type { Player, PlayerStats } from '../types'

interface Props {
  players: Player[]
  allStats: PlayerStats[]
}

export default function Leaderboard({ players, allStats }: Props) {
  // Sort by wins desc, then losses asc, then name
  const rows = players
    .map(p => ({ player: p, stats: allStats.find(s => s.playerId === p.id)! }))
    .filter(r => r.stats)
    .sort((a, b) => {
      if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins
      if (a.stats.losses !== b.stats.losses) return a.stats.losses - b.stats.losses
      return a.player.name.localeCompare(b.player.name)
    })

  if (rows.length === 0) return null

  return (
    <div className="leaderboard">
      <div className="section-title">Leaderboard</div>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span className="lb-name">Player</span>
          <span className="lb-stat">W</span>
          <span className="lb-stat">L</span>
          <span className="lb-stat" title="Current streak">🔥</span>
          <span className="lb-stat" title="Longest streak">★</span>
        </div>
        {rows.map(({ player, stats }, i) => (
          <div key={player.id} className={`leaderboard-row${i === 0 && stats.wins > 0 ? ' leader' : ''}`}>
            <span className="lb-name">
              {i === 0 && stats.wins > 0 && <span className="leader-crown">👑 </span>}
              {player.name}
            </span>
            <span className="lb-stat wins">{stats.wins}</span>
            <span className="lb-stat losses">{stats.losses}</span>
            <span className="lb-stat streak">
              {stats.currentStreak > 0 ? stats.currentStreak : '—'}
            </span>
            <span className="lb-stat longest">
              {stats.longestStreak > 0 ? stats.longestStreak : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
