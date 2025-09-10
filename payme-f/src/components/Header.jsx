import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from './ui/badge';
import { Bell, LayoutDashboard, User, History, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
            const unread = response.data.notifications.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMarkAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await api.patch('/notifications/read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            toast.error("Failed to mark notifications as read.");
        }
    };

    const userInitial = user?.fullname?.charAt(0).toUpperCase() || 'U';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container h-20 flex items-center justify-between mx-auto px-4">
                <Link to="/dashboard" className="font-bold text-2xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Payme
                </Link>
                <div className="flex items-center gap-6">
                    <span className="font-medium hidden sm:block">Hello, {user?.fullname}</span>
                    
                    {/* Notification Bell Dropdown */}
                    <DropdownMenu onOpenChange={(open) => { if (open) handleMarkAsRead(); }}>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="relative rounded-full">
                                <Bell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length > 0 ? (
                                notifications.slice(0, 5).map(n => (
                                    <DropdownMenuItem key={n._id}>
                                        <div className="flex flex-col">
                                            <p className="text-sm">{n.message}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem>No new notifications</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarFallback>{userInitial}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.fullname}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/history')} className="cursor-pointer">
                                <History className="mr-2 h-4 w-4" />
                                <span>History</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;