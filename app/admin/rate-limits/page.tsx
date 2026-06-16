'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Trash2, Plus, X, RefreshCw } from 'lucide-react';
import styles from './RateLimitAdmin.module.css';

interface RateLimitStats {
  config: {
    maxRequests: number;
    windowMs: number;
    windowLabel: string;
  };
  statistics: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIps: number;
    blockRate: string;
  };
  topIps: Array<{
    ip: string;
    requests: number;
    blocked: number;
  }>;
  whitelist: Array<{
    ipAddress: string;
    reason?: string;
    addedBy?: string;
    addedAt: number;
  }>;
  blacklist: Array<{
    ipAddress: string;
    reason?: string;
    addedBy?: string;
    addedAt: number;
    expiresAt?: number;
  }>;
  logsCount: number;
}

export default function RateLimitAdminPage() {
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Config update state
  const [maxRequests, setMaxRequests] = useState('100');
  const [windowMs, setWindowMs] = useState('3600000');

  // IP list state
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');
  const [listType, setListType] = useState<'whitelist' | 'blacklist'>('whitelist');

  // Fetch stats
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/rate-limits/stats');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
      setMaxRequests(data.config.maxRequests.toString());
      setWindowMs(data.config.windowMs.toString());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/rate-limits/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxRequests: parseInt(maxRequests, 10),
          windowMs: parseInt(windowMs, 10),
        }),
      });
      if (!response.ok) throw new Error('Failed to update config');
      setMessage('Configuration updated successfully');
      setTimeout(() => setMessage(null), 3000);
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp) return;

    try {
      const endpoint = `/api/admin/rate-limits/${listType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAddress: newIp,
          reason: newReason,
          addedBy: 'admin',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add IP');
      }

      setMessage(`IP added to ${listType} successfully`);
      setNewIp('');
      setNewReason('');
      setTimeout(() => setMessage(null), 3000);
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRemoveIp = async (ip: string, type: 'whitelist' | 'blacklist') => {
    try {
      const response = await fetch(`/api/admin/rate-limits/${type}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress: ip }),
      });

      if (!response.ok) throw new Error('Failed to remove IP');
      setMessage(`IP removed from ${type}`);
      setTimeout(() => setMessage(null), 3000);
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleResetIp = async (ip: string) => {
    try {
      const response = await fetch('/api/admin/rate-limits/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress: ip }),
      });

      if (!response.ok) throw new Error('Failed to reset IP');
      setMessage(`IP ${ip} reset successfully`);
      setTimeout(() => setMessage(null), 3000);
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/rate-limits/logs', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear logs');
      setMessage('Logs cleared successfully');
      setTimeout(() => setMessage(null), 3000);
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load rate limit settings</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Rate Limit Management</h1>
        <p>Configure and monitor TTS API rate limiting</p>
      </div>

      {error && (
        <div className={styles.alert} style={{ borderColor: '#fca5a5', backgroundColor: '#fee2e2' }}>
          <AlertCircle size={20} style={{ color: '#dc2626' }} />
          <span style={{ color: '#dc2626' }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ color: '#dc2626', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {message && (
        <div className={styles.alert} style={{ borderColor: '#86efac', backgroundColor: '#dcfce7' }}>
          <span style={{ color: '#16a34a' }}>{message}</span>
          <button
            onClick={() => setMessage(null)}
            style={{ color: '#16a34a', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className={styles.card}>
        <h2>Statistics (Last 24 Hours)</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Total Requests</div>
            <div className={styles.statValue}>{stats.statistics.totalRequests}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Blocked Requests</div>
            <div className={styles.statValue} style={{ color: '#dc2626' }}>
              {stats.statistics.blockedRequests}
            </div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Block Rate</div>
            <div className={styles.statValue}>{stats.statistics.blockRate}%</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Unique IPs</div>
            <div className={styles.statValue}>{stats.statistics.uniqueIps}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Logs Stored</div>
            <div className={styles.statValue}>{stats.logsCount}</div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className={styles.card}>
        <h2>Configuration</h2>
        <form onSubmit={handleUpdateConfig} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Max Requests Per Window</label>
            <input
              type="number"
              value={maxRequests}
              onChange={(e) => setMaxRequests(e.target.value)}
              min="1"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Time Window (milliseconds)</label>
            <div className={styles.windowInfo}>
              <select
                value={windowMs}
                onChange={(e) => setWindowMs(e.target.value)}
                className={styles.select}
              >
                <option value="60000">1 Minute</option>
                <option value="3600000">1 Hour</option>
                <option value="86400000">24 Hours</option>
              </select>
              <span className={styles.hint}>
                Current: {stats.config.windowLabel}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Configuration
          </button>
        </form>
      </div>

      {/* Top IPs */}
      <div className={styles.card}>
        <h2>Top IPs by Request Count</h2>
        {stats.topIps.length > 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCol}>IP Address</div>
              <div className={styles.tableCol}>Total Requests</div>
              <div className={styles.tableCol}>Blocked</div>
              <div className={styles.tableCol}>Actions</div>
            </div>
            {stats.topIps.map((item) => (
              <div key={item.ip} className={styles.tableRow}>
                <div className={styles.tableCol}>{item.ip}</div>
                <div className={styles.tableCol}>{item.requests}</div>
                <div className={styles.tableCol} style={{ color: item.blocked > 0 ? '#dc2626' : '#16a34a' }}>
                  {item.blocked}
                </div>
                <div className={styles.tableCol}>
                  <button
                    onClick={() => handleResetIp(item.ip)}
                    className={styles.actionButton}
                    title="Reset this IP's rate limit"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>No requests yet</p>
        )}
      </div>

      {/* IP Management */}
      <div className={styles.card}>
        <h2>IP Management</h2>

        <div className={styles.tabContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${listType === 'whitelist' ? styles.activeTab : ''}`}
              onClick={() => setListType('whitelist')}
            >
              Whitelist ({stats.whitelist.length})
            </button>
            <button
              className={`${styles.tab} ${listType === 'blacklist' ? styles.activeTab : ''}`}
              onClick={() => setListType('blacklist')}
            >
              Blacklist ({stats.blacklist.length})
            </button>
          </div>

          {/* Add IP Form */}
          <form onSubmit={handleAddIp} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="IP Address (e.g., 192.168.1.1)"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className={styles.input}
                />
              </div>
              <button type="submit" className={styles.addButton}>
                <Plus size={16} />
                Add to {listType === 'whitelist' ? 'Whitelist' : 'Blacklist'}
              </button>
            </div>
          </form>

          {/* IP List */}
          <div className={styles.ipList}>
            {listType === 'whitelist' ? (
              stats.whitelist.length > 0 ? (
                stats.whitelist.map((entry) => (
                  <div key={entry.ipAddress} className={styles.ipItem}>
                    <div>
                      <div className={styles.ipAddress}>{entry.ipAddress}</div>
                      {entry.reason && <div className={styles.ipReason}>{entry.reason}</div>}
                    </div>
                    <button
                      onClick={() => handleRemoveIp(entry.ipAddress, 'whitelist')}
                      className={styles.deleteButton}
                      title="Remove from whitelist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyMessage}>No IPs in whitelist</p>
              )
            ) : stats.blacklist.length > 0 ? (
              stats.blacklist.map((entry) => (
                <div key={entry.ipAddress} className={styles.ipItem}>
                  <div>
                    <div className={styles.ipAddress}>{entry.ipAddress}</div>
                    {entry.reason && <div className={styles.ipReason}>{entry.reason}</div>}
                  </div>
                  <button
                    onClick={() => handleRemoveIp(entry.ipAddress, 'blacklist')}
                    className={styles.deleteButton}
                    title="Remove from blacklist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>No IPs in blacklist</p>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className={styles.card}>
        <h2>Maintenance</h2>
        <button onClick={handleClearLogs} className={styles.dangerButton}>
          <Trash2 size={16} />
          Clear All Logs
        </button>
        <p className={styles.hint} style={{ marginTop: '0.75rem' }}>
          This will remove all stored rate limit logs but keep whitelist/blacklist data
        </p>
      </div>
    </div>
  );
}
