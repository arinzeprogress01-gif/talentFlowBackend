import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../components/Button.js';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || { email: 'your email' };

    const handleTryAgain = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="bg-white flex items-center justify-center min-h-screen p-6">
            <div className="max-w-md w-full">
                {/* Mail Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-primary flex h-16 items-center justify-center rounded-2xl w-16">
                        <Mail size={32} className="text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="font-bold mb-2 text-2xl text-center text-gray-900">
                    Check Your Email
                </h1>
                <p className="mb-2 text-center text-gray-600">
                    We've sent password reset instructions to
                </p>
                <p className="font-medium mb-8 text-center text-primary">
                    {email}
                </p>

                {/* Info Box */}
                <div className="bg-white mb-6 p-8 rounded-2xl shadow-lg">
                    <p className="mb-4 text-center text-gray-600">
                        Click the link in the email to reset your password. The link will expire in 24 hours.
                    </p>

                    <p className="text-center text-gray-600">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                            onClick={handleTryAgain}
                            className="font-medium hover:underline text-primary"
                        >
                            try again
                        </button>
                    </p>
                </div>

                {/* Back to Login */}
                <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/login')}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                </Button>
            </div>
        </div>
    );
};

export default CheckEmailPage;