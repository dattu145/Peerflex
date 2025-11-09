import React, { useState, useEffect } from 'react';
import { useConnections } from '../../hooks/useConnections';
import Button from '../../components/ui/Button';
import { UserPlus, Check, Clock, X } from 'lucide-react';

interface ConnectionRequestButtonProps {
  targetUserId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const ConnectionRequestButton: React.FC<ConnectionRequestButtonProps> = ({
  targetUserId,
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const [localStatus, setLocalStatus] = useState<{
    isConnected: boolean;
    hasPendingRequest: boolean;
    requestFromMe?: boolean;
    requestId?: string;
  }>({ isConnected: false, hasPendingRequest: false });
  
  const [isLoading, setIsLoading] = useState(false);
  const { sendRequest, acceptRequest, rejectRequest, getConnectionStatus } = useConnections();

  useEffect(() => {
    loadConnectionStatus();
  }, [targetUserId]);

  const loadConnectionStatus = async () => {
    const status = await getConnectionStatus(targetUserId);
    setLocalStatus(status);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    const success = await sendRequest(targetUserId);
    if (success) {
      await loadConnectionStatus();
    }
    setIsLoading(false);
  };

  const handleAcceptRequest = async () => {
    if (!localStatus.requestId) return;
    
    setIsLoading(true);
    const success = await acceptRequest(localStatus.requestId);
    if (success) {
      await loadConnectionStatus();
    }
    setIsLoading(false);
  };

  const handleRejectRequest = async () => {
    if (!localStatus.requestId) return;
    
    setIsLoading(true);
    const success = await rejectRequest(localStatus.requestId);
    if (success) {
      await loadConnectionStatus();
    }
    setIsLoading(false);
  };

  if (localStatus.isConnected) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={className}
      >
        <Check className="h-4 w-4 mr-2" />
        Connected
      </Button>
    );
  }

  if (localStatus.hasPendingRequest) {
    if (localStatus.requestFromMe) {
      return (
        <Button
          variant="secondary"
          size={size}
          disabled
          className={className}
        >
          <Clock className="h-4 w-4 mr-2" />
          Request Sent
        </Button>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size={size}
            onClick={handleAcceptRequest}
            disabled={isLoading}
            className={className}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button
            variant="ghost"
            size={size}
            onClick={handleRejectRequest}
            disabled={isLoading}
            className={className}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSendRequest}
      disabled={isLoading}
      className={className}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {isLoading ? 'Sending...' : 'Connect'}
    </Button>
  );
};