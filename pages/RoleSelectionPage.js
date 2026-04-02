import React, { useState } from 'react';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo.js';
import PageTransition from '../components/PageTransition.js';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2500);
    };

    return (
        <>
            <PageTransition isActive={isTransitioning} text="Setting up your experience..." />
            <div className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <div className="flex justify-center mb-8">
                    <Logo size="sm" />
                </div>

                <h1 className="font-bold mb-2 text-3xl text-center text-gray-900">
                    Choose Your Role
                </h1>
                <p className="mb-12 text-center text-gray-600">
                    How would you like to use TalentFlow?
                </p>

                <div className="gap-6 grid grid-cols-1 max-w-3xl md:grid-cols-2 w-full">
                    {/* Learner Card */}
                    <button
                        type="button"
                        onClick={() => handleNavigate('/verify-learner')}
                        className="bg-white border-2 border-gray-100 duration-300 flex flex-col group hover:border-primary hover:shadow-xl items-start p-8 rounded-2xl text-left transition-all"
                    >
                        <div className="bg-mint/30 flex group-hover:bg-mint/50 h-14 items-center justify-center mb-6 rounded-xl transition-colors w-14">
                            <BookOpen className="h-7 text-primary w-7" />
                        </div>
                        <h2 className="font-semibold mb-3 text-gray-900 text-xl">Learner</h2>
                        <p className="leading-relaxed mb-6 text-gray-600 text-sm">
                            Join courses, collaborate with peers, and build practical solutions
                        </p>
                        <span className="flex font-medium gap-1 group-hover:gap-2 items-center text-primary text-sm transition-all">
                            Continue as Learner <ArrowRight className="h-4 w-4" />
                        </span>
                    </button>

                    {/* Tutor Card */}
                    <button
                        type="button"
                        onClick={() => handleNavigate('/verify-tutor')}
                        className="bg-white border-2 border-gray-100 duration-300 flex flex-col group hover:border-primary hover:shadow-xl items-start p-8 rounded-2xl text-left transition-all"
                    >
                        <div className="bg-orange-100 flex group-hover:bg-orange-200 h-14 items-center justify-center mb-6 rounded-xl transition-colors w-14">
                            <Users className="h-7 text-orange-600 w-7" />
                        </div>
                        <h2 className="font-semibold mb-3 text-gray-900 text-xl">Tutor</h2>
                        <p className="leading-relaxed mb-6 text-gray-600 text-sm">
                            Create courses, mentor learners, and share your expertise
                        </p>
                        <span className="flex font-medium gap-1 group-hover:gap-2 items-center text-primary text-sm transition-all">
                            Continue as Tutor <ArrowRight className="h-4 w-4" />
                        </span>
                    </button>
                </div>

                <p className="mt-12 text-center text-gray-500 text-xs">
                    You can switch roles anytime from your account settings
                </p>
            </div>
        </>
    );
};

export default RoleSelectionPage;