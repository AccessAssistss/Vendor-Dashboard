import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, Checkbox, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddPriceDialog from './AddPriceDialog';

const Price = () => {
    const [productsData, setProductsData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // State for controlling the dialog
    const [currentProduct, setCurrentProduct] = useState(null); // To hold the current product data for editing
    const [price, setPrice] = useState(''); // New price input field
    const [quotePrice, setQuotePrice] = useState(''); // New quoted price input field


    const accessToken = localStorage.getItem('access_token'); // Assuming token is stored in localStorage

    // Fetch product data from the API
    const fetchProductData = async () => {
        try {
            const response = await axios.get('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the token in the header
                },
                params: {
                    page: page + 1, // Send the current page (API is 1-based index)
                    page_size: rowsPerPage,
                },
            });

            const { data } = response.data;
            setProductsData(data); // Set the data for the table
            setTotalCount(data.length); // Set total count for pagination (you might adjust based on actual pagination from the API)
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProductData(); // Call the fetch function on component mount and when page or rowsPerPage changes
    }, [page, rowsPerPage]);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prevState => {
            if (prevState.includes(productId)) {
                return prevState.filter(id => id !== productId);  // Unselect product if already selected
            } else {
                return [...prevState, productId];  // Select product
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'No Products selected for deletion.',
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
            // Confirm the delete action
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (confirmation.isConfirmed) {
                // Make the DELETE request
                const response = await axios.delete('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    data: {
                        ids: selectedProducts,  // Send selected product IDs
                    },
                });

                if (response.data.status === 'success') {
                    Swal.fire({
                        title: 'Success!',
                        text: response.data.message || 'Products deleted successfully!',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    fetchProductData();  // Refresh the data after deletion
                    setSelectedProducts([]);  // Clear the selected products list
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.message || 'Failed to delete products.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
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

    // Open the edit dialog and populate it with the selected product's data
    const handleOpenEditDialog = (product) => {
        setCurrentProduct(product);
        setPrice(product.price);  // Prepopulate the price field
        setQuotePrice(product.quoted_price);  // Prepopulate the quoted price field
        setOpenDialog(true); // Open the dialog
    };

    // Handle the form submission to update the product price
    const handleUpdateProduct = async () => {
        if (!price || !quotePrice) {
            Swal.fire({
                title: 'Error!',
                text: 'Both price and quoted price are required.',
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
            const response = await axios.put('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    request_id: currentProduct.id,  // The product ID to be updated
                    price: parseFloat(price),  // New price value
                    quote_price: parseFloat(quotePrice),  // New quoted price value
                }
            });

            if (response.data.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Product updated successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchProductData();  // Refresh the data after update
                setOpenDialog(false);  // Close the dialog
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to update product.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred during the update.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error('Error during update:', error.response || error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>Product Price Information</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <div className="flex md:flex-row gap-4 mb-5 md:w-2/3">
                <Button
                    className="w-full md:w-1/2 sm:w-auto py-3"
                    color="primary"
                    variant="contained"
                    onClick={handleOpenDialog} // Open the dialog
                >
                    Add Product Price
                </Button>
                <Button
                    className="w-full md:w-1/2 sm:w-auto py-3"
                    color="primary"
                    variant="contained"
                    onClick={handleBulkDelete}
                    disabled={selectedProducts.length === 0}
                >
                    Delete Selected Products
                </Button>
            </div>

            {/* Table to display product data */}
            <TableContainer component={Paper} className="overflow-x-auto mt-6">
                <Table aria-label="products table">
                    <TableHead>
                        <TableRow className="bg-gray-200 text-white">
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedProducts.length === productsData.length}
                                    onChange={() => {
                                        if (selectedProducts.length === productsData.length) {
                                            setSelectedProducts([]);  // Deselect all products
                                        } else {
                                            setSelectedProducts(productsData.map(p => p.id));  // Select all products
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-white">Product Name</TableCell>
                            <TableCell className="text-white">Category</TableCell>
                            <TableCell className="text-white">Brand</TableCell>
                            <TableCell className="text-white">Price</TableCell>
                            <TableCell className="text-white">Quoted Price</TableCell>
                            <TableCell className="text-white hidden lg:table-cell">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {productsData?.length > 0 ? productsData.map((row, index) => (
                            <TableRow key={row.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedProducts.includes(row.id)}
                                        onChange={() => handleSelectProduct(row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.brand}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.quoted_price}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenEditDialog(row)}>
                                        <EditIcon />
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

            {/* Edit Price Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit Product Price</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Price"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <TextField
                        label="Quoted Price"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={quotePrice}
                        onChange={(e) => setQuotePrice(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUpdateProduct} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <AddPriceDialog open={openDialog} onClose={handleCloseDialog} />

        </div>
    );
};

export default Price;
