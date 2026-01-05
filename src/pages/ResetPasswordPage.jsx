import React from 'react';
import ResetPasswordForm from '../components/auth/forgot-password/ResetPasswordForm';
import AttendifyLogo from '../components/Logo/Attendify';

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <AttendifyLogo />
                </div>
                <ResetPasswordForm />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
