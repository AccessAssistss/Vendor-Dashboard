import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography } from '@mui/material';

const ViewQuotation = () => {
    const [quotations, setQuotations] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState(null);

    const accessToken = localStorage.getItem('access_token'); // Fetch the token from localStorage

    // Set the request_code and quotation_id, replace with your actual values
    const request_code = 'your_request_code';  // Replace with the actual request_code
    const quotation_id = 'request_id';  // Replace with the actual quotation_id

    // Function to fetch quotation data
    const fetchQuotationData = async () => {
        try {
            const response = await axios.get('https://apis.agrisarathi.com/vendor/QuotationWiseProducts', {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
                },
                params: {
                    request_code: request_code,  // Use the request_code
                    quotation_id: quotation_id,  // Use the quotation_id
                },
            });

            const { data } = response.data;
            setQuotations(data.quotations); // Set the quotations data
            setTotalCount(data.quotations.length); // Set total count for pagination
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
    };

    // Fetch data when component mounts or pagination changes
    useEffect(() => {
        fetchQuotationData();
    }, [page, rowsPerPage]);

    // Handle page changes in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle changes in rows per page in pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>View Quotations</Typography>

            {error && <Typography color="error">{error}</Typography>}

            {/* Table to display quotation data */}
            <TableContainer component={Paper} className="overflow-x-auto mt-6">
                <Table aria-label="quotations table">
                    <TableHead>
                        <TableRow className="bg-gray-200 text-white">
                            <TableCell className="text-white">Product Name</TableCell>
                            <TableCell className="text-white">Category</TableCell>
                            <TableCell className="text-white">Brand</TableCell>
                            <TableCell className="text-white">Unit Price</TableCell>
                            <TableCell className="text-white">Available Quantity</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {quotations?.length > 0 ? quotations.map((quotation, index) => (
                            <TableRow key={quotation.product_id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <TableCell>{quotation.product_name}</TableCell>
                                <TableCell>{quotation.category}</TableCell>
                                <TableCell>{quotation.brand}</TableCell>
                                <TableCell>{quotation.unit_price}</TableCell>
                                <TableCell>{quotation.available_quantity}</TableCell>
                            </TableRow>
                        )) :
                            <TableRow>
                                <TableCell colSpan={5}>
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
            />
        </div>
    );
};

export default ViewQuotation;
