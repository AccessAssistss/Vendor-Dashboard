import React, { useState, useEffect } from "react";
import {
    Avatar,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router";
import { UploadFileOutlined } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../Navbar";

const Profile = () => {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        state: "",
        district: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        villageTown: "",
        pinCode: "",
    });

    // Function to fetch the profile data
    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get("https://apis.agrisarathi.com/fposupplier/UserProfileView", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const profile = response?.data?.data?.profile;
            setFormData({
                ...formData,
                name: profile.fpo_name,
                phone: profile.mobile,
                email: profile.email,
                address: profile.address,
                state: profile.state,
                district: profile.district,
                villageTown: profile.village || "", // Adjust field names accordingly
            });

            setImage(profile.profile); // Set the profile image
            setLogoImage(profile.company_logo); // Set the profile image
        } catch (error) {
            setError('Error fetching profile data.');
            console.error(error);
        }
    };

    const fetchStates = async () => {
        setLoadingStates(true);
        try {
            const response = await axios.get("https://apis.agrisarathi.com/home/GetStates?user_language=1");
            setStates(response.data.states_data || []);
        } catch (error) {
            setError('Error fetching states.');
        } finally {
            setLoadingStates(false);
        }
    };

    const fetchDistricts = async () => {
        if (formData.state) {
            setLoadingDistricts(true);
            try {
                const response = await axios.get(
                    `https://apis.agrisarathi.com/home/GetStateDistrictsASuperadamin?state=${formData.state}&user_language=1`
                );
                setDistricts(response.data?.states_data || []);
            } catch (error) {
                setError('Error fetching districts.');
            } finally {
                setLoadingDistricts(false);
            }
        } else {
            setDistricts([]);
        }
    };

    useEffect(() => {
        fetchStates();
        fetchProfileData(); // Fetch the user profile when component mounts
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [formData.state]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            uploadProfileImage(file);
        }
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoImage(URL.createObjectURL(file));
            uploadCompanyLogo(file);
        }
    };

    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append("profile", file);
        formData.append("filter_type", "profile");

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                "https://apis.agrisarathi.com/fposupplier/UpdateProfilePicture",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.message) {
                Swal.fire("Success", "Profile image updated!", "success");
            } else {
                Swal.fire("Error", "Failed to update profile image.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error uploading profile image.", "error");
        }
    };

    const uploadCompanyLogo = async (file) => {
        const formData = new FormData();
        formData.append("profile", file);
        formData.append("filter_type", "company");

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                "https://apis.agrisarathi.com/fposupplier/UpdateProfilePicture",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.message) {
                Swal.fire("Success", "Company logo updated!", "success");
            } else {
                Swal.fire("Error", "Failed to update company logo.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error uploading company logo.", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.state || !formData.district || !formData.villageTown) {
            Swal.fire("Warning", "Please fill all the required fields.", "warning");
            return;
        }

        const payload = {
            mobile_no: formData.phone,
            fpo_name: formData.name,
            address: formData.address,
            village: formData.villageTown,
            email: formData.email,
            state_id: formData.state,
            district_id: formData.district,
        };

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                "https://apis.agrisarathi.com/fposupplier/UpdateProfile",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.message) {
                Swal.fire("Success", "Profile updated successfully!", "success");
                navigate("/bankdetails");
            } else {
                Swal.fire("Error", "Failed to update profile.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "There was an issue with the API request.", "error");
        }
    };

    return (
        <>
            <Navbar />
            <div className=" bg-gray-50 h-screen w-screen md:p-16 mt-16">
                <div className="flex justify-center items-center space-x-4 mb-6 md:p-0 p-5">
                    <div className="flex items-center space-x-2">
                        <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
                        <button onClick={()=>(navigate('/profile'))}>
                        <span className="text-sm text-gray-700">Profile details</span>
                        </button>
                    </div>
                    {/* <div className="w-16 h-[2px] bg-gray-400" />
                    <div className="flex items-center space-x-2">
                        <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-gray-400" />
                        <button onClick={()=>(navigate('/shopdetails'))}>
                        <span className="text-sm text-gray-700">Shop Details</span>
                        </button>
                    </div> */}
                    <div className="w-16 h-[2px] bg-gray-400" />
                    <div className="flex items-center space-x-2">
                        <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-gray-400" />
                        <button onClick={()=>(navigate('/bankdetails'))}>
                        <span className="text-sm text-gray-700">Bank Details</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form className="bg-white shadow-lg rounded-xl md:mt-10" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
                        {/* Left Section */}
                        <div>
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <Avatar
                                    src={image || "https://via.placeholder.com/100"}
                                    sx={{ width:'120px',height:'120px' }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="mt-2"
                                    id="image-upload"
                                    hidden
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="text" component="span">
                                        Upload
                                    </Button>
                                </label>
                            </div>

                            {/* Profile Image Preview */}
                            {/* {image && (
                                <div className="mt-2 text-center">
                                    <img
                                        src={image}
                                        alt="Profile Preview"
                                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                                    />
                                </div>
                            )} */}

                            {/* File Uploads */}
                            <div className="mt-6 space-y-4 flex justify-center md:mt-10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Upload Company Logo
                                    </label>
                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadFileOutlined />}
                                        className=" mt-2"
                                        component="label"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleLogoUpload}
                                        />
                                    </Button>
                                </div>
                            </div>

                            {/* Company Logo Preview */}
                            {logoImage && (
                                <div className="mt-2 text-center flex justify-center md:mt-5">
                                    <img
                                        src={logoImage}
                                        alt="Company Logo Preview"
                                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name & Phone */}
                                <div className="flex flex-col">
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        variant="outlined"
                                        className="bg-gray-50 rounded-md"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <TextField
                                        label="Phone Number"
                                        fullWidth
                                        variant="outlined"
                                        className="bg-gray-50 rounded-md"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col md:col-span-2">
                                    <TextField
                                        label="Email ID"
                                        fullWidth
                                        variant="outlined"
                                        className="bg-gray-50 rounded-md"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Address */}
                                <div className="flex flex-col md:col-span-2">
                                    <TextField
                                        label="Address"
                                        fullWidth
                                        variant="outlined"
                                        className="bg-gray-50 rounded-md"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <InputLabel>
                                        State
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="bg-gray-50 text-black rounded-md"
                                    >
                                        <MenuItem value="">Select State</MenuItem>
                                        {states.map((state) => (
                                            <MenuItem key={state.id} value={state.id}>
                                                {state.state_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <InputLabel>
                                        District
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="bg-gray-50 rounded-md"
                                    >
                                        <MenuItem value="">Select District</MenuItem>
                                        {districts.map((district, index) => (
                                            <MenuItem key={index} value={district.id}>
                                                {district.district_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <TextField
                                        label="Village/Town"
                                        fullWidth
                                        variant="outlined"
                                        className="bg-gray-50 rounded-md"
                                        name="villageTown"
                                        value={formData.villageTown}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="col-span-2 flex justify-between mt-4 p-5  px-8">
                        <Button
                            variant="outlined"
                            className="!text-green-600 !border-green-600 hover:!bg-green-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            className="bg-green-500 hover:bg-green-600"
                            type="submit"
                        >
                            Next
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Profile;
