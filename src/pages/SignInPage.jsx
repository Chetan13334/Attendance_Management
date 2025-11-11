import React from 'react';
import SignInForm from '../components/auth/signin/SignInForm';
import AttendifyLogo from '../components/Logo/Attendify';

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <AttendifyLogo />
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
                <SignInForm />

            </div>

        </div>
    );
};

export default SignInPage;