import React, { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';

import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete, TextField, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Button, Card, CardHeader, Box, DialogTitle } from '@mui/material';

const AddPrice = () => {

    const [products, setProducts] = useState([]);

    const [submittedData, setSubmittedData] = useState([]);  // Ensure it's an empty array initially
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([{
        selectedProduct: null,
        quantity: '',
        measurement: '',
        variant: '',
        category: '',
        brand: '',
        price: '',
        quote_price: '',
    }]);
    const [lastPage, setLastPage] = useState(false);  // To track if we've reached the last page of products
    const listInnerRef = useRef();
    const scrollPositionRef = useRef(0); // To track scroll position

    // Fetch Products, Brands, and Vendors from API
    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                console.error('Access token is missing!');
                setLoading(false);
                return;
            }

            const response = await axios.get(`https://apis.agrisarathi.com/vendor/GetallData?filter_type=products&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.data.results.data.length === 0) {
                setLastPage(true);
            }
            setProducts(prevProducts => [...prevProducts, ...response.data.results.data]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    // Handle scroll event to detect when user reaches the bottom
    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight && !loading && !lastPage) {
                scrollPositionRef.current = scrollTop;
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchProducts(nextPage);
                    return nextPage;
                });
            }
        }
    };

    // Handle product selection change
    const handleProductChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].selectedProduct = value;
        if (value) {
            newRows[index].measurement = value.measurement.description;
            newRows[index].variant = value.variants ? value.variants[0].variant_name : '';
            newRows[index].category = value.category.name;
        }
        setRows(newRows);
    };

    // Handle quantity change
    const handleQuantityChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].quantity = value;
        if (value < 0) {
            newRows[index].quantityError = 'Quantity cannot be negative.';
        } else {
            newRows[index].quantityError = '';
        }
        setRows(newRows);
    };

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    // Handle variant change
    const handleVariantChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].variant = value;
        setRows(newRows);
    };

    // Handle brand change
    const handleBrandChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].brand = value;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, {
            selectedProduct: null,
            quantity: '',
            measurement: '',
            variant: '',
            category: '',
            Brand: '',

            quantityError: ''
        }]);
    };

    // Handle delete row
    const handleDeleteRow = (index) => {
        const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };

    // Handle form submit
    const handleSubmit = async () => {
        const productsData = rows.map(row => ({
            product_id: row.selectedProduct.product_id,
            category_id: row.selectedProduct?.category?.category_id,
            measurement_id: row.selectedProduct?.measurement?.measurement_id,
            brand_id: row.selectedProduct?.brands.find(brand => brand.brand_name === row.brand)?.brand_id,
            variant_id: row.selectedProduct?.variants.find(variant => variant.variant_name === row.variant)?.variant_id,
            price: row.price,
            quote_price: row.quote_price,
        }));

        const data = { products: productsData };

        try {
            const response = await axios.post('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            setSubmittedData(response.data.products);
            Swal.fire({
                title: 'Success!',
                text: 'Products have been submitted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error submitting the products. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    // const handleEdit = async (requestId, updatedPrice, updatedQuotePrice) => {
    //     const data = { request_id: requestId, price: updatedPrice, quote_price: updatedQuotePrice };

    //     try {
    //         await axios.put('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', data, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         // Show success alert
    //         Swal.fire({
    //             title: 'Success!',
    //             text: 'Product has been updated successfully.',
    //             icon: 'success',
    //             confirmButtonText: 'OK',
    //         });
    //     } catch (error) {
    //         console.error('Error editing product:', error);
    //         // Show error alert
    //         Swal.fire({
    //             title: 'Error!',
    //             text: 'There was an error editing the product. Please try again.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //     }
    // };


    // // Handle Delete
    // const handleDelete = async (ids) => {
    //     try {
    //         await axios.delete('https://apis.agrisarathi.com/vendor/AddGetDelUpdateProductsVendor', {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             data: { ids },
    //         });

    //         setSubmittedData(prevData => prevData.filter(product => !ids.includes(product.product_id)));

    //         // Show success alert
    //         Swal.fire({
    //             title: 'Deleted!',
    //             text: 'Product(s) have been deleted successfully.',
    //             icon: 'success',
    //             confirmButtonText: 'OK',
    //         });
    //     } catch (error) {
    //         console.error('Error deleting product:', error);
    //         // Show error alert
    //         Swal.fire({
    //             title: 'Error!',
    //             text: 'There was an error deleting the product(s). Please try again.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //     }
    // };




    useEffect(() => {

        fetchProducts(page);
    }, []);

    useEffect(() => {
        if (listInnerRef.current) {
            listInnerRef.current.scrollTop = scrollPositionRef.current;
        }
    }, [products]);

    return (
        <div>
            
            <div className="flex flex-col gap-4">
                {rows.map((row, index) => (
                    <div key={index} className="w-full flex flex-wrap gap-4 relative">
                        <div className="w-full p-4 bg-gray-50 rounded-lg shadow-md relative">
                            {rows.length > 1 && (
                                <IconButton
                                    onClick={() => handleDeleteRow(index)}
                                    color="error"
                                    className="absolute top-2 left-[95%]"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}

                            <div className="flex justify-between items-center pb-2 border-b">
                                <Typography variant="h6" className="text-xl font-medium">
                                    {`Product - ${index + 1}`}
                                </Typography>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                                <Autocomplete
                                    className="mt-2"
                                    options={products}
                                    getOptionLabel={(option) => option.product_name}
                                    value={row.selectedProduct}
                                    onChange={(e, value) => handleProductChange(index, value)}
                                    renderInput={(params) => (
                                        <>
                                            <TextField {...params} label="Product" fullWidth />
                                            {loading && <CircularProgress size={24} className="absolute right-2 top-1/2 transform -translate-y-1/2" />}
                                        </>
                                    )}
                                    ListboxComponent={(props) => (
                                        <div
                                            {...props}
                                            onScroll={onScroll}
                                            ref={listInnerRef}
                                            className="max-h-72 overflow-y-auto"
                                        >
                                            {props.children}
                                        </div>
                                    )}
                                />
                                <TextField
                                    label="Quantity"
                                    value={row.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    margin="dense"
                                    type="number"
                                    fullWidth
                                />
                                {row.quantityError && (
                                    <Typography className="text-red-500 text-sm">{row.quantityError}</Typography>
                                )}

                                <TextField
                                    label="Measurement"
                                    value={row.measurement}
                                    margin="dense"
                                    fullWidth
                                />

                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Variant</InputLabel>
                                    <Select
                                        value={row.variant}
                                        onChange={(e) => handleVariantChange(index, e.target.value)}
                                        label="Variant"
                                        disabled={!row.selectedProduct}
                                    >
                                        {row.selectedProduct?.variants?.map((variantOption) => (
                                            <MenuItem key={variantOption.variant_id} value={variantOption.variant_name}>
                                                {variantOption.variant_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Category"
                                    value={row.category}
                                    margin="dense"
                                    fullWidth
                                />

                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Brand</InputLabel>
                                    <Select
                                        value={row.brand}
                                        onChange={(e) => handleBrandChange(index, e.target.value)}
                                        label="Brand"
                                        disabled={!row.selectedProduct}  // Only enable when a product is selected
                                    >
                                        {row.selectedProduct?.brands?.map((brandOption) => (
                                            <MenuItem key={brandOption.brand_id} value={brandOption.brand_name}>
                                                {brandOption.brand_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Price"
                                    fullWidth
                                    value={row.price}
                                    onChange={(e) => handleChange(index, 'price', e.target.value)}
                                />
                                <TextField
                                    label="Quote Price"
                                    fullWidth
                                    value={row.quote_price}
                                    onChange={(e) => handleChange(index, 'quote_price', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                    <IconButton onClick={handleAddRow} color="primary" className="self-start text-primary">
                        <AddIcon />
                    </IconButton>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>

        </div>
    );
};

export default AddPrice;
