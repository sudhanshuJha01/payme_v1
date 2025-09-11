import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Bell, LayoutDashboard, User, History, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { wakeBackend } from "../services/wakeBackend.js";

const CustomDropdown = ({ trigger, children, isOpen, onOpenChange, className = "" }) => {
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                onOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onOpenChange]);

    return (
        <div className="relative">
            <div ref={triggerRef} onClick={() => onOpenChange(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border/60 rounded-lg shadow-lg z-[9999] animate-popup ${className}`}
                    style={{ minWidth: '200px' }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

const DropdownItem = ({ children, onClick, className = "", disabled = false }) => (
    <div
        className={`px-4 py-2 cursor-pointer text-sm transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        style={{ 
            backgroundColor: 'transparent',
            color: '#ffffff'
        }}
        onMouseEnter={(e) => {
            if (!disabled) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
            if (!disabled) e.target.style.backgroundColor = 'transparent';
        }}
        onClick={disabled ? undefined : onClick}
    >
        {children}
    </div>
);

const DropdownLabel = ({ children, className = "" }) => (
    <div 
        className={`px-4 py-2 text-sm font-semibold border-b ${className}`}
        style={{ 
            color: '#ffffff',
            borderBottomColor: 'rgba(255, 255, 255, 0.2)'
        }}
    >
        {children}
    </div>
);

const DropdownSeparator = () => (
    <div 
        className="my-1" 
        style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.2)' 
        }}
    />
);

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
    wakeBackend(); 
  }, []);

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
        setUserMenuOpen(false);
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

    const handleNotificationsOpen = (open) => {
        setNotificationsOpen(open);
        if (open) handleMarkAsRead();
    };

    const handleNavigation = (path) => {
        navigate(path);
        setUserMenuOpen(false);
    };

    const userInitial = user?.fullname?.charAt(0).toUpperCase() || 'U';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container h-20 flex items-center justify-between mx-auto px-4">
                {/* <Link to="/dashboard" className="font-bold text-4xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Payme
                </Link> */}
                <Link to="/dashboard" className="text-4xl font-black font-['Orbitron'] gradient-text flex items-center gap-2"> 
                            <Mail className="h-8 w-8 text-primary" />
                            PAYME
                        </Link>
                <div className="flex items-center gap-6">
                    <span className="font-medium hidden sm:block">Hello, {user?.fullname}</span>
                    
                    <CustomDropdown
                        isOpen={notificationsOpen}
                        onOpenChange={handleNotificationsOpen}
                        className="w-80 bg-slate-700 object-contain"
                        trigger={
                            <Button variant="ghost" size="icon" className="relative rounded-full">
                                <Bell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        }
                    >
                        <DropdownLabel>Notifications</DropdownLabel>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 5).map(n => (
                                <DropdownItem key={n._id}>
                                    <div className="flex flex-col">
                                        <p className="text-sm">{n.message}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                </DropdownItem>
                            ))
                        ) : (
                            <DropdownItem>No new notifications</DropdownItem>
                        )}
                    </CustomDropdown>

                    {/* Custom User Profile Dropdown */}
                    <CustomDropdown
                        isOpen={userMenuOpen}
                        onOpenChange={setUserMenuOpen}
                        className="w-76 bg-slate-700 rounded-2xl border-2 border-white"
                        trigger={
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarFallback>{userInitial}</AvatarFallback>
                                </Avatar>
                            </Button>
                        }
                    >
                        <DropdownLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.fullname}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownLabel>
                        <DropdownSeparator />
                        <DropdownItem onClick={() => handleNavigation('/dashboard')}>
                            <LayoutDashboard className="mr-2 h-4 w-4 inline" />
                            <span>Dashboard</span>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleNavigation('/profile')}>
                            <User className="mr-2 h-4 w-4 inline" />
                            <span>Profile</span>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleNavigation('/history')}>
                            <History className="mr-2 h-4 w-4 inline" />
                            <span>History</span>
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem onClick={handleLogout} className="text-red-500 hover:text-red-400">
                            <LogOut className="mr-2 h-4 w-4 inline" />
                            <span>Log out</span>
                        </DropdownItem>
                    </CustomDropdown>
                </div>
            </div>
        </header>
    );
};

export default Header;