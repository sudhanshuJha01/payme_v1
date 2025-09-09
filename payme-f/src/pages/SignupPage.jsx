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

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Creating account...');
        try {
            const response = await axios.post('http://localhost:8080/api/user/register', formData);
            toast.success(response.data.message, { id: toastId });
            setShowOtpForm(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Verifying OTP...');
        try {
            const response = await axios.post('http://localhost:8080/api/user/verify-otp', {
                email: formData.email,
                otp: otp,
            });
            toast.success(response.data.message, { id: toastId });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'OTP verification failed.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title={showOtpForm ? "Verify Your Account" : "Create an Account"} 
            description={showOtpForm ? `We've sent a 6-digit code to ${formData.email}` : "Enter your details to get started."}
        >
            <Toaster position="top-center" reverseOrder={false} />
            <Card className="retro-card p-2 rounded-2xl">
                <CardContent className="p-8">
                    {!showOtpForm ? (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullname" className="text-lg">Full Name</Label>
                                <Input id="fullname" name="fullname" type="text" placeholder="Sudhanshu Jha" required value={formData.fullname || ''} onChange={handleInputChange} autoComplete="off" className="text-lg py-6"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-lg">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email || ''} onChange={handleInputChange} autoComplete="off" className="text-lg py-6"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-lg">Password</Label>
                                <div className="relative">
                                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={formData.password || ''} onChange={handleInputChange} autoComplete="off" className="text-lg py-6 pr-10"/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading}>
                                {isLoading ? 'Sending OTP...' : 'Continue'}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-8">
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
                            <Button onClick={handleVerifyOtp} className="w-full retro-btn font-bold text-lg py-6" disabled={isLoading || otp.length < 6}>
                                {isLoading ? 'Verifying...' : 'Verify Account'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-6 font-['Space Mono']">
                Already have an account? <Link to="/login" className="text-secondary hover:text-primary">Login</Link>
            </p>
        </AuthLayout>
    );
};

export default SignupPage;