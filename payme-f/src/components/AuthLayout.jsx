import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, description }) => {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Link to="/" className="absolute top-8 left-8 text-3xl font-black font-['Orbitron'] gradient-text">
                PAYME
            </Link>
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-['Orbitron'] retro-glow">{title}</h1>
                    <p className="text-muted-foreground font-['Space Mono'] mt-3 text-lg">{description}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;