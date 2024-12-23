// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   MenuItem,
//   Button,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Navbar from "../../Navbar";
// import { useApis } from "../../Api_url";

// const ShopDetailsForm = () => {
//   const navigate = useNavigate();
//   const [forms, setForms] = useState([
//     {
//       shopName: "",
//       shopContact: "",
//       alternateContact: "",
//       shopAddress: "",
//       shopLatitude: "",
//       shopLongitude: "",
//       openTime: "",
//       closeTime: "",
//       openDays: "",
//       closeDays: "",
//       shopImage: "",
//       state: "",
//       district: "",
//     }
//   ]);

//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [loadingStates, setLoadingStates] = useState(true);
//   const [loadingDistricts, setLoadingDistricts] = useState(false);

//   const token = localStorage.getItem("access_token");

//   // Fetch states from API
//   useEffect(() => {
//     const fetchStates = async () => {
//       setLoadingStates(true);
//       try {
//         const response = await axios.get("https://apis.agrisarathi.com/home/GetStates?user_language=1");
//         setStates(response.data.states_data || []);
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       } finally {
//         setLoadingStates(false);
//       }
//     };
//     fetchStates();
//   }, []);

//   // Fetch shop data from the API when the component mounts
//   useEffect(() => {
//     const fetchShopData = async () => {
//       try {
//         const response = await axios.get("https://apis.agrisarathi.com/fposupplier/UserProfileView", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         const shopData = response?.data?.data?.shop_details;
//         if (shopData && shopData.length > 0) {
//           // If there's shop data, populate the form
//           setForms(shopData);
//         }
//       } catch (error) {
//         console.error("Error fetching shop data:", error);
//         Swal.fire("Error", "Unable to fetch shop data.", "error");
//       }
//     };
//     fetchShopData();
//   }, [token]);

//   // Fetch districts when state is selected
//   const handleStateChange = async (index, event) => {
//     const selectedState = event.target.value;
//     const newForms = [...forms];
//     newForms[index].state = selectedState;
//     newForms[index].district = ""; // Reset district on state change
//     setForms(newForms);

//     // Fetch districts for selected state
//     setLoadingDistricts(true);
//     try {
//       const response = await axios.get(
//         `https://apis.agrisarathi.com/home/GetStateDistrictsASuperadamin?state=${selectedState}&user_language=1`
//       );

//       // Check if the districts response is an array before setting districts
//       if (Array.isArray(response.data.states_data)) {
//         setDistricts(response.data?.states_data || []);
//       } else {
//         console.error("Districts data is not an array:", response.data);
//       }

//       setLoadingDistricts(false);
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//       setLoadingDistricts(false);
//     }
//   };

//   // Handle form change for each field
//   const handleFormChange = (index, event) => {
//     const newForms = [...forms];
//     newForms[index][event.target.name] = event.target.value;
//     setForms(newForms);
//   };

//   // Handle image upload
//   const handleImageUpload = (event, index) => {
//     const newForms = [...forms];
//     newForms[index].shopImage = event.target.files[0];
//     setForms(newForms);
//   };

//   // Handle adding a new shop form
//   const handleAddForm = () => {
//     setForms([
//       ...forms,
//       {
//         shopName: "",
//         shopContact: "",
//         alternateContact: "",
//         shopAddress: "",
//         shopLatitude: "",
//         shopLongitude: "",
//         openTime: "",
//         closeTime: "",
//         openDays: "",
//         closeDays: "",
//         shopImage: "",
//         state: "",
//         district: "",
//       },
//     ]);
//   };

//   // Handle removing a shop form
//   const handleRemoveForm = (index) => {
//     const newForms = forms.filter((_, i) => i !== index);
//     setForms(newForms);
//   };

//   // Submit form data to the API
//   const handleSubmit = async () => {
//     try {
//       for (let form of forms) {
//         if (
//           !form.shopName ||
//           !form.shopContact ||
//           !form.state ||
//           !form.district
//         ) {
//           Swal.fire("Warning", "Please fill Shop name, Shop contact, Shop state and Shop district are required fields.", "warning");
//           return; // Stop the submission if validation fails
//         }

//         const formData = new FormData();
//         formData.append("shopName", form.shopName);
//         formData.append("shopContactNo", form.shopContact);
//         formData.append("shop_opentime", form.openTime);
//         formData.append("shop_closetime", form.closeTime);
//         formData.append("shop_opendays", form.openDays);
//         formData.append("shop_closedon", form.closeDays);
//         formData.append("shopLatitude", form.shopLatitude);
//         formData.append("shopLongitude", form.shopLongitude);
//         formData.append("state", form.state);
//         formData.append("district", form.district);

//         if (form.shopImage) {
//           formData.append("shopimage", form.shopImage);
//         }

//         const response = await axios.post(
//           "https://apis.agrisarathi.com/fposupplier/AddShopbyFPOSupplier",
//           formData,
//           {
//             headers: {
//               "Authorization": `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status === 201) {
//           Swal.fire("Success!", "Shop details submitted successfully.", "success");
//           navigate("/bankdetails");
//         } else {
//           Swal.fire("Error", "There was an issue submitting your data.", "error");
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting data:", error);
//       Swal.fire("Error", "Something went wrong. Please try again.", "error");
//     }
//   };


//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center bg-gray-50 p-6 min-h-screen mt-16">
//         {/* Step Progress */}
//         <div className="flex justify-center items-center space-x-4 mb-6 md:p-0 p-5">
//           <div className="flex items-center space-x-2">
//             <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
//             <button onClick={() => (navigate('/profile'))}>
//               <span className="text-sm text-gray-700">Profile details</span>
//             </button>
//           </div>
//           <div className="w-16 h-[2px] bg-gray-400" />
//           <div className="flex items-center space-x-2">
//             <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
//             <button onClick={() => (navigate('/shopdetails'))}>
//               <span className="text-sm text-gray-700">Shop Details</span>
//             </button>
//           </div>
//           <div className="w-16 h-[2px] bg-gray-400" />
//           <div className="flex items-center space-x-2">
//             <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-gray-400" />
//             <button onClick={() => (navigate('/bankdetails'))}>
//               <span className="text-sm text-gray-700">Bank Details</span>
//             </button>
//           </div>
//         </div>
//         {/* Form Section */}
//         {forms.map((form, index) => (
//           <form
//             key={index}
//             className="flex justify-center flex-col gap-6 w-full max-w-5xl bg-white p-6 shadow-md rounded-md mb-8 "
//           >
//             {/* Left Side: Image and Time Fields */}
//             <div className="col-span-4 flex flex-col items-center space-y-4">
//               {/* Image Upload */}
//               <div className="flex flex-col items-center">
//                 {form.shopImage && form.shopImage instanceof File && (
//                   <img
//                     src={URL.createObjectURL(form.shopImage)} // Only create object URL if it's a valid File
//                     alt="Shop"
//                     className="w-32 h-32 object-cover mb-2 rounded"
//                   />
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e, index)}
//                   style={{ display: "none" }} // Hide the default input
//                   id={`upload-image-${index}`} // Unique ID for each form
//                 />
//                 <Button
//                   className="!text-green-600 !border-green-600 hover:!bg-green-50"
//                   variant="outlined"
//                   size="small"
//                   component="label" // Use label to trigger file input
//                   htmlFor={`upload-image-${index}`} // Link to the hidden input
//                 >
//                   Upload Image
//                 </Button>
//               </div>


