import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Typography, IconButton, Checkbox } from '@mui/material';
import { RemoveRedEye } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApis } from '../../Api_url';
import AddPurchaseDialog from './AddPurchaseDialog'; // Import the dialog component

const PurchaseInformation = () => {
    const { postJson, getJson, deleteJson } = useApis();
    const [farmersData, setFarmersData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedFarmers, setSelectedFarmers] = useState([]);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // Control dialog open/close state
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token'); // Assuming token is stored in localStorage

    // Fetch purchase request data from the API
    const fetchPurchaseRequestData = async () => {
        try {
            const response = await axios.get('https://apis.agrisarathi.com/vendor/GetallRequirementsSubmittedbyFPO', {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the token in the header
                },
                params: {
                    page: page + 1, // Send the current page (API is 1-based index)
                    page_size: rowsPerPage,
                    // user_type: "vendor",
                },
            });

            const { count, next, previous, results } = response.data;
            setFarmersData(results.products); // Set the data for the table
            setTotalCount(count); // Set total count for pagination
            setNextPage(next); // Set next page URL for pagination
            setPreviousPage(previous); // Set previous page URL for pagination
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPurchaseRequestData(); // Call the fetch function on component mount and when page or rowsPerPage changes
    }, [page, rowsPerPage, accessToken]);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectFarmer = (requestCode) => {
        setSelectedFarmers(prevState => {
            if (prevState.includes(requestCode)) {
                return prevState.filter(code => code !== requestCode);  // Unselect farmer if already selected
            } else {
                return [...prevState, requestCode];  // Select farmer
            }
        });
    };

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
            // Ensure selectedFarmers is an array of strings
            const response = await axios.delete('https://apis.agrisarathi.com/fposupplier/RequestPurchasetoVendor', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: {
                    request_code: selectedFarmers,  // Make sure this is an array
                }
            });

            if (response.data.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Items deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchPurchaseRequestData();  // Refresh the data after deletion
                setSelectedFarmers([]);  // Clear the selected farmers list
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to delete items.',
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
    
    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>Received Purchase Information</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <div className="flex  md:flex-row gap-4 mb-5 md:w-2/3">
                {/* <Button className="bg-[#00B251] w-full md:w-1/2 sm:w-auto py-3" variant="contained" onClick={() => setOpenDialog(true)}>
                    Add purchase
                </Button> */}
                <Button
                    className=" w-full md:w-1/2 sm:w-auto py-3"
                    color='secondary'
                    variant="contained"
                    onClick={handleBulkDelete}
                    disabled={selectedFarmers.length === 0}
                >
                    Delete Selected Purchase
                </Button>
            </div>

            {/* Table to display farmers */}
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
                                            setSelectedFarmers(farmersData.map(f => f.request_code));  // Set all request_codes
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-white">Request code</TableCell>
                            <TableCell className="text-white">Status</TableCell>
                            <TableCell className="text-white">FPO</TableCell>
                            {/* <TableCell className="text-white">Created At</TableCell>
                            <TableCell className="text-white">Updated At</TableCell> */}
                            <TableCell className="text-white hidden lg:table-cell">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {farmersData?.length > 0 ? farmersData.map((row, index) => (
                            <TableRow key={row.request_code} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedFarmers.includes(row.request_code)}
                                        onChange={() => handleSelectFarmer(row.request_code)}
                                    />
                                </TableCell>
                                <TableCell>{row.request_code}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.fpo}</TableCell>
                                {/* <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                                <TableCell>{new Date(row.updated_at).toLocaleString()}</TableCell> */}
                                <TableCell>
                                    <IconButton onClick={() => navigate(`/purchase/${row.request_code}`)}>
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

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                nextButtonProps={{ disabled: !nextPage }}
                backButtonProps={{ disabled: !previousPage }}
            />

            {/* Dialog for Adding Purchase */}
            {/* {openDialog && <AddPurchaseDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />} */}
        </div>
    );
};

export default PurchaseInformation;
