import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import img from '../../assets/6078257.jpg'

const Registration = () => {
    const navigate = useNavigate();


    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!name || !phone || !email || !password || !confirmPassword) {
            Swal.fire('Warning', 'All fields are required!', 'warning');
            return;
        }
    
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match!', 'error');
            return;
        }
    
        const userData = {
            mobile: phone,
            password: password,
            email: email,
            user_type: "vendor",
            name: name
        };
    
        try {
            const response = await axios.post(
                'https://apis.agrisarathi.com/vendor/VendorRegistration',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.status === 201) {
                Swal.fire('Success', 'Registration successful!', 'success');
                navigate("/login");  // Navigate to home after successful registration
            } else {
                Swal.fire('Error', response.data.message || 'User with this mobile number already exists!', 'error');
            }
        } catch (error) {
            console.error("API Error:", error);
    
            if (error.response) {
                console.error("API Response Error:", error.response);
    
                // Check if the error response contains the specific message for duplicate mobile number
                if (error.response.data && error.response.data.message === "User with this mobile number already exists") {
                    Swal.fire('Error', 'User with this mobile number already exists', 'error');
                } else {
                    Swal.fire('Error', error.response.data.message || 'User with this mobile number already exists! Try with another number', 'error');
                }
            } else if (error.request) {
                console.error("API No Response:", error.request);
                Swal.fire('Error', 'No response from the server. Please check your connection or try again later.', 'error');
            } else {
                console.error("API Error:", error.message);
                Swal.fire('Error', 'Failed to register. Please try again later.', 'error');
            }
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full h-screen flex ">
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
                        Create an account
                    </h1>
                    <p className="text-center mb-8">
                        Fill in your details below, and we’ll be in touch with the next steps
                    </p>
                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                className="w-full p-3 border rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}

                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter Your Phone Number"
                                className="w-full p-3 border rounded-md"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}

                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email Id</label>
                            <input
                                type="email"
                                placeholder="Enter Your Email Id"
                                className="w-full p-3 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Enter Your Password"
                                    className="w-full p-3 border rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}

                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm Your Password"
                                    className="w-full p-3 border rounded-md"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}

                                />
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                type="submit"
                                className="bg-[#00B251] text-white text-lg font-medium py-3 px-8 rounded-md hover:bg-[#00B251] md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center justify-center space-x-2 mt-5">
                        <p className="md:text-lg text-gray-700">Already have an account?</p>
                        <button onClick={() => navigate("/login")} className="text-[#00B251] md:text-lg">Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
