import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Toaster, toast } from 'react-hot-toast';

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
        const toastId = toast.loading("Updating profile...");
        try {
            const response = await api.patch('/user/update-profile', profileData);
            login(response.data.user, accessToken); // Update user in Zustand store
            toast.success("Profile updated successfully!", { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.", { id: toastId });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating password...");
        try {
            await api.patch('/user/change-password', passwordData);
            toast.success("Password updated successfully!", { id: toastId });
            setPasswordData({ currentPassword: '', newPassword: '' }); // Clear fields
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password.", { id: toastId });
        }
    };

    return (
        <div className="animate-popup space-y-8">
            <Toaster position="top-center" />
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2"> {/* Changed to 2 columns */}
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* --- Profile Tab --- */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input id="fullname" name="fullname" value={profileData.fullname} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user?.email || ''} disabled />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Security Tab --- */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Change your password here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                                </div>
                                <Button type="submit">Update Password</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;