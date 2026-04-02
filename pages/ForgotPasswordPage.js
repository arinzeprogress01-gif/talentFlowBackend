import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import InputField from '../components/InputField.js';
import Button from '../components/Button.js';
import Logo from '../components/Logo.js';
import PageTransition from '../components/PageTransition.js';
import AuthLayout from '../components/AuthLayout.js';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            navigate('/check-email', { state: { email } });

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <PageTransition
                isActive={isTransitioning}
                text="One moment..."
            />
            <div className={`animate-fadeIn ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <AuthLayout
                    isLogin={true}
                    illustrationSrc="/img/tf-login.png"
                    illustrationAlt="Password security"
                    tagline="Secure your account"
                >
                    <div className="flex justify-center mb-6">
                        <Logo size="sm" />
                    </div>

                    <h1 className="font-bold mb-2 text-2xl text-center text-gray-900">
                        Forgot Password?
                    </h1>
                    <p className="mb-8 text-center text-gray-600">
                        No worries, we'll send you reset instructions
                    </p>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                        <InputField
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="Your email@example.com"
                            icon={Mail}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button type="submit" variant="primary" fullWidth>
                            Send Reset Link
                        </Button>

                        <button
                            type="button"
                            onClick={() => handleNavigate('/login')}
                            className="flex gap-2 hover:text-primary items-center justify-center mt-6 text-gray-600 transition-colors w-full"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </button>
                    </form>
                </AuthLayout>
            </div>
        </>
    );
};

export default ForgotPasswordPage;