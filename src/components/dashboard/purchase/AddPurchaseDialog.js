import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, CircularProgress, Card, Box, CardHeader } from '@mui/material';


const AddPurchaseDialog = ({ openDialog, setOpenDialog, quotationData }) => {

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
                                    // sx={{ flex: 0.5, width: 150 }}
                                    />
                                    <TextField
                                        label="Quantity"
                                        value={row.quantity || ''}
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                        // sx={{ flex: 0.5, width: 150 }}
                                        disabled
                                    />

                                    <TextField
                                        label="Measurement"
                                        value={row.measurement_type || ''}
                                        margin="dense"
                                        fullWidth
                                        disabled
                                    // sx={{ flex: 0.5, width: 150 }}
                                    />
                                    <TextField
                                        label="varient"
                                        value={row.variants || ''}
                                        margin="dense"
                                        fullWidth
                                        // sx={{ flex: 0.5, width: 150 }}
                                        disabled
                                    />
                                    <TextField
                                        label="Category"
                                        value={row.category || ''}
                                        margin="dense"
                                        fullWidth
                                        // sx={{ flex: 0.5, width: 150 }}
                                        disabled
                                    />

                                    <TextField
                                        label="Brand"
                                        value={row.brand || ''}
                                        margin="dense"
                                        fullWidth
                                        // sx={{ flex: 0.5, width: 150 }}
                                        disabled
                                    />

                                    <TextField
                                        label="Available Quantity"
                                        onChange={(e) => handleChange("QUANTITY", e.target.value, index)}
                                        value={row.available_quantity || ''}
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                    // sx={{ flex: 0.5, width: 150 }}
                                    />
                                    <TextField
                                        label="Price"
                                        value={row.total_price || ''}
                                        onChange={(e) => handleChange("PRICE", e.target.value, index)}
                                        margin="dense"
                                        type="number"

                                        fullWidth
                                    // sx={{ flex: 0.5, width: 150 }}
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
                <Button sx={{ color: '#00B251' }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPurchaseDialog;
