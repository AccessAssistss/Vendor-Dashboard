import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MemberProfile = () => {
    const { id } = useParams(); 

    // State to store various data
    const [member, setMember] = useState(null); // Farmer data
    const [landRecords, setLandRecords] = useState([]); // Land records
    const [totalLands, setTotalLands] = useState(0); // Total lands
    const [totalPosts, setTotalPosts] = useState(0); // Total posts
    const [farmerPosts, setFarmerPosts] = useState([]); // Farmer posts
    const [diseaseRecords, setDiseaseRecords] = useState([]); // Disease records
    const [totalDisease, setTotalDisease] = useState(0); // Total diseases
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Replace with your actual token
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        // Make the API request when the component mounts
        const fetchMemberData = async () => {
            try {
                const response = await axios.get('https://apis.agrisarathi.com/fposupplier/GetSingleFarmerDetailsbyFPO', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request header
                    },
                    params: {
                        farmer_id: id, // Send the farmer ID from URL in the request
                    },
                });

                // Assuming the response contains the member data
                const data = response?.data;

                setMember(data?.farmer_data);
                setLandRecords(data?.land_records);
                setTotalLands(data?.total_lands);
                setFarmerPosts(data?.farmer_posts);
                setTotalPosts(data?.total_posts);
                setDiseaseRecords(data?.disease_records);
                setTotalDisease(data?.total_disease);
            } catch (err) {
                setError('Error fetching member data');
                console.error(err);
            } finally {
                setLoading(false); // Set loading to false once the request is done
            }
        };

        fetchMemberData(); // Call the fetch function
    }, [id, token]); // Re-run the effect if `id` or `token` changes

    // Show loading or error state if needed
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // If member data is fetched successfully, render it
    return (
        <div className="md:mt-10 mt-10 md:px-0 px-5">
            <div className="max-w-md mx-auto bg-gradient-to-br from-[#00B251] to-[#66BB6A] shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                {/* Profile Image */}
                <div className="flex justify-center mt-8">
                    <img
                        className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover transform hover:scale-110 transition-transform duration-300"
                        src={'https://apis.agrisarathi.com/' + (member?.profile || 'https://via.placeholder.com/150')} // Fallback image
                    //alt={member?.name || 'Member'} // Fallback name
                    />
                </div>

                {/* Profile Info */}
                <div className="text-center mt-6 px-6 pb-6">
                    <h2 className="text-3xl font-bold text-white">{member?.name || 'Unknown'}</h2>
                    <p className="text-lg text-white mt-2">{member?.mobile || '123-456-7890'}</p>
                    <p className="text-lg text-white mt-1">{member?.gender || 'Unknown'}</p>
                </div>

                {/* Additional Info */}
                <div className="mt-4 px-6 pb-6">
                    {/* Grouping Village and Total Lands into one row */}
                    <div className="flex justify-between space-x-6 text-white">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Village:</span>
                            <span>{member?.village || 'Unknown Village'}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Total Lands:</span>
                            <span>{totalLands}</span>
                        </div>
                    </div>
                </div>

                {/* Posts Info and Disease Info in one row */}
                <div className="mt-4 px-6 pb-6">
                    <div className="flex justify-between space-x-6 text-white">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Total Posts:</span>
                            <span>{totalPosts || 0}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Total Diseases:</span>
                            <span>{totalDisease || 0}</span>
                        </div>
                    </div>
                </div>


                {/* Decorative Accent Line */}
                <div className="h-1 bg-gradient-to-r from-[#19ce6a] to-[#A0E0B4] mt-4 mb-6 mx-8 rounded-full"></div>
            </div>
        </div>
    );
};

export default MemberProfile;
