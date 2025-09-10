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

    const handleProfileChange = (e) => { /* ... no changes ... */ };
    const handlePasswordChange = (e) => { /* ... no changes ... */ };
    const handleUpdateProfile = async (e) => { /* ... no changes ... */ };
    const handleUpdatePassword = async (e) => { /* ... no changes ... */ };

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
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
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
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password here. It's recommended to use a strong, unique password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-6">
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