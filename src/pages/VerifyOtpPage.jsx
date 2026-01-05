import React from 'react';
import VerifyOtpForm from '../components/auth/forgot-password/VerifyOtpForm';
import AttendifyLogo from '../components/Logo/Attendify';

const VerifyOtpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <AttendifyLogo />
                </div>
                <VerifyOtpForm />
            </div>
        </div>
    );
};

export default VerifyOtpPage;
