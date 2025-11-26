// src/pages/hangouts/HangoutSpotsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { MapPin, Users, Plus, Filter, Map, List, Search, Coffee, AlertCircle, Book, Heart, LogIn, User, Building2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import HangoutSpotCard from '../../components/hangouts/HangoutSpotCard';
import HangoutSpotsMap from '../../components/map/HangoutSpotsMap';
import CheckInStatus from '../../components/hangouts/CheckInStatus';
import { useHangouts } from '../../hooks/useHangouts';
import { useLocation as useGeoLocation } from '../../hooks/useLocation';
import { useAuthStore } from '../../store/useAuthStore';
import { hangoutService } from '../../services/hangoutService';
import type { HangoutSpot } from '../../types';
import { motion } from 'framer-motion';
import Modal from '../../components/ui/Modal';

const HangoutSpotsPage: React.FC = () => {
  const [spotTypeFilter, setSpotTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSpot, setSelectedSpot] = useState<HangoutSpot | null>(null);
  const [spotView, setSpotView] = useState<'all' | 'my'>('all'); // 'all' or 'my'
  const [mySpots, setMySpots] = useState<HangoutSpot[]>([]);
  const [loadingMySpots, setLoadingMySpots] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState({
    spotType: 'all',
    search: '',
    nearLocation: undefined as { lat: number; lng: number; radius: number } | undefined,
    hasCapacity: true
  });

  const { spots, currentCheckin, loading, error, checkIn, checkOut, refetch } = useHangouts({ filters });
  const { location, requestLocation, loading: locationLoading, error: locationError } = useGeoLocation({
    autoRequest: true,
    enableHighAccuracy: true
  });

  const { isAuthenticated, user } = useAuthStore();
  const locationState = useLocation();
  const navigate = useNavigate();

  // Show success message if redirected from create page
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (locationState.state?.message && locationState.state?.type === 'success') {
      setShowSuccessMessage(true);
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [locationState]);

  useEffect(() => {
    if (isAuthenticated && !location && !locationLoading && !locationError) {
      requestLocation().catch(() => {
        // Silent fail for auto-request
      });
    }
  }, [isAuthenticated, location, locationLoading, locationError, requestLocation]);

  // Load user's spots when view changes to 'my'
  useEffect(() => {
    if (isAuthenticated && spotView === 'my') {
      loadMySpots();
    }
  }, [isAuthenticated, spotView]);

  const loadMySpots = async () => {
    if (!isAuthenticated) return;
    
    setLoadingMySpots(true);
    try {
      const userSpots = await hangoutService.getMyHangoutSpots();
      setMySpots(userSpots);
    } catch (error) {
      console.error('Failed to load user spots:', error);
    } finally {
      setLoadingMySpots(false);
    }
  };

  const spotTypes = [
    { value: 'all', label: 'All Spots', icon: <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'cafe', label: 'Cafes', icon: <Coffee className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'library', label: 'Libraries', icon: <Book className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'study_room', label: 'Study Rooms', icon: <Book className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'park', label: 'Parks', icon: <Heart className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'food', label: 'Food Courts', icon: <Users className="h-3 w-3 sm:h-4 sm:w-4" /> },
    { value: 'social', label: 'Social Spaces', icon: <Users className="h-3 w-3 sm:h-4 sm:w-4" /> }
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        spotType: spotTypeFilter,
        search: searchQuery,
        nearLocation: location ? { lat: location.latitude, lng: location.longitude, radius: 5 } : undefined
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [spotTypeFilter, searchQuery, location]);

  const handleCheckIn = async (spotId: string) => {
    try {
      await checkIn(spotId);
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

  const handleUseMyLocation = async () => {
    try {
      await requestLocation();
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleSpotClick = (spot: HangoutSpot) => {
    setSelectedSpot(spot);
  };

  const handleEditSpot = (spot: HangoutSpot) => {
    navigate(`/hangouts/edit/${spot.id}`);
  };

  const handleDeleteSpot = (spotId: string) => {
    setSpotToDelete(spotId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!spotToDelete) return;

    setDeleting(true);
    try {
      await hangoutService.deleteHangoutSpot(spotToDelete);
      await refetch();
      if (spotView === 'my') {
        await loadMySpots();
      }
      setShowDeleteModal(false);
      setSpotToDelete(null);
    } catch (error) {
      console.error('Failed to delete spot:', error);
    } finally {
      setDeleting(false);
    }
  };

  const displayedSpots = spotView === 'my' ? mySpots : spots;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <MapPin className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Hangout Spots
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
              Discover great places to study, socialize, and connect with peers
            </p>
          </motion.div>

          {/* Success Message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-800 dark:text-green-200 text-sm sm:text-base font-medium">
                      Spot Created Successfully!
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm mt-1">
                      Your hangout spot has been added and is now visible to others.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg mt-0.5">
                      <LogIn className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm sm:text-base font-medium">
                        Sign in to unlock all features
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm mt-1">
                        Check in to spots, see your current location, and connect with others
                      </p>
                    </div>
                  </div>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Location Error */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <Card className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-orange-800 dark:text-orange-200 text-sm sm:text-base font-medium">
                      Location Service
                    </p>
                    <p className="text-orange-700 dark:text-orange-300 text-xs sm:text-sm mt-1">
                      {locationError}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestLocation}
                    className="ml-auto text-xs"
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Current Check-in Status */}
          {currentCheckin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <CheckInStatus
                checkin={currentCheckin}
                onCheckOut={handleCheckOut}
                onViewSpot={() => navigate(`/hangouts/${currentCheckin.hangout_spot_id}`)}
              />
            </motion.div>
          )}

          {/* View Toggle - My Spots vs All Spots */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <Card>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSpotView('all')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none justify-center ${
                        spotView === 'all'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-medium">All Spots</span>
                    </button>
                    <button
                      onClick={() => setSpotView('my')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none justify-center ${
                        spotView === 'my'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">My Spots</span>
                    </button>
                  </div>
                  
                  {spotView === 'my' && (
                    <Link to="/hangouts/create" className="w-full sm:w-auto">
                      <Button
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Add New Spot</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Filters and Controls */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${spotView === 'my' ? 'my' : ''} hangout spots...`}
                  leftIcon={<Search className="h-3 w-3 sm:h-4 sm:w-4" />}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 justify-between sm:justify-start">
                {/* View Mode Toggle */}
                <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-md transition-colors ${viewMode === 'list'
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    aria-label="List view"
                  >
                    <List className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 sm:p-2 rounded-md transition-colors ${viewMode === 'map'
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    aria-label="Map view"
                  >
                    <Map className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>

                {/* Location Button */}
                <Button
                  variant="outline"
                  onClick={handleUseMyLocation}
                  className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3"
                  disabled={!isAuthenticated || spotView === 'my'}
                  title={
                    !isAuthenticated ? "Sign in to use location" : 
                    spotView === 'my' ? "Location filter not available for My Spots" :
                    "Use your current location"
                  }
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">
                    {location ? 'Update Location' : 'My Location'}
                  </span>
                  <span className="xs:hidden">
                    {location ? 'Update' : 'Location'}
                  </span>
                </Button>

                {/* Create Spot Button */}
                {spotView === 'all' && (
                  <Link to="/hangouts/create" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      className="bg-green-600 hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 w-full"
                      disabled={!isAuthenticated}
                      title={!isAuthenticated ? "Sign in to create spots" : "Add new hangout spot"}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Add Spot</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Spot Type Filters */}
            {spotView === 'all' && (
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
                {spotTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSpotTypeFilter(type.value)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${spotTypeFilter === type.value
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                  >
                    {type.icon}
                    <span className="hidden xs:inline">{type.label}</span>
                    <span className="xs:hidden">
                      {type.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Status */}
          {location && isAuthenticated && spotView === 'all' && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Showing spots near your location ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {(loading || (spotView === 'my' && loadingMySpots)) && (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {spotView === 'my' ? 'Loading your spots...' : 'Loading hangout spots...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-800 dark:text-red-400 text-sm sm:text-base mb-3 sm:mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()} size="sm">
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Spots Content */}
          {!loading && !error && (
            <>
              {viewMode === 'list' ? (
                /* List View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {displayedSpots.length === 0 ? (
                    <div className="col-span-full text-center py-8 sm:py-12">
                      <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {spotView === 'my' ? 'No spots created yet' : 'No hangout spots found'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 max-w-md mx-auto px-2">
                        {spotView === 'my' 
                          ? 'Create your first hangout spot to share with the community!'
                          : searchQuery || spotTypeFilter !== 'all'
                            ? 'Try adjusting your filters to see more spots.'
                            : 'Be the first to add a hangout spot in your area!'
                        }
                      </p>
                      {isAuthenticated && (
                        <Link to="/hangouts/create">
                          <Button
                            variant="primary"
                            size="sm"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {spotView === 'my' ? 'Create First Spot' : 'Add First Spot'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    displayedSpots.map((spot, index) => (
                      <HangoutSpotCard
                        key={spot.id}
                        spot={spot}
                        onCheckIn={isAuthenticated ? handleCheckIn : undefined}
                        onEdit={handleEditSpot}
                        onDelete={handleDeleteSpot}
                        isCheckedIn={currentCheckin?.hangout_spot_id === spot.id}
                        showActions={isAuthenticated}
                      />
                    ))
                  )}
                </div>
              ) : (
                /* Map View */
                <HangoutSpotsMap
                  spots={displayedSpots}
                  currentLocation={isAuthenticated && spotView === 'all' ? location : undefined}
                  onSpotClick={handleSpotClick}
                  onCheckIn={isAuthenticated ? handleCheckIn : undefined}
                  className="mb-4 sm:mb-6 h-64 sm:h-80 md:h-96 lg:h-[500px]"
                />
              )}
            </>
          )}

          {/* Selected Spot Popup (for map view) */}
          {selectedSpot && viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-[95vw] w-full max-w-md"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-xl mx-2">
                <HangoutSpotCard
                  spot={selectedSpot}
                  onCheckIn={isAuthenticated ? handleCheckIn : undefined}
                  onEdit={handleEditSpot}
                  onDelete={handleDeleteSpot}
                  isCheckedIn={currentCheckin?.hangout_spot_id === selectedSpot.id}
                  showActions={isAuthenticated}
                />
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                  aria-label="Close"
                >
                  ×
                </button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Hangout Spot"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this hangout spot? This action cannot be undone.
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
              variant="primary"
              onClick={confirmDelete}
              loading={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default HangoutSpotsPage;