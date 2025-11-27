// src/components/hangouts/HangoutSpotCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Wifi, Coffee, Book, Utensils, Heart, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { HangoutSpot } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface HangoutSpotCardProps {
  spot: HangoutSpot;
  onCheckIn?: (spotId: string) => void;
  onEdit?: (spot: HangoutSpot) => void;
  onDelete?: (spotId: string) => void;
  showActions?: boolean;
  isCheckedIn?: boolean;
  currentCheckin?: any;
}

export const HangoutSpotCard: React.FC<HangoutSpotCardProps> = ({
  spot,
  onCheckIn,
  onEdit,
  onDelete,
  showActions = true,
  isCheckedIn = false,
  currentCheckin
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getSpotIcon = (spotType: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string }> = {
      cafe: { icon: <Coffee className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-orange-500 to-yellow-500' },
      library: { icon: <Book className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-blue-500 to-cyan-500' },
      park: { icon: <Heart className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-green-500 to-emerald-500' },
      study_room: { icon: <Book className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-purple-500 to-indigo-500' },
      food: { icon: <Utensils className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-red-500 to-pink-500' },
      social: { icon: <Users className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-pink-500 to-rose-500' },
      sports: { icon: <Heart className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-red-500 to-orange-500' },
      other: { icon: <MapPin className="h-3 w-3 xs:h-4 xs:w-4" />, color: 'from-gray-500 to-gray-600' }
    };
    return icons[spotType] || icons.other;
  };

  const getCapacityColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getCapacityText = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'Very Busy';
    if (percentage >= 70) return 'Busy';
    if (percentage >= 40) return 'Moderate';
    return 'Quiet';
  };

  const spotIcon = getSpotIcon(spot.spot_type);
  const isFull = spot.current_occupancy >= spot.capacity;
  const canCheckIn = !isFull && !isCheckedIn;
  const isOwner = user?.id === spot.created_by;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(spot);
    } else {
      navigate(`/hangouts/edit/${spot.id}`);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(spot.id);
      setShowMenu(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 group flex flex-col min-h-[320px] xs:min-h-[340px]">
        {/* Spot Type Header */}
        <div className={`h-1.5 xs:h-2 bg-gradient-to-r ${spotIcon.color}`} />

        <div className="p-3 xs:p-4 sm:p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-2 xs:mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                <div className="p-1.5 xs:p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex-shrink-0">
                  {spotIcon.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                    {spot.name}
                  </h3>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 xs:gap-2 mb-2 xs:mb-3">
                {spot.is_verified && (
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium flex-shrink-0">
                    Verified
                  </span>
                )}
                {isOwner && (
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium flex-shrink-0">
                    Your Spot
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 mb-2 xs:mb-3 overflow-hidden break-words"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                {spot.description}
              </p>
            </div>

            {/* Three dots menu for owner */}
            {showActions && isOwner && (
              <div className="relative flex-shrink-0 ml-1 xs:ml-2" ref={menuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreVertical className="h-3 w-3 xs:h-4 xs:w-4" />
                </Button>

                {showMenu && (
                  <div className="absolute right-0 top-6 xs:top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-28 xs:min-w-32">
                    <button
                      onClick={handleEdit}
                      className="w-full px-2 xs:px-3 py-1 xs:py-2 text-left text-xs xs:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-2"
                    >
                      <Edit3 className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-2 xs:px-3 py-1 xs:py-2 text-left text-xs xs:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-2"
                    >
                      <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spot Details */}
          <div className="space-y-1.5 xs:space-y-2 mb-2 xs:mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
              <span className="text-xs xs:text-sm truncate">{spot.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600 dark:text-gray-300">
                <Users className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                <span className="text-xs xs:text-sm">
                  {getCapacityText(spot.current_occupancy, spot.capacity)}
                </span>
              </div>
              <span className={`text-xs xs:text-sm font-medium ${getCapacityColor(spot.current_occupancy, spot.capacity)}`}>
                {spot.current_occupancy} / {spot.capacity}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600 dark:text-gray-300">
                <Star className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                <span className="text-xs xs:text-sm">Rating</span>
              </div>
              <span className="text-xs xs:text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {spot.rating.toFixed(1)} ⭐ ({spot.review_count})
              </span>
            </div>
          </div>

          {/* Amenities */}
          {spot.amenities && spot.amenities.length > 0 && (
            <div className="mb-2 xs:mb-3 sm:mb-4">
              <div className="flex flex-wrap gap-1">
                {spot.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs truncate max-w-[80px] xs:max-w-none"
                  >
                    {amenity}
                  </span>
                ))}
                {spot.amenities.length > 3 && (
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                    +{spot.amenities.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="mb-3 xs:mb-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Occupancy</span>
              <span>{Math.round((spot.current_occupancy / spot.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 xs:h-2">
              <div
                className={`h-1.5 xs:h-2 rounded-full transition-all duration-300 ${getCapacityColor(spot.current_occupancy, spot.capacity).replace('text-', 'bg-')}`}
                style={{
                  width: `${Math.min((spot.current_occupancy / spot.capacity) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-2 xs:pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 truncate">
                {spot.spot_type.replace('_', ' ').toUpperCase()}
              </div>

              <div className="flex gap-1 xs:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/hangouts/${spot.id}`)}
                  className="text-xs px-2 xs:px-3"
                >
                  Details
                </Button>

                {isCheckedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 text-xs px-2 xs:px-3"
                  >
                    Checked In ✓
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onCheckIn?.(spot.id)}
                    disabled={!canCheckIn}
                    className="text-xs px-2 xs:px-3"
                    title={
                      isFull ? 'This spot is full' :
                        isCheckedIn ? 'Already checked in' :
                          'Check in to this spot'
                    }
                  >
                    {isFull ? 'Full' : 'Check In'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default HangoutSpotCard;