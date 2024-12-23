import React, { useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import img from '../../assets/6078257.jpg'

const Opt = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const otpValue = location?.state?.otpValue || null;
    const email = location?.state?.email || "";
    const user_type = location?.state?.user_type

    const handleChange = (value) => {
        setOtp(value);
    };

    const handleSubmit = () => {
        if (otp?.length === 6) {
            if (otp == otpValue) {
                Swal.fire({
                    title: 'Success!',
                    text: 'OTP verified successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/newpassword',{state:{otpValue: otpValue, email: email, user_type: user_type}});
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'OTP does not match. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            }
        } else {
            Swal.fire({
                title: 'Invalid Input',
                text: 'Please enter a valid 6-digit OTP.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
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
            <div className="w-full max-w-3xl bg-white p-4 rounded-2xl shadow-lg flex justify-center flex-col">
                <h1 className="md:text-4xl text-xl font-bold text-[#00B251] text-center mb-4">
                    Enter OTP
                </h1>
                <p className="text-center mb-8">
                    Please provide the OTP that we sent in your email address.
                </p>

                <div className="md:px-20 ">
                    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                        <MuiOtpInput
                            value={otp}
                            onChange={handleChange}
                            length={6}
                            type="number"
                            gap={2}
                        />
                    </Box>
                </div>

                <div className="my-8 text-center">
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className={`bg-[#00B251] text-white text-lg font-medium py-3 px-8 rounded-md hover:bg-[#00B251] md:w-1/2 transform hover:scale-105 transition-transform duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Opt;
