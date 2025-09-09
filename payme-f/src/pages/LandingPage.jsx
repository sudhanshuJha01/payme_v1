import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

// Helper component for the feature cards
const FeatureCard = ({ title, children, icon }) => (
    <div className="retro-card p-8 text-center rounded-2xl group">
        <div className="mb-4 text-5xl text-secondary transform-gpu transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-['Orbitron'] mb-2 retro-glow">
            {title}
        </h3>
        <p className="text-muted-foreground font-['Space Mono']">{children}</p>
    </div>
);

const LandingPage = () => {
    return (
        <div className="max-w-7xl mx-auto border-x border-border/40"> 
            <div className="flex flex-col min-h-screen">
                {/* --- Navbar --- */}
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
                    <div className="container h-20 flex items-center justify-between mx-auto px-6">
                        <Link to="/" className="text-4xl font-black font-['Orbitron'] gradient-text"> 
                            PAYME
                        </Link>
                        <nav className="hidden md:flex gap-2">
                            <Button asChild variant="ghost" className="font-['Space Mono'] text-base">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="font-['Space Mono'] font-bold text-base text-primary-foreground bg-[--retro-gradient] hover:shadow-[var(--retro-glow)] transition-all">
                                <Link to="/signup">Sign Up</Link>
                            </Button> 
                        </nav>
                    </div>
                </header>
                
                {/* --- Main Content --- */}
                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="text-center py-24 md:py-40 relative overflow-hidden">
                        <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
                            <h1 className="text-5xl md:text-7xl font-black font-['Orbitron'] tracking-tighter gradient-text">
                                Instant Payments for Everyone.
                            </h1>
                            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground font-['Space Mono']">
                                A seamless and secure way to send and receive money with a touch of modern nostalgia. Get started in seconds.
                            </p>
                            <div className="mt-10">
                                <Button asChild size="lg" className="text-lg font-bold font-['Space Mono'] px-10 py-6 text-primary-foreground bg-[--retro-gradient] hover:shadow-[var(--retro-glow)] transition-all hover:-translate-y-1 pulse-glow">
                                    <Link to="/signup">Create Your Free Account</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                
                    <div className="text-center -mt-20 mb-24">
                        <div className="inline-flex items-center gap-3 rounded-full border border-border/40 bg-card/50 px-4 py-2">
                            <p className="text-sm font-['Space Mono'] text-muted-foreground">Secure payments powered by</p>
                            <span className="font-bold text-lg text-primary">Razorpay</span>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <section className="py-20">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-black font-['Orbitron'] text-center mb-16 gradient-text">How It Works</h2>
                            <div className="grid md:grid-cols-3 gap-12 text-center font-['Space Mono'] text-lg">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6">1</div>
                                    <p>Create your account and get a secure digital wallet.</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6">2</div>
                                    <p>Add money to your wallet using our secure payment gateway.</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full retro-card flex items-center justify-center text-3xl font-bold font-['Orbitron'] mb-6">3</div>
                                    <p>Send money to anyone instantly or withdraw to your bank account.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 border-t border-border/40">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-black font-['Orbitron'] text-center mb-16 gradient-text">
                                Features
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <FeatureCard title="Instant P2P Transfers" icon="⚡️">
                                    Send money to any Payme user in a flash. No waiting, no fees.
                                </FeatureCard>
                                <FeatureCard title="Easy Wallet Top-Up" icon="💳">
                                    Add funds to your wallet securely using UPI, cards, and more.
                                </FeatureCard>
                                <FeatureCard title="Bank Withdrawals" icon="🏦">
                                    Cash out your wallet balance directly to your bank account anytime.
                                </FeatureCard>
                            </div>
                        </div>
                    </section>
                </main>

                {/* --- Footer --- */}
                <footer className="border-t border-border/40">
                    <div className="container py-6 text-center text-muted-foreground font-['Space Mono']">
                        <p>Developed by Sudhanshu Jha | <a href="https://www.linkedin.com/in/sudhanshujha01/" className="text-secondary hover:text-primary transition-colors">LinkedIn</a></p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;