import React, { useState, useEffect } from 'react';
import { useLogs } from '../context/LogContext';
import { Link } from 'react-router-dom';

export default function SystemLogs() {
  const {
    logs,
    stats,
    loading,
    filters,
    pagination,
    fetchLogs,
    clearLogs,
    updateFilters,
    setFilters
  } = useLogs();

  const [selectedLog, setSelectedLog] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const getLevelColor = (level) => {
    switch(level) {
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLevelIcon = (level) => {
    switch(level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '🟢';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchLogs(1);
  };

  const handleClearFilters = () => {
    setFilters({
      level: '',
      category: '',
      search: '',
      startDate: '',
      endDate: ''
    });
    fetchLogs(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0A1628] pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">System Logs</h1>
            <p className="text-[#B0C4DE] text-sm">Monitor system activity and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="text-[#B0C4DE] hover:text-[#00D4FF] transition-colors text-sm"
            >
              ← Back to Admin
            </Link>
            <button
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              Clear All Logs
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-[#1A2D4A]">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-[#B0C4DE]">Total Logs</div>
          </div>
          <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
            <div className="text-xs text-[#B0C4DE]">Errors</div>
          </div>
          <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{stats.warnings}</div>
            <div className="text-xs text-[#B0C4DE]">Warnings</div>
          </div>
          <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{stats.success}</div>
            <div className="text-xs text-[#B0C4DE]">Success</div>
          </div>
          <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{stats.info}</div>
            <div className="text-xs text-[#B0C4DE]">Info</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl p-4 border border-[#1A2D4A] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-[#B0C4DE] block mb-1">Level</label>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="w-full bg-[#0A1628] text-white rounded-lg px-3 py-2 border border-[#1A2D4A] focus:outline-none focus:border-[#00D4FF] text-sm"
              >
                <option value="">All Levels</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#B0C4DE] block mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full bg-[#0A1628] text-white rounded-lg px-3 py-2 border border-[#1A2D4A] focus:outline-none focus:border-[#00D4FF] text-sm"
              >
                <option value="">All Categories</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="user">User</option>
                <option value="network">Network</option>
                <option value="database">Database</option>
                <option value="auth">Auth</option>
                <option value="payment">Payment</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#B0C4DE] block mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search logs..."
                className="w-full bg-[#0A1628] text-white rounded-lg px-3 py-2 border border-[#1A2D4A] focus:outline-none focus:border-[#00D4FF] text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#B0C4DE] block mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full bg-[#0A1628] text-white rounded-lg px-3 py-2 border border-[#1A2D4A] focus:outline-none focus:border-[#00D4FF] text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#B0C4DE] block mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full bg-[#0A1628] text-white rounded-lg px-3 py-2 border border-[#1A2D4A] focus:outline-none focus:border-[#00D4FF] text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg hover:bg-[#00D4FF]/30 transition-colors text-sm font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg hover:bg-[#2A3D5A] transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#1A2D4A]/30 backdrop-blur-sm rounded-xl border border-[#1A2D4A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A1628]/50">
                <tr>
                  <th className="text-left text-xs text-[#B0C4DE] font-medium px-4 py-3">Level</th>
                  <th className="text-left text-xs text-[#B0C4DE] font-medium px-4 py-3">Timestamp</th>
                  <th className="text-left text-xs text-[#B0C4DE] font-medium px-4 py-3">Message</th>
                  <th className="text-left text-xs text-[#B0C4DE] font-medium px-4 py-3">Source</th>
                  <th className="text-left text-xs text-[#B0C4DE] font-medium px-4 py-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center text-[#B0C4DE] py-8">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-[#B0C4DE] py-8">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-t border-[#1A2D4A] hover:bg-[#1A2D4A]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          <span>{getLevelIcon(log.level)}</span>
                          <span className="capitalize">{log.level}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#B0C4DE]">{formatDate(log.timestamp)}</td>
                      <td className="px-4 py-3 text-sm text-white">{log.message}</td>
                      <td className="px-4 py-3 text-sm text-[#B0C4DE]">{log.source}</td>
                      <td className="px-4 py-3 text-sm text-[#B0C4DE] capitalize">{log.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-[#1A2D4A]">
              <div className="text-sm text-[#B0C4DE]">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-[#0A1628] text-[#B0C4DE] rounded-lg hover:bg-[#1A2D4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-[#0A1628] text-[#B0C4DE] rounded-lg hover:bg-[#1A2D4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1628] border border-[#1A2D4A] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[#B0C4DE] hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#B0C4DE] block">Level</label>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedLog.level)}`}>
                  <span>{getLevelIcon(selectedLog.level)}</span>
                  <span className="capitalize">{selectedLog.level}</span>
                </span>
              </div>
              <div>
                <label className="text-xs text-[#B0C4DE] block">Timestamp</label>
                <div className="text-sm text-white">{formatDate(selectedLog.timestamp)}</div>
              </div>
              <div>
                <label className="text-xs text-[#B0C4DE] block">Message</label>
                <div className="text-sm text-white">{selectedLog.message}</div>
              </div>
              <div>
                <label className="text-xs text-[#B0C4DE] block">Source</label>
                <div className="text-sm text-white">{selectedLog.source}</div>
              </div>
              <div>
                <label className="text-xs text-[#B0C4DE] block">Category</label>
                <div className="text-sm text-white capitalize">{selectedLog.category}</div>
              </div>
              {selectedLog.ip && (
                <div>
                  <label className="text-xs text-[#B0C4DE] block">IP Address</label>
                  <div className="text-sm text-white">{selectedLog.ip}</div>
                </div>
              )}
              {selectedLog.userId && (
                <div>
                  <label className="text-xs text-[#B0C4DE] block">User</label>
                  <div className="text-sm text-white">
                    {selectedLog.userId?.name || selectedLog.userId?.email || selectedLog.userId}
                  </div>
                </div>
              )}
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <label className="text-xs text-[#B0C4DE] block">Additional Details</label>
                  <pre className="bg-[#1A2D4A] p-3 rounded-lg text-xs text-[#B0C4DE] overflow-x-auto mt-1">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1628] border border-[#1A2D4A] rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Clear All Logs?</h2>
            <p className="text-[#B0C4DE] mb-6">
              This action will permanently delete all logs. This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg hover:bg-[#2A3D5A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearLogs();
                  setShowClearModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}