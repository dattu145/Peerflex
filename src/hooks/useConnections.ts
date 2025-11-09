import { useState, useEffect } from 'react';
import { connectionService } from '../services/connectionService';
import type { ConnectionRequest, UserConnection } from '../types';

export const useConnections = () => {
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conns, requests] = await Promise.all([
        connectionService.getConnections(),
        connectionService.getPendingRequests()
      ]);
      setConnections(conns);
      setPendingRequests(requests);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (toUserId: string, message?: string) => {
    try {
      await connectionService.sendRequest(toUserId, message);
      await loadData(); // Reload data to reflect new request
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
      return false;
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await connectionService.acceptRequest(requestId);
      await loadData(); // Reload data to reflect acceptance
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request');
      return false;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await connectionService.rejectRequest(requestId);
      await loadData(); // Reload data to reflect rejection
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
      return false;
    }
  };

  const removeConnection = async (connectedUserId: string) => {
    try {
      await connectionService.removeConnection(connectedUserId);
      await loadData(); // Reload data to reflect removal
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove connection');
      return false;
    }
  };

  const getConnectionStatus = async (otherUserId: string) => {
    try {
      return await connectionService.getConnectionStatus(otherUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get connection status');
      return { isConnected: false, hasPendingRequest: false };
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    connections,
    pendingRequests,
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeConnection,
    getConnectionStatus,
    refresh: loadData
  };
};