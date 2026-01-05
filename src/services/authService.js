import api from '../utils/api';

export const sendOtp = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password/send-otp', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const response = await api.post('/auth/forgot-password/verify-otp', { email, otp });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (email, token, newPassword) => {
    try {
        const response = await api.post('/auth/forgot-password/reset', {
            email,
            token,
            newPassword,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