//               {/* Time Fields */}
//               <div className="w-full">
//                 <InputLabel>Open Time</InputLabel>
//                 <Select
//                   name="openTime"
//                   value={form.openTime}
//                   onChange={(e) => handleFormChange(index, e)}
//                   className="w-full"
//                 >
//                   {/* Time options */}
//                   <MenuItem value="1 a.m">1 a.m</MenuItem>
//                   <MenuItem value="2 a.m">2 a.m</MenuItem>
//                   <MenuItem value="3 a.m">3 a.m</MenuItem>
//                   <MenuItem value="4 a.m">4 a.m</MenuItem>
//                   <MenuItem value="5 a.m">5 a.m</MenuItem>
//                   <MenuItem value="6 a.m">6 a.m</MenuItem>
//                   <MenuItem value="7 a.m">7 a.m</MenuItem>
//                   <MenuItem value="8 a.m">8 a.m</MenuItem>
//                   <MenuItem value="9 a.m">9 a.m</MenuItem>
//                   <MenuItem value="10 a.m">10 a.m</MenuItem>
//                   <MenuItem value="11 a.m">11 a.m</MenuItem>
//                   {/* Add more time options */}
//                 </Select>
//               </div>

//               <div className="w-full">
//                 <InputLabel>Close Time</InputLabel>
//                 <Select
//                   name="closeTime"
//                   value={form.closeTime}
//                   onChange={(e) => handleFormChange(index, e)}
//                   className="w-full"
//                 >
//                   {/* Time options */}
//                   <MenuItem value="12 p.m">12 p.m</MenuItem>
//                   <MenuItem value="1 p.m">1 p.m</MenuItem>
//                   <MenuItem value="2 p.m">2 p.m</MenuItem>
//                   <MenuItem value="3 p.m">3 p.m</MenuItem>
//                   <MenuItem value="4 p.m">4 p.m</MenuItem>
//                   <MenuItem value="5 p.m">5 p.m</MenuItem>
//                   <MenuItem value="6 p.m">6 p.m</MenuItem>
//                   <MenuItem value="7 p.m">7 p.m</MenuItem>
//                   <MenuItem value="8 p.m">8 p.m</MenuItem>
//                   <MenuItem value="9 p.m">9 p.m</MenuItem>
//                   <MenuItem value="10 p.m">10 p.m</MenuItem>
//                   <MenuItem value="11 p.m">11 p.m</MenuItem>
//                   {/* Add more time options */}
//                 </Select>
//               </div>

