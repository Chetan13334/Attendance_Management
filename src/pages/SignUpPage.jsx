import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import AttendifyLogo from '../components/Logo/Attendify';

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <AttendifyLogo />

                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Sign up to get started with Attendance Management
                </p>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpPage;
