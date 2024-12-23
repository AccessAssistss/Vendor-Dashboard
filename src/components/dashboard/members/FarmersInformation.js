import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
    Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Select, MenuItem, InputLabel, FormControl, Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RemoveRedEye } from '@mui/icons-material';
import { useApis } from '../../Api_url';

const FarmersInformation = () => {
    const { postJson, getJson } = useApis()
    const [farmersData, setFarmersData] = useState([]);  // Farmers data state
    const [page, setPage] = useState(0);  // Page state
    const [rowsPerPage, setRowsPerPage] = useState(10);  // Rows per page state
    const [totalCount, setTotalCount] = useState();  // Total count of farmers for pagination
    const [error, setError] = useState(null);  // Error state
    const [selectedFarmers, setSelectedFarmers] = useState([]);  // Track selected farmers
    const [openDialog, setOpenDialog] = useState(false);  // Dialog state
    const [farmerName, setFarmerName] = useState('');  // Farmer name state for new farmer
    const [farmerMobile, setFarmerMobile] = useState('');  // Farmer mobile state for new farmer
    const [farmerVillage, setFarmerVillage] = useState('');  // Farmer district state for new farmer

    const [dialogError, setDialogError] = useState(null);
    const [farmerGender, setFarmerGender] = useState('');  // Gender state for new farmer
    const navigate = useNavigate();

    // Fetch Farmers Data with Pagination
    const fetchFarmersData = async (p) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found.');
            return;
        }

        try {
            const response = await getJson('GetAllFarmerbyFPO', {
                page: p + 1,  // API uses 1-based pagination
                per_page: rowsPerPage,
            })

            const data = response.data.results || [];
            const count = response.data.count || 0;

            console.log("Fetched farmers data:", data);  // Debugging log
            setFarmersData(data);
            setTotalCount(count);  // Set total farmer count for pagination
        } catch (error) {
            console.error('Error fetching member data:', error);
            setError('Error fetching data.');
        }
    };

    useEffect(() => {
        fetchFarmersData(page);  // Fetch farmers data whenever the page or rowsPerPage changes
    }, [page, rowsPerPage]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);  // Update the page state when the user navigates to a different page
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));  // Update the number of rows per page
        setPage(0);  // Reset to first page when rows per page changes
    };

    // Handle row click to navigate to farmer details
    const handleRowClick = (farmerId) => {
        navigate(`/memberdetail/${farmerId}`);
    };

    // Handle selection of a checkbox
    const handleSelectFarmer = (farmerId) => {
        setSelectedFarmers(prevState => {
            if (prevState.includes(farmerId)) {
                return prevState.filter(id => id !== farmerId);  // Unselect farmer if already selected
            } else {
                return [...prevState, farmerId];  // Select farmer
            }
        });
    };

    // Handle bulk deletion
    const handleBulkDelete = async () => {
        if (selectedFarmers.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'No Members selected for deletion.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found.');
            return;
        }

        try {
            const response = await axios.delete('https://apis.agrisarathi.com/fposupplier/FarmerByFPO', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: {
                    farmer_id: selectedFarmers,  // Send selected farmer IDs for deletion
                }
            });

            if (response.data.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Members deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchFarmersData(page);
                setSelectedFarmers([]);  // Clear the selected farmers list
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to delete member.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred during deletion.',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            console.error('Error during bulk delete:', error.response || error);
        }
    };

    const handleSubmit = async () => {
        if (!farmerName || !farmerMobile || !farmerVillage) {
            setDialogError('Please fill in all fields.');
            return;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(farmerMobile)) {
            setDialogError('Please enter a valid mobile number.');
            return;
        }

        try {
            const response = await postJson('FarmerByFPO', {
                farmer_name: farmerName,
                farmer_mobile: farmerMobile,
                farmer_village: farmerVillage,

                farmer_gender: farmerGender,
            })

            if (response.status === 201) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Farmer added successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });

                // Add the newly added farmer to the farmersData list
                const newFarmer = {
                    id: response?.results?.farmer_id,  // Assuming the response contains the new farmer's ID
                    name: farmerName,
                    mobile: farmerMobile,
                    village: farmerVillage,

                    gender: farmerGender,
                };
                setFarmersData(prevFarmersData => [newFarmer, ...prevFarmersData]);

                setOpenDialog(false);
                fetchFarmersData(page);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to add farmer.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.log(error);
            
            if(error?.response?.data?.message === "Mobile number already exists"){
                setDialogError("Mobile number already exists")
            }
        }
        

    };

    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>Members Information</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <div className="flex flex-col md:flex-row gap-4">
                <Button
                    className="bg-[#00B251] w-full md:w-1/2 sm:w-auto py-3"
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                >
                    Add Member
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBulkDelete}
                    disabled={selectedFarmers.length === 0}
                    className="w-full md:w-1/2 sm:w-auto py-3 mt-4 sm:mt-0"
                >
                    Delete Selected Member
                </Button>
            </div>

            <TableContainer component={Paper} className="overflow-x-auto mt-6">
                <Table aria-label="farmers table">
                    <TableHead>
                        <TableRow className="bg-gray-200 text-white">
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedFarmers.length === farmersData.length}
                                    onChange={() => {
                                        if (selectedFarmers.length === farmersData.length) {
                                            setSelectedFarmers([]);
                                        } else {
                                            setSelectedFarmers(farmersData.map(f => f.id));
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-white">S.No</TableCell>
                            <TableCell className="text-white">Name</TableCell>
                            <TableCell className="text-white">Mobile</TableCell>
                            <TableCell className="text-white hidden lg:table-cell">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {farmersData?.length > 0 ? farmersData.map((farmer, index) => (
                            <TableRow key={farmer?.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedFarmers.includes(farmer?.id)}
                                        onChange={() => handleSelectFarmer(farmer?.id)}
                                    />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{farmer?.name || 'N/A'}</TableCell>
                                <TableCell>{farmer?.mobile}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleRowClick(farmer.id)}>
                                        <RemoveRedEye />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )) :
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Typography variant='h6' textAlign='center'>
                                        No Data
                                    </Typography>
                                </TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4">
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ marginBottom: 2 }} className='bg-[#00B251] text-white'>Add New Member</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        margin="dense"
                        required

                    />
                    <TextField
                        label="Mobile"
                        fullWidth
                        value={farmerMobile}
                        onChange={(e) => setFarmerMobile(e.target.value)}
                        margin="dense"
                        required
                    />
                    <TextField
                        label="Village"
                        fullWidth
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                        margin="dense"
                        required
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={farmerGender}
                            onChange={(e) => setFarmerGender(e.target.value)}
                            label="Gender"

                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Female">Others</MenuItem>
                        </Select>
                    </FormControl>

                    {dialogError && <Typography color="error">{dialogError}</Typography>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: '#00B251' }} >Cancel</Button>
                    <Button onClick={handleSubmit} sx={{ color: '#00B251' }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FarmersInformation;
