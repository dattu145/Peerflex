// src/pages/hangouts/CreateHangoutSpotPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Users, Wifi, Coffee, Book, Utensils, Heart, Clock, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LocationPicker from '../../components/map/LocationPicker';
import { hangoutService } from '../../services/hangoutService';
import { useAuthStore } from '../../store/useAuthStore';
import type { HangoutSpot, Location } from '../../types';

interface FormData {
    name: string;
    description: string;
    address: string;
    spot_type: string;
    capacity: number;
    amenities: string[];
    operating_hours: {
        open: string;
        close: string;
        days: number[];
    };
    contact_info: {
        phone: string;
        email: string;
        website: string;
    };
    images: string[];
}

const CreateHangoutSpotPage: React.FC = () => {
    const navigate = useNavigate();
    const { spotId } = useParams();
    const { isAuthenticated } = useAuthStore();

    const [isEditMode, setIsEditMode] = useState(false);
    const [existingSpot, setExistingSpot] = useState<HangoutSpot | null>(null);
    const [loadingSpot, setLoadingSpot] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        address: '',
        spot_type: 'cafe',
        capacity: 20,
        amenities: [],
        operating_hours: {
            open: '09:00',
            close: '22:00',
            days: [1, 2, 3, 4, 5, 6, 7] // Monday to Sunday
        },
        contact_info: {
            phone: '',
            email: '',
            website: ''
        },
        images: []
    });

    const [amenityInput, setAmenityInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [locationError, setLocationError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');

    const spotTypes = [
        { value: 'cafe', label: 'Cafe', icon: <Coffee className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'library', label: 'Library', icon: <Book className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'park', label: 'Park', icon: <Heart className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'study_room', label: 'Study Room', icon: <Book className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'food', label: 'Food Court', icon: <Utensils className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'social', label: 'Social Space', icon: <Users className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'sports', label: 'Sports Area', icon: <Heart className="h-3 w-3 xs:h-4 xs:w-4" /> },
        { value: 'other', label: 'Other', icon: <MapPin className="h-3 w-3 xs:h-4 xs:w-4" /> }
    ];

    const commonAmenities = [
        'WiFi',
        'Power Outlets',
        'Air Conditioning',
        'Quiet Area',
        'Group Study',
        'Food Available',
        'Beverages',
        'Outdoor Seating',
        '24/7 Access',
        'Parking',
        'Wheelchair Accessible'
    ];

    // Check if we're in edit mode and load spot data
    useEffect(() => {
        const checkEditMode = async () => {
            if (spotId) {
                setIsEditMode(true);
                setLoadingSpot(true);
                try {
                    const spot = await hangoutService.getHangoutSpotById(spotId);
                    if (spot) {
                        setExistingSpot(spot);
                        // Pre-fill form data with existing spot
                        setFormData({
                            name: spot.name,
                            description: spot.description || '',
                            address: spot.address || '',
                            spot_type: spot.spot_type,
                            capacity: spot.capacity || 20,
                            amenities: spot.amenities || [],
                            operating_hours: spot.operating_hours || {
                                open: '09:00',
                                close: '22:00',
                                days: [1, 2, 3, 4, 5, 6, 7]
                            },
                            contact_info: spot.contact_info || {
                                phone: '',
                                email: '',
                                website: ''
                            },
                            images: spot.images || []
                        });
                        
                        // Set location if available
                        if (spot.location) {
                            // Convert PostGIS point to Location format
                            const coordinates = spot.location.coordinates || [0, 0];
                            setSelectedLocation({
                                latitude: coordinates[1],
                                longitude: coordinates[0],
                                address: spot.address
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed to load spot data:', error);
                    setSubmitError('Failed to load spot data');
                } finally {
                    setLoadingSpot(false);
                }
            }
        };

        checkEditMode();
    }, [spotId]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: isEditMode ? `/hangouts/edit/${spotId}` : '/hangouts/create',
                    message: `Please sign in to ${isEditMode ? 'edit' : 'create'} a hangout spot`
                }
            });
        }
    }, [isAuthenticated, navigate, isEditMode, spotId]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (submitError) {
            setSubmitError('');
        }
    };

    const handleNestedInputChange = (
        parent: keyof FormData,
        field: string,
        value: any
    ) => {
        setFormData(prev => {
            if (parent === 'operating_hours') {
                return {
                    ...prev,
                    operating_hours: {
                        ...prev.operating_hours,
                        [field]: value
                    }
                };
            } else if (parent === 'contact_info') {
                return {
                    ...prev,
                    contact_info: {
                        ...prev.contact_info,
                        [field]: value
                    }
                };
            }
            return prev;
        });
    };

    const handleAmenityAdd = (amenity: string) => {
        if (amenity.trim() && !formData.amenities.includes(amenity.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenity.trim()]
            }));
        }
        setAmenityInput('');
    };

    const handleCustomAmenityAdd = () => {
        if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenityInput.trim()]
            }));
            setAmenityInput('');
        }
    };

    const handleAmenityRemove = (amenityToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
        }));
    };

    const handleLocationSelect = (location: Location, address?: string) => {
        setSelectedLocation(location);
        setLocationError('');
        if (address) {
            handleInputChange('address', address);
        }
    };

    const handleLocationError = (error: string) => {
        setLocationError(error);
        console.error('Location error:', error);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!selectedLocation) newErrors.location = 'Location is required';
        if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const spotData = {
                ...formData,
                location: selectedLocation ? {
                    type: 'Point',
                    coordinates: [selectedLocation.longitude, selectedLocation.latitude]
                } : null,
                capacity: parseInt(formData.capacity.toString()) || 20,
                amenities: formData.amenities
            };

            if (isEditMode && spotId) {
                await hangoutService.updateHangoutSpot(spotId, spotData);
                navigate('/hangouts', {
                    state: {
                        message: 'Hangout spot updated successfully!',
                        type: 'success'
                    }
                });
            } else {
                await hangoutService.createHangoutSpot(spotData);
                navigate('/hangouts', {
                    state: {
                        message: 'Hangout spot created successfully!',
                        type: 'success'
                    }
                });
            }
        } catch (error: any) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} hangout spot:`, error);
            setSubmitError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} hangout spot. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/hangouts');
    };

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 border-b-2 border-purple-600 mx-auto mb-3 xs:mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base">Redirecting to login...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loadingSpot) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 border-b-2 border-purple-600 mx-auto mb-3 xs:mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base">Loading spot data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const pageTitle = isEditMode ? 'Update Hangout Spot' : 'Add New Hangout Spot';
    const pageDescription = isEditMode 
        ? 'Update your hangout spot information' 
        : 'Share a great place for people to study, socialize, and connect';
    const submitButtonText = isEditMode ? 'Update Spot' : 'Create Spot';

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 xs:py-6 sm:py-8">
                <div className="max-w-5xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-4 xs:mb-6 sm:mb-8">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 xs:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 xs:mb-4 sm:mb-6 transition-colors duration-200 text-sm xs:text-base"
                        >
                            <ArrowLeft className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                            <span className="truncate">Back to Hangout Spots</span>
                        </button>

                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2 xs:mb-3 sm:mb-4">
                                <MapPin className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2 sm:mb-2">
                                {pageTitle}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto px-1">
                                {pageDescription}
                            </p>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {submitError && (
                        <div className="mb-3 xs:mb-4 sm:mb-6 p-2 xs:p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-400 text-xs xs:text-sm">{submitError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-6 space-y-4 xs:space-y-5 sm:space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4">
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4">
                                    <Input
                                        label="Spot Name *"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        error={errors.name}
                                        placeholder="Enter spot name"
                                        className="text-sm xs:text-base"
                                    />

                                    <Input
                                        label="Description *"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        error={errors.description}
                                        placeholder="Describe this hangout spot..."
                                        as="textarea"
                                        rows={3}
                                        className="text-sm xs:text-base min-h-[80px] xs:min-h-[100px] resize-vertical"
                                    />

                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                                                Spot Type *
                                            </label>
                                            <select
                                                value={formData.spot_type}
                                                onChange={(e) => handleInputChange('spot_type', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200 text-sm xs:text-base"
                                            >
                                                {spotTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <Input
                                            label="Capacity *"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => handleInputChange('capacity', e.target.value)}
                                            error={errors.capacity}
                                            leftIcon={<Users className="h-3 w-3 xs:h-4 xs:w-4" />}
                                            min="1"
                                            max="1000"
                                            className="text-sm xs:text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4">
                                    Location
                                </h2>
                                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                                            Location on Map *
                                            {errors.location && <span className="text-red-500 text-xs xs:text-sm ml-1">- {errors.location}</span>}
                                            {locationError && <span className="text-red-500 text-xs xs:text-sm ml-1">- {locationError}</span>}
                                        </label>
                                        <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                                            <LocationPicker
                                                initialLocation={selectedLocation || undefined}
                                                onLocationSelect={handleLocationSelect}
                                                onError={handleLocationError}
                                                className="h-40 xs:h-48 sm:h-56 md:h-64 w-full"
                                            />
                                        </div>
                                    </div>

                                    <Input
                                        label="Address *"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        error={errors.address}
                                        placeholder="Full address of the location"
                                        leftIcon={<MapPin className="h-3 w-3 xs:h-4 xs:w-4" />}
                                        className="text-sm xs:text-base"
                                    />
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div>
                                <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4">
                                    Operating Hours
                                </h2>
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                                    <Input
                                        label="Open Time"
                                        type="time"
                                        value={formData.operating_hours.open}
                                        onChange={(e) => handleNestedInputChange('operating_hours', 'open', e.target.value)}
                                        className="text-sm xs:text-base"
                                    />
                                    <Input
                                        label="Close Time"
                                        type="time"
                                        value={formData.operating_hours.close}
                                        onChange={(e) => handleNestedInputChange('operating_hours', 'close', e.target.value)}
                                        className="text-sm xs:text-base"
                                    />
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4">
                                    Amenities
                                </h2>

                                {/* Common Amenities */}
                                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3 sm:mb-4">
                                    {commonAmenities.map((amenity) => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => handleAmenityAdd(amenity)}
                                            disabled={formData.amenities.includes(amenity)}
                                            className={`p-2 xs:p-2.5 sm:p-3 text-left rounded-lg border transition-colors duration-200 text-xs xs:text-sm ${formData.amenities.includes(amenity)
                                                    ? 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200'
                                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                                                <Wifi className="h-3 w-3 xs:h-3 xs:w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                <span className="truncate text-xs xs:text-sm">{amenity}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Amenity Input */}
                                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                                    <div className="flex-1">
                                        <Input
                                            value={amenityInput}
                                            onChange={(e) => setAmenityInput(e.target.value)}
                                            placeholder="Add custom amenity..."
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleCustomAmenityAdd();
                                                }
                                            }}
                                            className="text-sm xs:text-base"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleCustomAmenityAdd}
                                        variant="outline"
                                        className="whitespace-nowrap text-xs xs:text-sm px-3 xs:px-4"
                                    >
                                        Add
                                    </Button>
                                </div>

                                {/* Selected Amenities */}
                                {formData.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 xs:gap-2 mt-2 xs:mt-3 sm:mt-4">
                                        {formData.amenities.map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs xs:text-sm border border-purple-200 dark:border-purple-700"
                                            >
                                                <span className="truncate max-w-[80px] xs:max-w-none">{amenity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAmenityRemove(amenity)}
                                                    className="hover:text-purple-600 dark:hover:text-purple-400 text-xs xs:text-sm font-medium transition-colors duration-200 flex-shrink-0"
                                                    aria-label={`Remove ${amenity}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4">
                                    Contact Information (Optional)
                                </h2>
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                                    <Input
                                        label="Phone"
                                        value={formData.contact_info.phone}
                                        onChange={(e) => handleNestedInputChange('contact_info', 'phone', e.target.value)}
                                        placeholder="Phone number"
                                        className="text-sm xs:text-base"
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.contact_info.email}
                                        onChange={(e) => handleNestedInputChange('contact_info', 'email', e.target.value)}
                                        placeholder="Email address"
                                        className="text-sm xs:text-base"
                                    />
                                    <div className="xs:col-span-2">
                                        <Input
                                            label="Website"
                                            value={formData.contact_info.website}
                                            onChange={(e) => handleNestedInputChange('contact_info', 'website', e.target.value)}
                                            placeholder="Website URL"
                                            className="text-sm xs:text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4 xs:pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1 text-sm xs:text-base py-2 xs:py-2.5 sm:py-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={loading}
                                    className="flex-1 text-sm xs:text-base py-2 xs:py-2.5 sm:py-3"
                                >
                                    {submitButtonText}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateHangoutSpotPage;