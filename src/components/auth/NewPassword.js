import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router';
import img from '../../assets/6078257.jpg'


const NewPassword = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const otpValue = location?.state?.otpValue || null;
    const email = location?.state?.email || "";
    const user_type = location?.state?.user_type



    const handleSubmit = async (e) => {
        e.preventDefault();


        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Passwords Do Not Match',
                text: 'Please ensure that the new password and confirm password fields match.',
            });
            return;
        }


        if (newPassword.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Password Too Short',
                text: 'Your new password must be at least 6 characters long.',
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios.put(
                'https://apis.agrisarathi.com/vendor/PasswordResetRequestAPIView',
                {
                    otp: otpValue,
                    email: email,
                    new_password: newPassword,
                    user_type: "vendor",

                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been successfully updated.',
                });

                navigate('/login');


                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'An error occurred while updating your password.',
            });
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
                <div className="w-full max-w-3xl md:px-20 bg-white p-5 rounded-2xl shadow-lg flex justify-center flex-col">
                    <h1 className="md:text-4xl text-xl font-bold text-[#00B251] text-center mb-4">
                        Reset Password
                    </h1>
                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Enter Your New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border rounded-md"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm Your New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 border rounded-md"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button
                                type="submit"
                                className="bg-[#00B251] text-white text-lg font-medium py-3 px-8 rounded-md hover:bg-[#00B251] md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
