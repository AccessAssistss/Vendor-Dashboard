import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import OtpGenerator from './OtpGenerator';
import img from '../../assets/6078257.jpg'

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(null)


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire('Error', 'Please enter a valid email address.', 'error');
            return;
        }
        const otpVal = OtpGenerator()
        setOtp(otpVal)
        setLoading(true);
        console.log(otpVal)

        try {
            const response = await axios.post('https://apis.agrisarathi.com/vendor/PasswordResetRequestAPIView', {
                email: email,
                user_type: "vendor",
                otp: otpVal,
            });


            if (response.status === 200) {
                Swal.fire('Success', 'OTP is send in your email .', 'success');
                navigate("/opt", { state: { otpValue: otpVal, email: email, user_type: "fpo" } });
            } else {
                Swal.fire('Error', 'Failed to send reset email. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full h-screen flex">
                {/* Left side for Image */}
                <div className="w-1/2 hidden md:block">
                    <img
                        src={img}
                        alt="Login Image"
                        className="w-full h-full"
                    />
                </div>
                <div className="w-full max-w-3xl md:px-20 bg-white p-4 rounded-2xl shadow-lg flex justify-center flex-col">
                    <h1 className="md:text-4xl text-xl font-bold text-[#00B251] text-center mb-4">
                        Forgot Your Password
                    </h1>
                    <p className="text-center mb-8">
                        Please provide the email address that you used when you signed up for your account.
                    </p>
                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Email Id
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Your Email Id"
                                className="w-full p-3 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <p className="text-center mb-8">
                                We will send you an email that will allow you to reset your password.
                            </p>
                        </div>
                        <div className="my-8 text-center">
                            <button
                                type="submit"
                                className={`bg-[#00B251] text-white text-lg font-medium py-3 px-8 rounded-md hover:bg-[#00B251] md:w-1/2 transform hover:scale-105 transition-transform duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                    {/* <Divider />
                <div className="mt-5 text-center">
                    <button
                        onClick={() => navigate("/ragistration")}
                        className=" text-[#00B251] text-lg font-medium py-3 px-8 rounded-md  md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                    >
                        Sign Up
                    </button>
                </div> */}
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
