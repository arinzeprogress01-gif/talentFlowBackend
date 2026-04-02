import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import SignUpPage from './pages/SignUpPage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import CheckEmailPage from './pages/CheckEmailPage.js';
import RoleSelectionPage from './pages/RoleSelectionPage.js';
import LearnerVerificationPage from './pages/LearnerVerificationPage.js';
import TutorVerificationPage from './pages/TutorVerificationPage.js';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/check-email" element={<CheckEmailPage />} />
                <Route path="/choose-role" element={<RoleSelectionPage />} />
                <Route path="/verify-learner" element={<LearnerVerificationPage />} />
                <Route path="/verify-tutor" element={<TutorVerificationPage />} />
                <Route path="/" element={<Navigate to="/signup" replace />} />
            </Routes>
        </Router>
    );
}

export default App;