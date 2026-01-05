import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../../../services/authService';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

const VerifyOtpForm = () => {
    const { state } = useLocation();
    const email = state?.email;
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resendTimer, setResendTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password'); // Redirect if no email in state
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await verifyOtp(email, otp);
            // Assuming response contains a short-lived reset token or we just pass success to next step
            // The backend prompt said "after verification: Generate a short-lived reset token"
            // So we expect `response.token` or similar.
            const resetToken = response.resetToken || response.token;

            navigate('/reset-password', { state: { email, token: resetToken } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        setError(null);
        try {
            await sendOtp(email);
            setResendTimer(60); // Reset timer to 60s
            // Optional success message for resend
        } catch (err) {
            setError("Failed to resend OTP.");
        } finally {
            setIsResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="w-full">
            <div className="mb-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Verify OTP</h3>
                <p className="text-sm text-gray-500 mt-2">
                    We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP Code</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="block w-full text-center tracking-[0.5em] text-2xl py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                        placeholder="000000"
                        maxLength={6}
                        disabled={loading}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Didn't receive code?</span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || isResending}
                        className={`font-medium flex items-center ${resendTimer > 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-500'
                            }`}
                    >
                        {isResending ? (
                            <Loader2 className="animate-spin h-3 w-3 mr-1" />
                        ) : resendTimer > 0 ? (
                            `Resend in ${resendTimer}s`
                        ) : (
                            <>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Resend
                            </>
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Verifying...
                        </>
                    ) : (
                        "Verify & Proceed"
                    )}
                </button>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                        Change Email
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default VerifyOtpForm;
