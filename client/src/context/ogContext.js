import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const LogContext = createContext();

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};

export function LogProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState('online');
  const [stats, setStats] = useState({
    total: 0,
    errors: 0,
    warnings: 0,
    success: 0,
    info: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1
  });

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await api.get('/logs/status');
      if (response.data.success) {
        setSystemStatus(response.data.data.status);
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  // Fetch logs
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page,
        limit: 50
      });
      
      const response = await api.get(`/logs?${params.toString()}`);
      if (response.data.success) {
        setLogs(response.data.data.logs);
        setPagination({
          page: response.data.data.page,
          total: response.data.data.total,
          totalPages: response.data.data.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/logs/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Create log entry
  const createLog = async (logData) => {
    try {
      const response = await api.post('/logs', logData);
      return response.data;
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  // Clear logs
  const clearLogs = async () => {
    try {
      const response = await api.delete('/logs/clear');
      if (response.data.success) {
        await fetchLogs();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  // Update filters and refetch
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    fetchLogs(1);
  };

  // Initial fetch
  useEffect(() => {
    fetchLogs();
    fetchStats();
    fetchSystemStatus();
    
    // Poll for status updates every 30 seconds
    const statusInterval = setInterval(fetchSystemStatus, 30000);
    
    return () => clearInterval(statusInterval);
  }, []);

  const value = {
    logs,
    systemStatus,
    stats,
    loading,
    filters,
    pagination,
    fetchLogs,
    fetchStats,
    createLog,
    clearLogs,
    updateFilters,
    setFilters,
    fetchSystemStatus
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
}