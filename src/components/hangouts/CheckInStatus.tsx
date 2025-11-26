// src/components/hangouts/CheckInStatus.tsx
import React from 'react';
import { MapPin, Clock, Users, LogOut } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { HangoutCheckin } from '../../types';

interface CheckInStatusProps {
  checkin: HangoutCheckin;
  onCheckOut: () => void;
  onViewSpot?: () => void;
}

export const CheckInStatus: React.FC<CheckInStatusProps> = ({
  checkin,
  onCheckOut,
  onViewSpot
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Checked In
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              at {checkin.hangout_spot?.name}
            </p>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Since {formatTime(checkin.checkin_time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>
                  {checkin.hangout_spot?.current_occupancy} people here
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewSpot}
          >
            View Spot
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCheckOut}
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Check Out
          </Button>
        </div>
      </div>

      {/* Duration Counter */}
      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatDuration(checkin.checkin_time)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Time spent here
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CheckInStatus;