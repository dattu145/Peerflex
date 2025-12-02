import { supabase } from '../config/supabase';
import type { Profile } from '../types';

export const profileService = {
    // Get current user profile
    async getProfile(): Promise<Profile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    },

    // Update profile
    async updateProfile(updates: Partial<Profile>): Promise<Profile> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Upload avatar
    async uploadAvatar(file: File): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars') // Assuming 'avatars' bucket exists
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    // Get user stats (notes count, etc.)
    async getUserStats(userId: string) {
        // Get notes count
        const { count: notesCount, error: notesError } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (notesError) console.error('Error fetching notes count:', notesError);

        return {
            notesCount: notesCount || 0
        };
    }
};