//               {/* Days Dropdown */}
//               <div className="w-full">
//                 <InputLabel>Open Days</InputLabel>
//                 <Select
//                   name="openDays"
//                   value={form.openDays}
//                   onChange={(e) => handleFormChange(index, e)}
//                   className="w-full"
//                 >
//                   <MenuItem value="Monday - Tuesday">Monday - Tuesday</MenuItem>
//                   <MenuItem value="Monday - Wednesday">Monday - Wednesday</MenuItem>
//                   <MenuItem value="Monday - Thursday">Monday - Thursday</MenuItem>
//                   <MenuItem value="Monday - Friday">Monday - Friday</MenuItem>
//                   <MenuItem value="Monday - Saturday">Monday - Saturday</MenuItem>
//                   <MenuItem value="Monday - Sunday">Monday - Sunday</MenuItem>
//                   {/* Add more days options */}
//                 </Select>
//               </div>

//               <div className="w-full">
//                 <InputLabel>Close Days</InputLabel>
//                 <Select
//                   name="closeDays"
//                   value={form.closeDays}
//                   onChange={(e) => handleFormChange(index, e)}
//                   className="w-full"
//                 >
//                   <MenuItem value="Sunday">Sunday</MenuItem>
//                   <MenuItem value="Monday">Monday</MenuItem>
//                   <MenuItem value="Tuesday">Tuesday</MenuItem>
//                   <MenuItem value="Wednesday">Wednesday</MenuItem>
//                   <MenuItem value="Thursday">Thursday</MenuItem>
//                   <MenuItem value="Friday">Friday</MenuItem>
//                   <MenuItem value="Saturday">Saturday</MenuItem>
//                   {/* Add more days options */}
//                 </Select>
//               </div>
//               <div className="w-full">
//                 <InputLabel>State</InputLabel>
//                 <Select
//                   name="state"
//                   value={form.state}
//                   onChange={(e) => handleStateChange(index, e)}
//                   className="w-full"
//                 >
//                   {loadingStates ? (
//                     <MenuItem>Loading...</MenuItem>
//                   ) : (
//                     Array.isArray(states) && states.length > 0 ? (
//                       states.map((state) => (
//                         <MenuItem key={state.id} value={state.id}>
//                           {state.state_name}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem>No states available</MenuItem>
//                     )
//                   )}
//                 </Select>
//               </div>

//               {/* New District Dropdown */}
//               <div className="w-full">
//                 <InputLabel>District</InputLabel>
//                 <Select
//                   name="district"
//                   value={form.district}
//                   onChange={(e) => handleFormChange(index, e)}
//                   className="w-full"
//                   disabled={loadingDistricts || !form.state}
//                 >
//                   {loadingDistricts ? (
//                     <MenuItem>Loading...</MenuItem>
//                   ) : (
//                     Array.isArray(districts) && districts.length > 0 ? (
//                       districts.map((district) => (
//                         <MenuItem key={district.id} value={district.id}>
//                           {district.district_name}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem>No districts available</MenuItem>
//                     )
//                   )}
//                 </Select>
//               </div>
//             </div>

//             {/* Right Side: Input Fields */}
//             <div className="col-span-8 grid md:grid-cols-2 gap-4">
//               <TextField
//                 name="shopName"
//                 label="Shop Name"
//                 variant="outlined"
//                 fullWidth
//                 value={form.shopName}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//               <TextField
//                 name="shopContact"
//                 label="Shop Contact No."
//                 variant="outlined"
//                 fullWidth
//                 value={form.shopContact}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//               <TextField
//                 name="alternateContact"
//                 label="Alternate Contact No."
//                 variant="outlined"
//                 fullWidth
//                 value={form.alternateContact}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//               <TextField
//                 name="shopAddress"
//                 label="Shop Address"
//                 variant="outlined"
//                 fullWidth
//                 value={form.shopAddress}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//               <TextField
//                 name="shopLatitude"
//                 label="Latitude"
//                 variant="outlined"
//                 fullWidth
//                 value={form.shopLatitude}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//               <TextField
//                 name="shopLongitude"
//                 label="Longitude"
//                 variant="outlined"
//                 fullWidth
//                 value={form.shopLongitude}
//                 onChange={(e) => handleFormChange(index, e)}
//               />
//             </div>

//             {/* Remove Button */}
//             {forms.length > 1 && (
//               <div className="flex justify-end mt-4">
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => handleRemoveForm(index)}
//                 >
//                   Remove Shop
//                 </Button>
//               </div>
//             )}

//             {/* Add another shop button */}
//             <Button
//               className="!text-green-600 !border-green-600 hover:!bg-green-50"
//               variant="outlined"
//               color="primary"
//               onClick={handleAddForm}
//             >
//               Add Another Shop
//             </Button>
//           </form>
//         ))}

//         <div className="flex flex-row justify-between mt-4 w-full max-w-5xl">
//           <Button
//             className="!text-green-600 !border-green-600 hover:!bg-green-50"
//             variant="outlined"
//             color="secondary"
//             onClick={() => navigate("/profile")}
//           >
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
//             className="bg-green-500 hover:bg-green-600"
//             onClick={handleSubmit}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ShopDetailsForm;
