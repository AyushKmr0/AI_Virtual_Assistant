import React, { useContext, useState } from "react";
import bg from "../assets/authBG.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { serverUrl, setUserData } = useContext(userDataContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { name, email, password },
                { withCredentials: true }
            );
            setUserData(result.data);
            setLoading(false);
            navigate("/customize");
        } catch (error) {
            console.log(error);
            setUserData(null);
            setLoading(false);
            setErr(error.response?.data?.message || "Something went wrong");
        }
    };

    // OAuth Handler
    const handleOAuthLogin = (provider) => {
        window.open(`${serverUrl}/api/auth/${provider}`, "_self");
    };

    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#6a6a6a00] z-50 flex justify-center items-center backdrop-blur-sm">
                    <svg
                        className="w-22 h-22 animate-spin text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            <div className="w-full h-screen flex items-center bg-[#e3ebf1] relative overflow-hidden">
                <div
                    className="hidden lg:flex w-1/2 h-full items-center justify-end pr-[40px] animate-bounce-slow"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "right center",
                    }}
                />
                <div
                    className="lg:hidden absolute inset-0 bg-no-repeat bg-contain bg-center animate-slide-in pointer-events-none"
                    style={{ backgroundImage: `url(${bg})` }}
                />

                <div className="w-full lg:w-1/2 h-full flex items-center justify-center lg:justify-start px-5 lg:pl-[20px] z-10">
                    <form
                        className="w-full max-w-[500px] bg-[#cecece83] rounded-xl backdrop-blur flex flex-col items-center justify-center gap-[15px] px-[40px] py-[20px] shadow-lg shadow-blue-700/40"
                        onSubmit={handleSignUp}
                    >
                        <h1 className="text-neutral-800 text-[30px] font-semibold mb-[20px]">
                            Register to{" "}
                            <span className="text-blue-700">
                                Virtual Assistant
                            </span>
                        </h1>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full h-[40px] outline-none border-3 rounded-xl border-gray-500 focus:border-blue-700 bg-transparent text-neutral-800 placeholder-gray-500 px-[20px] py-1 text-sm"
                            required
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            disabled={loading}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full h-[40px] outline-none border-3 rounded-xl border-gray-500 focus:border-blue-700 bg-transparent text-neutral-800 placeholder-gray-500 px-[20px] py-[4px] text-sm"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            disabled={loading}
                        />

                        <div className="relative w-full h-[40px]">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full h-[40px] outline-none border-3 rounded-xl border-gray-500 focus:border-blue-700 bg-transparent text-neutral-800 placeholder-gray-500 px-5 pr-12 text-sm"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                disabled={loading}
                            />
                            {!showPassword ? (
                                <IoEye
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-700 text-2xl cursor-pointer"
                                    onClick={() => setShowPassword(true)}
                                />
                            ) : (
                                <IoEyeOff
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-700 text-2xl cursor-pointer"
                                    onClick={() => setShowPassword(false)}
                                />
                            )}
                        </div>

                        {err.length > 0 && (
                            <p className="text-red-500">*{err}</p>
                        )}

                        <button
                            className="mt-3 w-full bg-blue-700 text-white text-sm py-3 rounded-xl hover:bg-blue-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Sign Up"}
                        </button>

                        <div className="w-full flex items-center gap-4 my-2">
                            <hr className="flex-1 border-gray-400" />
                            <span className="text-gray-500">or</span>
                            <hr className="flex-1 border-gray-400" />
                        </div>

                        <div className="w-full flex flex-col gap-3 mb-2">
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin("google")}
                                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-xl py-2 hover:bg-blue-100 transition"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="google"
                                    className="w-5 h-5 mr-2"
                                />
                                Continue with Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin("github")}
                                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-xl py-2 hover:bg-blue-100 transition"
                            >
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                                    alt="github"
                                    className="w-5 h-5 mr-2"
                                />
                                Continue with GitHub
                            </button>
                        </div>

                        <p className="text-neutral-800 text-m">
                            Already have an account?{" "}
                            <span
                                className="text-blue-700 cursor-pointer"
                                onClick={() => navigate("/signin")}
                            >
                                Sign In
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;
