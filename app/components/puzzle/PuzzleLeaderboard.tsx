'use client';

import { useEffect, useState } from 'react';
import styles from './PuzzleLeaderboard.module.css';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  puzzle?: {
    id: number;
    title: string;
  };
  pointsEarned: number;
  bestTime?: number;
  completedCount: number;
  successRate: number;
  lastCompletedAt: string;
}

interface UserStats {
  totalPoints: number;
  totalCompletions: number;
  totalPuzzlesSolved: number;
  averageSuccessRate: number;
  fastestCompletionTime: number;
}

type SortBy = 'points' | 'time' | 'completions';

export default function PuzzleLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('points');
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // TODO: Get from authentication

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/puzzle-leaderboards/global?sortBy=${sortBy}&limit=10`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async () => {
      try {
        const res = await fetch(`/api/puzzle-leaderboards/user/${userId}/stats`);
        if (res.ok) {
          const data = await res.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchLeaderboard();
    fetchUserStats();
  }, [sortBy, userId]);

  const formatTime = (seconds?: number) => {
    if (!seconds) return '—';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className={styles.container}>
      {/* User Stats Card */}
      {userStats && (
        <div className={styles.userStatsCard}>
          <h3>📊 Your Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Points</span>
              <span className={styles.statValue}>{userStats.totalPoints}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Puzzles Solved</span>
              <span className={styles.statValue}>{userStats.totalPuzzlesSolved}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Success Rate</span>
              <span className={styles.statValue}>{userStats.averageSuccessRate.toFixed(1)}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Best Time</span>
              <span className={styles.statValue}>{formatTime(userStats.fastestCompletionTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className={styles.leaderboardSection}>
        <div className={styles.header}>
          <h2>🏆 Leaderboard</h2>
          <div className={styles.sortButtons}>
            <button
              className={`${styles.sortBtn} ${sortBy === 'points' ? styles.active : ''}`}
              onClick={() => setSortBy('points')}
            >
              ⭐ Points
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'time' ? styles.active : ''}`}
              onClick={() => setSortBy('time')}
            >
              ⏱️ Speed
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'completions' ? styles.active : ''}`}
              onClick={() => setSortBy('completions')}
            >
              ✅ Completions
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className={styles.empty}>No players yet</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <div className={styles.rankCol}>Rank</div>
              <div className={styles.nameCol}>Player</div>
              <div className={styles.pointsCol}>Points</div>
              <div className={styles.timeCol}>Best Time</div>
              <div className={styles.completedCol}>Completed</div>
              <div className={styles.rateCol}>Success</div>
            </div>

            <div className={styles.tableBody}>
              {leaderboard.map((entry) => (
                <div
                  key={`${entry.user.id}-${entry.rank}`}
                  className={`${styles.tableRow} ${
                    entry.user.id === userId ? styles.currentUser : ''
                  }`}
                >
                  <div className={styles.rankCol}>
                    {entry.rank <= 3 ? (
                      <span className={styles.medal}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </div>
                  <div className={styles.nameCol}>
                    <span className={styles.playerName}>{entry.user.name || 'Anonymous'}</span>
                  </div>
                  <div className={styles.pointsCol}>{entry.pointsEarned}</div>
                  <div className={styles.timeCol}>{formatTime(entry.bestTime)}</div>
                  <div className={styles.completedCol}>{entry.completedCount}</div>
                  <div className={styles.rateCol}>{entry.successRate.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
