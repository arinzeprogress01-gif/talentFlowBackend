import React, { useState } from 'react';
import { User, Hash, BookOpen, CheckCircle, ArrowLeft, Award } from 'lucide-react';
import InputField from '../components/InputField.js';
import Button from '../components/Button.js';
import Logo from '../components/Logo.js';
import PageTransition from '../components/PageTransition.js';
import { useNavigate } from 'react-router-dom';

const TutorVerificationPage = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        referenceNumber: '',
        course: ''
    });
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to tutor dashboard after verification
        handleNavigate('/tutor-dashboard');
    };

    const courses = [
        'Web Development Fundamentals',
        'Data Science Essentials',
        'UI/UX Design Principles',
        'Mobile App Development',
        'Cloud Computing Basics',
        'Cybersecurity Fundamentals'
    ];

    return (
        <>
            <PageTransition isActive={isTransitioning} text="Verifying instructor credentials..." />
            <div className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <div className="flex justify-center mb-6">
                    <Logo size="sm" />
                </div>

                <h1 className="font-bold mb-2 text-2xl text-center text-gray-900">
                    Tutor Verification
                </h1>
                <p className="mb-8 text-center text-gray-600">
                    Verify your credentials to access your instructor dashboard
                </p>

                <div className="max-w-md w-full">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 mb-6 p-4 rounded-xl">
                        <div className="flex gap-3 items-start">
                            <CheckCircle className="flex-shrink-0 h-5 mt-0.5 text-primary w-5" />
                            <div>
                                <p className="font-medium text-gray-900 text-sm">Instructor Verification</p>
                                <p className="mt-1 text-gray-600 text-sm">
                                    Please enter your full name and tutor reference number to verify your instructor account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <InputField
                                id="fullName"
                                type="text"
                                label="Full Name"
                                placeholder="Mr Williams David"
                                icon={User}
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            <p className="mt-1 text-gray-500 text-xs">Enter your name as it appears in your instructor profile</p>
                        </div>

                        <div>
                            <InputField
                                id="referenceNumber"
                                type="text"
                                label="Tutor Reference Number"
                                placeholder="TRN-2026-XXXXX"
                                icon={Hash}
                                required
                                value={formData.referenceNumber}
                                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                            />
                            <p className="mt-1 text-gray-500 text-xs">This was provided when your instructor application was approved</p>
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-gray-700 text-sm">
                                Select Your Course
                            </label>
                            <div className="relative">
                                <BookOpen className="-translate-y-1/2 absolute h-5 left-4 text-gray-400 top-1/2 w-5" />
                                <select
                                    id="course"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    className="appearance-none bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary pl-12 pr-4 py-3.5 rounded-lg text-gray-600 transition-all w-full"
                                    required
                                >
                                    <option value="" disabled>Choose a course to teach</option>
                                    {courses.map((course) => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                                <div className="-translate-y-1/2 absolute pointer-events-none right-4 top-1/2">
                                    <svg className="h-5 text-gray-400 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-1 text-gray-500 text-xs">You can teach additional courses after verification</p>
                        </div>

                        {/* Help Section */}
                        <div className="bg-gray-50 mt-6 p-4 rounded-xl">
                            <p className="font-medium mb-3 text-gray-900 text-sm">Where to find your tutor reference number:</p>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex gap-2 items-center">
                                    <span className="bg-primary flex-shrink-0 h-1.5 rounded-full w-1.5"></span>
                                    Check your instructor approval email
                                </li>
                                <li className="flex gap-2 items-center">
                                    <span className="bg-primary flex-shrink-0 h-1.5 rounded-full w-1.5"></span>
                                    Look for the subject line "TalentFlow Instructor Approved"
                                </li>
                                <li className="flex gap-2 items-center">
                                    <span className="bg-primary flex-shrink-0 h-1.5 rounded-full w-1.5"></span>
                                    Format: TRN-2026-XXXXX (Tutor Reference Number)
                                </li>
                                <li className="flex gap-2 items-center">
                                    <span className="bg-primary flex-shrink-0 h-1.5 rounded-full w-1.5"></span>
                                    Also available in your instructor account settings
                                </li>
                            </ul>
                        </div>

                        <Button type="submit" variant="primary" fullWidth>
                            <CheckCircle className="h-5 w-5" />
                            Verify & Continue
                        </Button>

                        <p className="text-center text-gray-600 text-sm">
                            Need help with verification?{' '}
                            <button type="button" className="font-medium hover:underline text-primary">
                                Contact Instructor Support
                            </button>
                        </p>
                    </form>
                </div>

                <button
                    type="button"
                    onClick={() => handleNavigate('/choose-role')}
                    className="flex gap-2 hover:text-primary items-center justify-center mt-8 text-gray-600 text-sm transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Role Selection
                </button>
            </div>
        </>
    );
};

export default TutorVerificationPage;