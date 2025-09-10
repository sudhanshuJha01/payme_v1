import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from './Header';

const AppLayout = () => {
    const accessToken = useAuthStore((state) => state.accessToken);

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="bg-background text-foreground flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;