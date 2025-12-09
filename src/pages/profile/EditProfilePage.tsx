import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Book, School, Briefcase, Heart, Shield, Save, ArrowLeft, Camera, Loader } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { profileService } from '../../services/profileService';
import type { Profile } from '../../types';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, setProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<Partial<Profile>>({});
    const [skillsInput, setSkillsInput] = useState('');
    const [interestsInput, setInterestsInput] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                ...profile,
                privacy_settings: profile.privacy_settings || {
                    show_notes: true,
                    show_location: true,
                    show_online_status: true
                }
            });
            setSkillsInput(profile.skills?.join(', ') || '');
            setInterestsInput(profile.interests?.join(', ') || '');
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrivacyChange = (setting: keyof NonNullable<Profile['privacy_settings']>) => {
        setFormData(prev => ({
            ...prev,
            privacy_settings: {
                ...prev.privacy_settings!,
                [setting]: !prev.privacy_settings![setting]
            }
        }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const publicUrl = await profileService.uploadAvatar(file);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            // Auto save avatar update
            if (user) {
                const updatedProfile = await profileService.updateProfile({ avatar_url: publicUrl });
                setProfile(updatedProfile);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);

            // Process skills and interests
            const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
            const interests = interestsInput.split(',').map(s => s.trim()).filter(s => s);

            const updates = {
                ...formData,
                skills,
                interests,
                year_of_study: formData.year_of_study ? Number(formData.year_of_study) : undefined
            };

            const updatedProfile = await profileService.updateProfile(updates);
            setProfile(updatedProfile);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return null;

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info Card */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-white">
                                    <User className="w-5 h-5 text-purple-600" />
                                    Basic Information
                                </h2>

                                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg">
                                                {formData.avatar_url ? (
                                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User className="w-12 h-12" />
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-purple-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                            </label>
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                    <Loader className="w-8 h-8 text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">Click camera to upload</p>
                                    </div>

                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                                <Input
                                                    name="username"
                                                    value={formData.username || ''}
                                                    onChange={handleChange}
                                                    placeholder="johndoe"
                                                    disabled // Username usually shouldn't be changed easily
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                                <Input
                                                    name="full_name"
                                                    value={formData.full_name || ''}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio || ''}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Academic Info Card */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-white">
                                    <School className="w-5 h-5 text-purple-600" />
                                    Academic Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                                        <Input
                                            name="university"
                                            value={formData.university || ''}
                                            onChange={handleChange}
                                            placeholder="University Name"
                                            leftIcon={<School className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Major</label>
                                        <Input
                                            name="major"
                                            value={formData.major || ''}
                                            onChange={handleChange}
                                            placeholder="Computer Science"
                                            leftIcon={<Book className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year of Study</label>
                                        <select
                                            name="year_of_study"
                                            value={formData.year_of_study || ''}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                        >
                                            <option value="">Select Year</option>
                                            {[1, 2, 3, 4, 5].map(year => (
                                                <option key={year} value={year}>Year {year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </Card>

                            {/* Skills & Interests Card */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-white">
                                    <Briefcase className="w-5 h-5 text-purple-600" />
                                    Skills & Interests
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                                        <Input
                                            value={skillsInput}
                                            onChange={(e) => setSkillsInput(e.target.value)}
                                            placeholder="React, TypeScript, Python..."
                                            leftIcon={<Briefcase className="w-4 h-4" />}
                                        />
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {skillsInput.split(',').filter(s => s.trim()).map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests (comma separated)</label>
                                        <Input
                                            value={interestsInput}
                                            onChange={(e) => setInterestsInput(e.target.value)}
                                            placeholder="Web Development, AI, Music..."
                                            leftIcon={<Heart className="w-4 h-4" />}
                                        />
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {interestsInput.split(',').filter(s => s.trim()).map((interest, i) => (
                                                <span key={i} className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded text-xs">
                                                    {interest.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Privacy Settings Card */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-white">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    Privacy Settings
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Show Notes</h3>
                                            <p className="text-sm text-gray-500">Allow others to see your shared notes</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.privacy_settings?.show_notes}
                                                onChange={() => handlePrivacyChange('show_notes')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Show Location</h3>
                                            <p className="text-sm text-gray-500">Allow others to see your general location</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.privacy_settings?.show_location}
                                                onChange={() => handlePrivacyChange('show_location')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Online Status</h3>
                                            <p className="text-sm text-gray-500">Show when you are online</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.privacy_settings?.show_online_status}
                                                onChange={() => handlePrivacyChange('show_online_status')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading || uploading}
                                    className="min-w-[120px]"
                                >
                                    {loading ? (
                                        <Loader className="w-5 h-5 animate-spin mx-auto" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default EditProfilePage;
