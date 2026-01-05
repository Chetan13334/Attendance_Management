import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp } from '../../../services/authService';
import { API_BASE_URL } from '../../../utils/api';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Attempting to send OTP to:", email);
            console.log("Endpoint:", `${API_BASE_URL}/auth/forgot-password/send-otp`);
            const res = await sendOtp(email);
            console.log("OTP sent successfully:", res);
            // Navigate to Verify OTP page with email in state
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">Forgot Password?</h3>
                <p className="text-sm text-gray-500 mt-2">Enter your email to receive a verification code.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Sending...
                        </>
                    ) : (
                        "Send OTP"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/signin" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
