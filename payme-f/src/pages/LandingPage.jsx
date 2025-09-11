import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { wakeBackend } from "../services/wakeBackend.js";
import { Mail, Zap, CreditCard, Building, ArrowRight, Shield, Sparkles } from 'lucide-react';

const PageLoader = () => (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                <Mail className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
            </div>
            <p className="font-['Space Mono'] text-muted-foreground">Initializing PayMe...</p>
        </div>
    </div>
);

const FeatureCard = ({ title, children, icon: Icon }) => (
    <div className="retro-card p-8 text-center rounded-2xl group border border-border/50 hover:border-primary/30 transition-all duration-300">
        <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-8 w-8 text-primary" />
            </div>
        </div>
        <h3 className="text-xl font-bold font-['Orbitron'] mb-3 retro-glow">
            {title}
        </h3>
        <p className="text-muted-foreground font-['Space Mono']">{children}</p>
    </div>
);

const EmailPaymentBadge = () => (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
        <Mail className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-['Space Mono'] font-semibold text-primary">
         Email-Based Payment System
        </span>
        <Sparkles className="h-4 w-4 text-primary" />
    </div>
);

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializePage = async () => {
            await wakeBackend(); 
            
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        };

        initializePage();
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="max-w-7xl mx-auto border-x border-border/40"> 
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
                    <div className="container h-20 flex items-center justify-between mx-auto px-6">
                        <Link to="/" className="text-4xl font-black font-['Orbitron'] gradient-text flex items-center gap-2"> 
                            <Mail className="h-8 w-8 text-primary" />
                            PAYME
                        </Link>
                        <nav className="hidden md:flex gap-2">
                            <Button asChild variant="ghost" className="font-['Space Mono'] text-base border border-transparent hover:border-border/50">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="font-['Space Mono'] font-bold text-base text-primary-foreground bg-[--retro-gradient] hover:shadow-[var(--retro-glow)] transition-all border-2 border-primary/30">
                                <Link to="/signup">Sign Up</Link>
                            </Button> 
                        </nav>
                    </div>
                </header>
    
                <main className="flex-grow">
                    <section className="text-center py-20 md:py-32 relative overflow-hidden">
                        <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
                            <div className="mb-8">
                                <EmailPaymentBadge />
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-['Orbitron'] tracking-tighter gradient-text leading-tight">
                                Send Money with Just an
                                <span className="block text-primary">Email Address</span>
                            </h1>
                            
                            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground font-['Space Mono']">
                                Revolutionary P2P payments that work like email. No phone numbers, no complex IDs. 
                                Just type an email and send money instantly.
                            </p>
                            
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button asChild size="lg" className="text-lg font-bold font-['Space Mono'] px-10 py-6 text-primary-foreground bg-[--retro-gradient] hover:shadow-[var(--retro-glow)] transition-all hover:-translate-y-1 pulse-glow border-2 border-primary/30">
                                    <Link to="/signup" className="flex items-center gap-2">
                                        Create Free Account
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                                {/* <Button asChild variant="outline" size="lg" className="text-lg font-['Space Mono'] px-10 py-6 border-2 border-border/50 hover:border-primary/50">
                                    <Link to="/login" className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Try Demo
                                    </Link>
                                </Button> */}
                            </div>

            
                            <div className="mt-16 max-w-2xl mx-auto">
                                <div className="bg-card/30 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
                                    <div className="flex items-center justify-center gap-4 text-lg font-['Space Mono']">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span>ram@email.com</span>
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-primary" />
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
                                            <span className="font-bold text-primary">₹500</span>
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-primary" />
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
                                            <Mail className="h-4 w-4 text-green-500" />
                                            <span>raj@email.com</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4 font-['Space Mono']">
                                        It's that simple. Just enter email and send money.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                
                    <div className="text-center -mt-8 mb-20">
                        <div className="inline-flex items-center gap-3 rounded-full border-2 border-border/40 bg-card/50 px-6 py-3 backdrop-blur-sm">
                            <Shield className="h-5 w-5 text-green-500" />
                            <p className="text-sm font-['Space Mono'] text-muted-foreground">Secure payments powered by</p>
                            <span className="font-bold text-lg text-primary">Razorpay</span>
                        </div>
                    </div>


                    <section className="py-20">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-black font-['Orbitron'] text-center mb-16 gradient-text">How It Works</h2>
                            <div className="grid md:grid-cols-3 gap-12 text-center font-['Space Mono'] text-lg">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6 border-2 border-primary/30">1</div>
                                    <p>Create your account with just your email address.</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6 border-2 border-primary/30">2</div>
                                    <p>Add money to your digital wallet securely.</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6 border-2 border-primary/30">3</div>
                                    <p>Send money using just the recipient's email.</p>
                                </div>
                            </div>
                        </div>
                    </section>

               
                    <section className="py-20 border-t border-border/40">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-black font-['Orbitron'] text-center mb-16 gradient-text">
                                Why Choose PayMe
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <FeatureCard title="Email-Based Transfers" icon={Mail}>
                                    Payment system using email addresses. Simple, memorable, revolutionary.
                                </FeatureCard>
                                <FeatureCard title="Instant & Secure" icon={Zap}>
                                    Lightning-fast transfers with bank-grade security. Money moves in seconds.
                                </FeatureCard>
                                <FeatureCard title="Easy Wallet Management" icon={CreditCard}>
                                    Add funds via UPI, cards, or bank transfer. Withdraw anytime to your account.
                                </FeatureCard>
                            </div>
                        </div>
                    </section>


                    <section className="py-20 border-t border-border/40">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl font-black font-['Orbitron'] mb-6 gradient-text">
                                Ready to revolutionize how you send money?
                            </h2>
                            <p className="text-xl text-muted-foreground font-['Space Mono'] mb-8 max-w-2xl mx-auto">
                                Join and discovered the future of payments.
                            </p>
                            <Button asChild size="lg" className="text-lg font-bold font-['Space Mono'] px-12 py-6 text-primary-foreground bg-[--retro-gradient] hover:shadow-[var(--retro-glow)] transition-all hover:-translate-y-1 border-2 border-primary/30">
                                <Link to="/signup" className="flex items-center gap-2">
                                    Get Started Now
                                    <Mail className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border/40">
                    <div className="container py-6 text-center text-muted-foreground font-['Space Mono']">
                        <p>Developed by Sudhanshu Jha | <a href="https://www.linkedin.com/in/sudhanshujha01/" className="text-secondary hover:text-primary transition-colors border-b border-transparent hover:border-primary/50">LinkedIn</a></p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;