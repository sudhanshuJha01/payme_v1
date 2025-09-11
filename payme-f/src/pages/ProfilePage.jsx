import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Toaster, toast } from 'react-hot-toast';
import { User, ShieldCheck } from 'lucide-react'; // Import icons

const ProfilePage = () => {
    const { user, login, accessToken } = useAuthStore();
    const [profileData, setProfileData] = useState({ fullname: user?.fullname || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Debug info
        console.log('Current user from store:', user);
        console.log('Access token exists:', !!accessToken);
        console.log('Token preview:', accessToken ? accessToken.substring(0, 20) + '...' : 'No token');
        
        try {
            // First test with /me endpoint to verify token works
            const meResponse = await api.get('/user/me');
            console.log('Me endpoint response:', meResponse.data);
            
            const response = await api.patch('/user/update-profile', profileData);
            console.log('Profile update response:', response.data);
            login({ ...user, ...profileData }, accessToken);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        console.log('Password update attempt with token:', !!accessToken);
        
        try {
            const response = await api.patch('/user/change-password', passwordData);
            console.log('Password update response:', response.data);
            setPasswordData({ currentPassword: '', newPassword: '' });
            toast.success('Password updated successfully!');
        } catch (error) {
            console.error('Password update error:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="animate-popup max-w-2xl mx-auto space-y-8">
            <Toaster position="top-center" />
            <div>
                <h1 className="text-4xl font-bold font-['Orbitron']">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">
                        <User className="w-4 h-4 mr-2" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                </TabsList>

                {/* --- Profile Tab --- */}
                <TabsContent value="profile">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>This information will be displayed to other users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input id="fullname" name="fullname" value={profileData.fullname} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user?.email || ''} disabled />
                                </div>
                                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Security Tab --- */}
                <TabsContent value="security">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password here. It's recommended to use a strong, unique password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                                </div>
                                <Button onClick={handleUpdatePassword}>Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;