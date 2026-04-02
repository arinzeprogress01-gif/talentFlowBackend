import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField.js';
import Button from '../components/Button.js';
import Logo from '../components/Logo.js';
import PageTransition from '../components/PageTransition.js';
import AuthLayout from '../components/AuthLayout.js';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleNavigate = (href) => {
        setIsTransitioning(true);
        setTimeout(() => {
            window.location.href = href;
        }, 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            // ✅ SAVE TOKEN
            localStorage.setItem("token", data.token);

            // ✅ NAVIGATE ONLY AFTER SUCCESS
            handleNavigate('/choose-role');

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };
    return (
        <>
            <PageTransition
                isActive={isTransitioning}
                text="Joining TalentFlow..."
            />
            <div className={`animate-fadeIn ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <AuthLayout
                    isLogin={true}
                    illustrationSrc="/img/tf-login.png"
                    illustrationAlt="Person working with technology"
                    tagline="Where Learning Meets Real-World Impact"
                >
                    <Logo onClick={() => console.log('Logo clicked!')} />

                    <h1 className="font-bold leading-none m-0 text-2xl text-center text-gray-900">
                        Welcome to TalentFlow
                    </h1>
                    <p className="leading-snug mb-6 mt-1 text-center text-gray-600">
                        Collaborate, learn, and build practical solutions
                    </p>

                    <div className="
          bg-white rounded-2xl p-4 sm:p-6 md:p-7
          shadow-lg border border-gray-100
          transition-all duration-300
          hover:shadow-xl hover:-translate-y-1
        ">
                        <h2 className="font-bold mb-5 text-gray-900 text-xl">Log In</h2>

                        <form onSubmit={handleSubmit}>
                            <InputField
                                id="email"
                                type="email"
                                label="Email Address"
                                placeholder="Your email@example.com"
                                icon={Mail}
                                required
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <InputField
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                icon={Lock}
                                required
                                minLength={8}
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                                title="Password must be at least 8 characters with uppercase, lowercase, and number"
                                showPasswordToggle
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />

                            <button
                                type="button"
                                onClick={() => handleNavigate('/forgot-password')}
                                className="w-full text-right text-sm text-primary
                hover:text-primary-dark hover:underline
                transition-colors -mt-2 mb-4"
                            >
                                Forgot Password?
                            </button>

                            <Button type="submit" variant="primary" fullWidth>
                                Log In
                            </Button>
                        </form>

                        <div className="flex items-center my-5 text-gray-400 text-sm">
                            <div className="bg-gray-200 flex-1 h-px" />
                            <span className="px-4">Or continue with</span>
                            <div className="bg-gray-200 flex-1 h-px" />
                        </div>

                        <Button variant="secondary" fullWidth>
                            <img src="/img/google-icon.svg" alt="Google" className="h-5 w-5" />
                            Sign in with Google
                        </Button>

                        <p className="mt-4 text-center text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => handleNavigate('/signup')}
                                className="font-medium hover:text-primary-dark hover:underline text-primary"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>

                    <p className="mt-5 text-center text-gray-500 text-sm">
                        By logging in, you agree to our{' '}
                        <button className="hover:underline text-gray-600">Terms of Service</button>
                        {' '}and{' '}
                        <button className="hover:underline text-gray-600">Privacy Policy</button>
                    </p>
                </AuthLayout>
            </div>
        </>
    );
};

export default LoginPage;