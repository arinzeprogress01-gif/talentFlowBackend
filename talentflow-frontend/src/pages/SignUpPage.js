import React, { useState } from 'react';
import { Mail, Lock, User, Check } from 'lucide-react';
import InputField from '../components/InputField.js';
import Button from '../components/Button.js';
import Logo from '../components/Logo.js';
import PageTransition from '../components/PageTransition.js';
import AuthLayout from '../components/AuthLayout.js';

const SignUpPage = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordReqs, setPasswordReqs] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false
    });

    const validatePassword = (value) => {
        const reqs = {
            length: value.length >= 8,
            upper: /[A-Z]/.test(value),
            lower: /[a-z]/.test(value),
            number: /\d/.test(value)
        };
        setPasswordReqs(reqs);
        return Object.values(reqs).every(Boolean);
    };

    const handleNavigate = (href) => {
        setIsTransitioning(true);
        setTimeout(() => {
            window.location.href = href;
        }, 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};



        if (!/^[a-zA-Z\s'-]+$/.test(formData.fullname)) {
            newErrors.fullname = 'Name can only contain letters, spaces, hyphens and apostrophes';
        }

        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password does not meet all requirements';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const res = await fetch("http://localhost:5000/api/auth/register", {
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

                alert(`Your TF ID: ${data.tfId}`);

                handleNavigate('/login');

            } catch (error) {
                console.error(error);
                alert("Registration failed");
            }
        } // Submit form - on success navigate to role selection
            
    };

    return (
        <>
            <PageTransition
                isActive={isTransitioning}
                text="Joining TalentFlow..."
            />
            <div className={`animate-fadeIn ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>

                <AuthLayout
                    illustrationSrc="/img/tf-signup.png"
                    illustrationAlt="Team collaborating"
                    tagline="Where Learning Meets Real-World Impact"
                >
                    <Logo onClick={() => console.log('Logo clicked!')} />

                    <h1 className="font-bold leading-none m-0 text-2xl text-center text-gray-900">
                        Join TalentFlow
                    </h1>
                    <p className="leading-snug mb-6 mt-1 text-center text-gray-600">
                        Start your collaborative learning journey
                    </p>

                    <div className="
          bg-white rounded-2xl p-4 sm:p-6 md:p-7
          shadow-lg border border-gray-100
          transition-all duration-300
          focus-within:shadow-xl focus-within:border-primary-light
        ">
                        <h2 className="font-bold mb-5 text-gray-900 text-xl">Create Account</h2>

                        <form onSubmit={handleSubmit}>
                            <InputField
                                id="fullname"
                                label="Full Name"
                                placeholder="Love John"
                                icon={User}
                                required
                                minLength={2}
                                maxLength={50}
                                pattern="[a-zA-Z\s'-]+"
                                title="Please enter your full name (2-50 characters, letters and spaces only)"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                error={errors.fullname}
                            />

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
                                error={errors.email}
                            />

                            <InputField
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Create a password"
                                icon={Lock}
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    validatePassword(e.target.value);
                                }}
                                error={errors.password}
                                showPasswordToggle
                            />

                            {/* Password Requirements */}
                            <div className="flex flex-wrap gap-2 mb-4 mt-2 text-gray-500 text-sm">
                                {[
                                    { key: 'length', label: '8+ characters' },
                                    { key: 'upper', label: 'Uppercase' },
                                    { key: 'lower', label: 'Lowercase' },
                                    { key: 'number', label: 'Number' }
                                ].map(({ key, label }) => (
                                    <span
                                        key={key}
                                        className={`
                    flex items-center gap-1.5
                    ${passwordReqs[key] ? 'text-primary' : ''}
                  `}
                                    >
                                        <span className={`
                    w-3.5 h-3.5 rounded-full border-2
                    flex items-center justify-center
                    ${passwordReqs[key]
                                                ? 'bg-primary border-primary'
                                                : 'border-gray-300'
                                            }
                  `}>
                                            {passwordReqs[key] && (
                                                <Check size={10} className="text-white" />
                                            )}
                                        </span>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <InputField
                                id="confirm-password"
                                type="password"
                                label="Confirm Password"
                                placeholder="Confirm your Password"
                                icon={Lock}
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                showPasswordToggle
                            />

                            <Button type="submit" variant="primary" fullWidth className="mb-4">
                                Create Account
                            </Button>
                        </form>

                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => handleNavigate('/login')}
                                className="font-medium hover:text-primary-dark hover:underline text-primary"
                            >
                                Log In
                            </button>
                        </p>
                    </div>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        By signing up, you agree to our{' '}
                        <button type="button" className="hover:underline text-gray-600">Terms of Service</button>
                        {' '}and{' '}
                        <button type="button" className="hover:underline text-gray-600">Privacy Policy</button>
                    </p>
                </AuthLayout>
            </div>
        </>
    );
};

export default SignUpPage;