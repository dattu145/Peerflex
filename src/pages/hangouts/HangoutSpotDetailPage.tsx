// src/pages/hangouts/HangoutSpotDetailPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Edit3, MoreVertical } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Users, Star, Wifi, Coffee, Book, Utensils, Heart,
  Clock, Phone, Mail, Globe, ArrowLeft, CheckCircle, XCircle
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { hangoutService } from '../../services/hangoutService';
import { useHangouts } from '../../hooks/useHangouts';
import { useAuthStore } from '../../store/useAuthStore';
import type { HangoutSpot } from '../../types';
import HangoutSpotsMap from '../../components/map/HangoutSpotsMap';

const HangoutSpotDetailPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { currentCheckin, checkIn, checkOut } = useHangouts({ filters: {} });

  const [spot, setSpot] = useState<HangoutSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.id === spot?.created_by;

  const getSpotIcon = (spotType: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      cafe: {
        icon: <Coffee className="h-6 w-6" />,
        color: 'from-orange-500 to-yellow-500',
        label: 'Cafe'
      },
      library: {
        icon: <Book className="h-6 w-6" />,
        color: 'from-blue-500 to-cyan-500',
        label: 'Library'
      },
      park: {
        icon: <Heart className="h-6 w-6" />,
        color: 'from-green-500 to-emerald-500',
        label: 'Park'
      },
      study_room: {
        icon: <Book className="h-6 w-6" />,
        color: 'from-purple-500 to-indigo-500',
        label: 'Study Room'
      },
      food: {
        icon: <Utensils className="h-6 w-6" />,
        color: 'from-red-500 to-pink-500',
        label: 'Food Court'
      },
      social: {
        icon: <Users className="h-6 w-6" />,
        color: 'from-pink-500 to-rose-500',
        label: 'Social Space'
      },
      sports: {
        icon: <Heart className="h-6 w-6" />,
        color: 'from-red-500 to-orange-500',
        label: 'Sports Area'
      },
      other: {
        icon: <MapPin className="h-6 w-6" />,
        color: 'from-gray-500 to-gray-600',
        label: 'Other'
      }
    };
    return icons[spotType] || icons.other;
  };

  const getCapacityColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (percentage >= 70) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-500 bg-green-50 dark:bg-green-900/20';
  };

  const getCapacityText = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'Very Busy';
    if (percentage >= 70) return 'Busy';
    if (percentage >= 40) return 'Moderate';
    return 'Quiet';
  };

  const handleDelete = async () => {
    if (!spot) return;

    setDeleting(true);
    try {
      await hangoutService.deleteHangoutSpot(spot.id);
      navigate('/hangouts');
    } catch (error) {
      console.error('Failed to delete spot:', error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    };
  };

  const handleEdit = () => {
    navigate(`/hangouts/edit/${spot?.id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSpot = async () => {
      if (!spotId) return;

      try {
        setLoading(true);
        const spotData = await hangoutService.getHangoutSpot(spotId);
        setSpot(spotData);
      } catch (err: any) {
        setError(err.message || 'Failed to load hangout spot');
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [spotId]);

  const handleCheckIn = async () => {
    if (!spot) return;

    try {
      await checkIn(spot.id);
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  const isCheckedIn = currentCheckin?.hangout_spot_id === spot?.id;
  const isFull = spot ? spot.current_occupancy >= spot.capacity : false;
  const canCheckIn = !isFull && !isCheckedIn && isAuthenticated;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading spot details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !spot) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Spot not found'}
            </h2>
            <Button onClick={() => navigate('/hangouts')}>
              Back to Hangout Spots
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const spotIcon = getSpotIcon(spot.spot_type);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <button
              onClick={() => navigate('/hangouts')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Hangout Spots</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${spotIcon.color} text-white`}>
                    {spotIcon.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                          {spot.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 capitalize">
                          {spotIcon.label}
                        </p>
                      </div>
                      {spot.is_verified && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Verified
                        </span>
                      )}
                      {isOwner && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                          Your Spot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Owner Menu */}
                  {isOwner && (
                    <div className="relative" ref={menuRef}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => setShowMenu(!showMenu)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>

                      {showMenu && (
                        <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
                          <button
                            onClick={handleEdit}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Edit3 className="h-4 w-4 flex-shrink-0" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4 flex-shrink-0" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  {spot.description}
                </p>
              </div>

              {/* Check-in Button */}
              {isAuthenticated && (
                <div className="flex-shrink-0">
                  {isCheckedIn ? (
                    <Button
                      variant="outline"
                      onClick={handleCheckOut}
                      className="border-green-200 text-green-700"
                    >
                      Checked In ✓
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleCheckIn}
                      disabled={!canCheckIn}
                      className="min-w-[120px]"
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
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Capacity & Rating */}
              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Current Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Occupancy:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCapacityColor(spot.current_occupancy, spot.capacity)}`}>
                          {getCapacityText(spot.current_occupancy, spot.capacity)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">People:</span>
                        <span className="font-semibold">
                          {spot.current_occupancy} / {spot.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getCapacityColor(spot.current_occupancy, spot.capacity).replace('text-', 'bg-').replace('bg-red-500', 'bg-red-500').replace('bg-yellow-500', 'bg-yellow-500').replace('bg-green-500', 'bg-green-500')
                            }`}
                          style={{
                            width: `${Math.min((spot.current_occupancy / spot.capacity) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Rating & Reviews
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {spot.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Based on {spot.review_count} reviews
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Amenities */}
              {spot.amenities && spot.amenities.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {spot.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <Wifi className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Operating Hours */}
              {spot.operating_hours && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Operating Hours
                  </h3>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {spot.operating_hours.open} - {spot.operating_hours.close}
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Open daily
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Contact Information */}
              {spot.contact_info && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {spot.contact_info.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {spot.contact_info.phone}
                        </span>
                      </div>
                    )}
                    {spot.contact_info.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {spot.contact_info.email}
                        </span>
                      </div>
                    )}
                    {spot.contact_info.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <a
                          href={spot.contact_info.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {spot.contact_info.website}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Map & Address */}
            <div className="space-y-6">
              {/* Location Map */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  <HangoutSpotsMap
                    spots={[spot]}
                    currentLocation={undefined}
                    onSpotClick={() => { }}
                    className="h-64"
                    singleSpotMode
                  />
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {spot.address}
                  </span>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {!isAuthenticated ? (
                    <Link to="/login" className="w-full">
                      <Button variant="primary" className="w-full">
                        Sign In to Check In
                      </Button>
                    </Link>
                  ) : isCheckedIn ? (
                    <Button
                      variant="outline"
                      onClick={handleCheckOut}
                      className="w-full border-green-200 text-green-700"
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleCheckIn}
                      disabled={!canCheckIn}
                      className="w-full"
                    >
                      {isFull ? 'Spot is Full' : 'Check In'}
                    </Button>
                  )}

                  <Button variant="outline" className="w-full">
                    Share Location
                  </Button>

                  <Button variant="outline" className="w-full">
                    Write a Review
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Hangout Spot"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to permanently delete this hangout spot? This action cannot be undone and all data will be lost.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleting}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default HangoutSpotDetailPage;