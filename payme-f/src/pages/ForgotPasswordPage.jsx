import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import AuthLayout from '../components/AuthLayout';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Verify OTP, 3: Reset Password
    const [showPassword, setShowPassword] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Sending OTP...');

        try {
            await axios.post('http://localhost:8080/api/user/forgot-password', { email });
            toast.success('OTP sent to your email.', { id: toastId });
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Verifying OTP...');

        try {
            await axios.post('http://localhost:8080/api/user/verify-reset-otp', { email, otp });
            toast.success('OTP Verified.', { id: toastId });
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Resetting password...');

        try {
            await axios.post('http://localhost:8080/api/user/reset-password', { email, otp, newPassword });
            toast.success('Password reset successfully! Please log in.', { id: toastId });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Enter Email
                return (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-lg">Email Address</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="you@example.com" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-lg py-6"
                            />
                        </div>
                        <Button type="submit" className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </form>
                );
            case 2: // Verify OTP
                return (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col items-center space-y-8">
                        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="w-12 h-12 text-2xl"/>
                                <InputOTPSlot index={1} className="w-12 h-12 text-2xl"/>
                                <InputOTPSlot index={2} className="w-12 h-12 text-2xl"/>
                                <InputOTPSlot index={3} className="w-12 h-12 text-2xl"/>
                                <InputOTPSlot index={4} className="w-12 h-12 text-2xl"/>
                                <InputOTPSlot index={5} className="w-12 h-12 text-2xl"/>
                            </InputOTPGroup>
                        </InputOTP>
                        <Button type="submit" className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading || otp.length < 6}>
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </form>
                );
            case 3: // Reset Password
                return (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-lg">New Password</Label>
                            <div className="relative">
                                <Input 
                                    id="newPassword" 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="text-lg py-6 pr-10"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Reset Password'}
                        </Button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <AuthLayout 
            title="Reset Your Password" 
            description={
                step === 1 ? "Enter your email to receive a verification code." :
                step === 2 ? `We've sent a code to ${email}` :
                "Enter your new password."
            }
        >
            <Toaster position="top-center" reverseOrder={false} />
            <Card className="retro-card p-2 rounded-2xl">
                <CardContent className="p-8">
                    {renderStep()}
                </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-6 font-['Space Mono']">
                Remember your password? <Link to="/login" className="text-secondary hover:text-primary">Login</Link>
            </p>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;