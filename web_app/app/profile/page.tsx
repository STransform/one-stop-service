'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/');
        }
        if (session) {
            fetchProfile();
        }
    }, [session, status]);

    const fetchProfile = async () => {
        try {
            // Sync/Get profile logic
            // Put call to sync, then get or just use return
            const response = await userService.put('/users/me');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="bg-white p-6 rounded shadow max-w-md">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>First Name:</strong> {profile.firstName}</p>
                <p><strong>Last Name:</strong> {profile.lastName}</p>
                <p className="mt-4 text-xs text-gray-400">ID: {profile.id}</p>
            </div>
        </div>
    );
}
