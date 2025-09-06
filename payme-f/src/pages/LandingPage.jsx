import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
    return (
        <div className="bg-background text-foreground flex flex-col min-h-screen relative">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* --- Navbar --- */}
            <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
                <div className="container h-16 flex items-center justify-between mx-auto px-4">
                    <a href="/" className="font-bold text-2xl font-mono gradient-text">
                        PAYME.EXE
                    </a>
                    <nav className="hidden md:flex gap-3">
                        <Button 
                            variant="ghost" 
                            className="border border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all duration-300"
                        >
                            LOGIN
                        </Button>
                        <Button className="retro-btn font-mono font-bold tracking-wider">
                            SIGN UP
                        </Button>
                    </nav>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="flex-grow relative z-10">
                {/* Hero Section */}
                <section className="text-center py-24 md:py-40 relative">
                    <div className="container mx-auto px-4 relative">
                        {/* Retro grid overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 bg-[length:50px_50px] bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)]"></div>
                        
                        <div className="relative z-10">
                            <div className="inline-block mb-6">
                                <span className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-sm font-mono tracking-wider text-primary animate-pulse">
                                    ● SYSTEM ONLINE
                                </span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tighter font-mono leading-tight float">
                                INSTANT PAYMENTS<br/>
                                <span className="retro-glow">RETRO STYLE</span>
                            </h1>
                            
                            <p className="mt-8 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground font-mono leading-relaxed">
                                &gt; The most secure way to transfer digital currency<br/>
                                &gt; Powered by quantum encryption protocols<br/>
                                &gt; Initialize your wallet in 3.2 seconds
                            </p>
                            
                            <div className="mt-12 flex justify-center gap-6">
                                <Button size="lg" className="retro-btn font-mono font-bold tracking-wider text-lg px-8 py-4 pulse-glow">
                                    ▶ INITIALIZE ACCOUNT
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="border-2 border-secondary/50 hover:border-secondary bg-transparent hover:bg-secondary/10 font-mono font-bold tracking-wider text-lg px-8 py-4"
                                >
                                    VIEW DEMO
                                </Button>
                            </div>
                            
                            <div className="mt-10 flex items-center justify-center gap-4 text-sm text-muted-foreground font-mono">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    SECURED BY RAZORPAY
                                </div>
                                <div className="w-px h-4 bg-border"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    256-BIT ENCRYPTION
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black gradient-text font-mono mb-4">
                                SYSTEM FEATURES
                            </h2>
                            <p className="text-muted-foreground font-mono">
                                &gt; Advanced payment protocols for the digital age
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="retro-card bg-card/50 backdrop-blur-sm">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center border border-primary/40">
                                        <span className="text-2xl text-primary font-bold">⚡</span>
                                    </div>
                                    <CardTitle className="font-mono text-primary tracking-wider">
                                        INSTANT P2P TRANSFER
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground font-mono leading-relaxed">
                                        &gt; Lightning-fast transactions<br/>
                                        &gt; Zero latency protocol<br/>
                                        &gt; No processing fees
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card className="retro-card bg-card/50 backdrop-blur-sm">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-lg mx-auto mb-4 flex items-center justify-center border border-secondary/40">
                                        <span className="text-2xl text-secondary font-bold">💳</span>
                                    </div>
                                    <CardTitle className="font-mono text-secondary tracking-wider">
                                        WALLET TOP-UP
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground font-mono leading-relaxed">
                                        &gt; Multiple payment methods<br/>
                                        &gt; UPI integration enabled<br/>
                                        &gt; Secure card processing
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card className="retro-card bg-card/50 backdrop-blur-sm">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-16 h-16 bg-accent/20 rounded-lg mx-auto mb-4 flex items-center justify-center border border-accent/40">
                                        <span className="text-2xl text-accent font-bold">🏦</span>
                                    </div>
                                    <CardTitle className="font-mono text-accent tracking-wider">
                                        BANK WITHDRAWAL
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground font-mono leading-relaxed">
                                        &gt; Direct bank transfers<br/>
                                        &gt; Real-time processing<br/>
                                        &gt; 24/7 availability
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="space-y-2">
                                <div className="text-3xl font-black gradient-text font-mono">99.9%</div>
                                <div className="text-sm text-muted-foreground font-mono">UPTIME</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-black gradient-text font-mono">&lt;1s</div>
                                <div className="text-sm text-muted-foreground font-mono">TRANSFER TIME</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-black gradient-text font-mono">256-BIT</div>
                                <div className="text-sm text-muted-foreground font-mono">ENCRYPTION</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-black gradient-text font-mono">24/7</div>
                                <div className="text-sm text-muted-foreground font-mono">SUPPORT</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="border-t border-primary/20 relative z-10">
                <div className="container py-8 text-center text-muted-foreground">
                    <div className="font-mono text-sm space-y-2">
                        <p>Developed by <span className="text-primary font-bold">Sudhanshu Jha</span></p>
                        <p>
                            Connect: 
                            <a 
                                href="YOUR_LINKEDIN_URL" 
                                className="text-secondary hover:text-secondary/80 transition-colors ml-2 underline"
                            >
                                LinkedIn
                            </a>
                        </p>
                        <div className="pt-4 text-xs opacity-70">
                            © 2025 Payme - Simple Digital Payments
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;