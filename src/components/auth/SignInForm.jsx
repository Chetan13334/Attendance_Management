import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignInForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            alert("Signed in successfully!");
            navigate("/dashboard"); // redirect after login
        } catch (error) {
            console.error(error);
            setErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                </a>
            </div>

            {/* Submit Error */}
            {errors.submit && <p className="text-xs text-red-600 text-center">{errors.submit}</p>}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                </Link>
                <button type="button" class="w-full flex items-center justify-center gap-5 py-2.5 px-6 text-[15px] font-medium tracking-wide text-slate-900 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 focus:outline-none cursor-pointer mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" class="inline" viewBox="0 0 512 512">
                        <path fill="#fbbd00"
                            d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                            data-original="#fbbd00" />
                        <path fill="#0f9d58"
                            d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                            data-original="#0f9d58" />
                        <path fill="#31aa52"
                            d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                            data-original="#31aa52" />
                        <path fill="#3c79e6"
                            d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                            data-original="#3c79e6" />
                        <path fill="#cf2d48"
                            d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                            data-original="#cf2d48" />
                        <path fill="#eb4132"
                            d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                            data-original="#eb4132" />
                    </svg>
                    Continue with google
                </button>
            </div>
        </form>
    );
};

export default SignInForm;
