import React from 'react';
import ForgotPasswordForm from '../components/auth/forgot-password/ForgotPasswordForm';
import AttendifyLogo from '../components/Logo/Attendify';

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <AttendifyLogo />
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
