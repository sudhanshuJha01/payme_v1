import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AuthLayout from '../components/AuthLayout';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const loginAction = useAuthStore((state) => state.login);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Signing in...');

        try {
            const response = await axios.post('http://localhost:8080/api/user/login', formData, {
                withCredentials: true 
            });
            
            toast.success('Login Successful!', { id: toastId });
            loginAction(response.data.user, response.data.accessToken);
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            description="Enter your credentials to access your wallet."
        >
            <Toaster position="top-center" reverseOrder={false} />
            <Card className="retro-card p-2 rounded-2xl">
                <CardContent className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-lg">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email || ''} onChange={handleInputChange} autoComplete="off" className="text-lg py-6"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-lg">Password</Label>
                                <Link to="/forgot-password" className="text-sm text-secondary hover:text-primary font-['Space Mono']">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={formData.password || ''} onChange={handleInputChange} autoComplete="off" className="text-lg py-6 pr-10"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-6 font-['Space Mono']">
                Don't have an account? <Link to="/signup" className="text-secondary hover:text-primary">Sign Up</Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;