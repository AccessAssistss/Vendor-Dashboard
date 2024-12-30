import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, CircularProgress, Card, Box, CardHeader } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddPurchaseDialog = ({ openDialog, setOpenDialog, quotationData, requestCode }) => {

    const [quotationsData, setQuotationsData] = useState(quotationData || []);
    const [loading, setLoading] = useState(false);

    const handleChange = (type, value, index) => {
        if (type === "QUANTITY") {
            setQuotationsData(prevState => prevState.map((item, i) => i === index ? { ...item, available_quantity: value } : item));
        }
        if (type === "PRICE") {
            setQuotationsData(prevState => prevState.map((item, i) => i === index ? { ...item, total_price: value } : item));
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
    
        // Prepare the data for submission
        const quotations = quotationsData.map(row => ({
            detail_id: row.detail_id,           // Ensure the correct field is used
            available_quantity: row.available_quantity // Ensure this field is available and properly formatted
        }));
    
        const requestPayload = {
            request_code: requestCode,           // Ensure this is correctly passed
            quotations: quotations
        };
    
        // Log the data to the console for debugging
        console.log('Request Payload:', requestPayload);
    
        // Get the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem('access_token');  // You can adjust this based on where your token is stored.
    
        try {
            // Sending API request with the token in Authorization header
            const response = await axios.post(
                'https://apis.agrisarathi.com/vendor/VendorResposneonRequest',
                requestPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Including the token in the headers
                        'Content-Type': 'application/json'   // Ensure content type is JSON
                    }
                }
            );
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Quotation data submitted successfully.',
                });
                setOpenDialog(false); // Close the dialog
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an issue submitting the data.',
                });
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            sx={{
                '& .MuiDialog-paper': {
                    width: '100%',
                    maxWidth: '95%',
                    height: '100%',
                    maxHeight: '85%',
                    margin: 'auto',
                },
            }}
        >
            <DialogTitle sx={{ marginBottom: 2 }} className='bg-[#00B251] text-white'>
                Add Quotation
            </DialogTitle>
            <DialogContent className='flex' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {loading ? (
                    <CircularProgress sx={{ alignSelf: 'center' }} />
                ) : (
                    quotationsData.length > 0 ? (
                        quotationsData.map((row, index) => (
                            <Card key={index} sx={{ minHeight: 250 }}>
                                <CardHeader
                                    title={<Typography variant='h6'>
                                        {`Request ${index + 1}`}
                                    </Typography>}
                                    sx={{ p: 1 }}
                                />
                                <Box gap={2}
                                    sx={{ p: 2 }}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(2, 1fr)',
                                        md: 'repeat(4, 1fr)',
                                    }}>
                                    <TextField
                                        label="Product"
                                        value={row.product_name || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Quantity"
                                        value={row.quantity || ''}
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Measurement"
                                        value={row.measurement_type || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Variant"
                                        value={row.variants || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Category"
                                        value={row.category || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Brand"
                                        value={row.brand || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Available Quantity"
                                        onChange={(e) => handleChange("QUANTITY", e.target.value, index)}
                                        value={row.available_quantity || ''}
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Price"
                                        value={row.total_price || ''}
                                        onChange={(e) => handleChange("PRICE", e.target.value, index)}
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                    />
                                </Box>
                            </Card>
                        ))
                    ) : (
                        <Typography sx={{ alignSelf: 'center' }}>No products found for this quotation.</Typography>
                    )
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button sx={{ color: '#00B251' }} onClick={() => setOpenDialog(false)}>
                    Cancel
                </Button>
                <Button sx={{ color: '#00B251' }} color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPurchaseDialog;
