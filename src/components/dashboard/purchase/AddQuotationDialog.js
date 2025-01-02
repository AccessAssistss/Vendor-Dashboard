import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, CircularProgress, Card, Box, CardHeader, Checkbox } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../../../assets/agri.png'
import { Document, Page, Text, View, StyleSheet,Image } from '@react-pdf/renderer'; // Importing react-pdf components


const AddPurchaseDialog = ({ openDialog, setOpenDialog, quotationData, requestCode }) => {
    const [quotationsData, setQuotationsData] = useState(quotationData || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const data = quotationData?.map((item) => ({ ...item, is_return: false }));
        setQuotationsData(data);
    }, [quotationData]);

    const handleChange = (type, value, index) => {
        if (type === "QUANTITY") {
            setQuotationsData(prevState => prevState.map((item, i) => i === index ? { ...item, available_quantity: value } : item));
        }
        if (type === "IS_RETURN") {
            setQuotationsData(prevState => prevState.map((item, i) => i === index ? { ...item, is_return: value } : item));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        const quotations = quotationsData.map(row => ({
            detail_id: row.request_id,
            available_quantity: row.available_quantity,
            is_return: row.is_return,
            product_name: row.product_name,
            quantity: row.quantity,
            total_price: row.total_price || 0,
        }));

        const requestPayload = {
            request_code: requestCode,
            quotations: JSON.stringify(quotations),
        };

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                'https://apis.agrisarathi.com/vendor/VendorResposneonRequest',
                requestPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setOpenDialog(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Quotation data submitted successfully.',
                });
                generatePDF(quotations);
            } else {
                setOpenDialog(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an issue submitting the data.',
                });
            }
        } catch (error) {
            setOpenDialog(false);
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

    const generatePDF = (quotations) => {
        const { pdf } = require('@react-pdf/renderer');
        const doc = <PDFDocument quotations={quotations} />;
        pdf(doc).toBlob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `quotation_${requestCode}.pdf`;
            link.click();
        });
    };

    const PDFDocument = ({ quotations }) => {
        const styles = StyleSheet.create({
            page: {
                padding: 20,
                fontSize: 12,
                fontFamily: 'Helvetica',
                backgroundColor: '#ffffff',
            },
            header: {
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10,
            },
            companyInfo: {
                fontSize: 10,
                marginBottom: 20,
                textAlign: 'right',
            },
            table: {
                width: '100%',
                borderWidth: 1,
                borderColor: '#000',
                marginBottom: 20,
            },
            tableHeader: {
                flexDirection: 'row',
                backgroundColor: '#d9d9d9',
            },
            tableRow: {
                flexDirection: 'row',
            },
            tableCell: {
                flex: 1,
                padding: 5,
                borderRightWidth: 1,
                borderColor: '#000',
                textAlign: 'center',
            },
            tableCellLast: {
                borderRightWidth: 0,
            },
            terms: {
                marginTop: 20,
                fontSize: 10,
            },
            footer: {
                marginTop: 30,
                textAlign: 'center',
                fontSize: 10,
                color: '#777',
            },
        });

        return (
            <Document>
                <Page size="A4" style={styles.page}>

                    <Image
                    
                        src={logo} 
                        style={{ ...styles.image, width: '200px' }}
                    />

                    {/* <Text style={styles.header}>Agri Sarthi</Text> */}
                    {/* <Text style={styles.companyInfo}>
                        Naveen Khushhali Kisan Sewa Kendra
                    </Text> */}

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell]}>S.N.</Text>
                            <Text style={[styles.tableCell]}>Product Name</Text>
                            <Text style={[styles.tableCell]}>PKT Size</Text>
                            <Text style={[styles.tableCell]}>Qty</Text>
                            {/* <Text style={[styles.tableCell]}>Net Price/Per Ltr</Text> */}
                            <Text style={[styles.tableCell, styles.tableCellLast]}>Net Amount</Text>
                        </View>

                        {quotations.map((item, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={[styles.tableCell]}>{index + 1}</Text>
                                <Text style={[styles.tableCell]}>{item.product_name}</Text>
                                <Text style={[styles.tableCell]}>{item.packet_size || 'N/A'}</Text>
                                <Text style={[styles.tableCell]}>{item.quantity}</Text>
                                {/* <Text style={[styles.tableCell]}>{item.unit_price || '0'}</Text> */}
                                <Text style={[styles.tableCell, styles.tableCellLast]}>{item.total_price || '0'}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.terms}>
                        Terms & Conditions:
                        {'\n'}1. GST Included
                        {'\n'}2. Freight: Ex Lucknow
                        {'\n'}3. Payment Term: 100% after delivery
                        {'\n'}4. Delivery within 10 days after confirmation
                        {'\n'}5. Payment through RTGS & NEFT
                    </Text>

                    <Text style={styles.footer}>Thank you for your business!</Text>
                </Page>
            </Document>
        );
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
                                    title={
                                        <div className='flex justify-between'>
                                            <Typography variant='h6'>
                                                {`Request ${index + 1}`}
                                            </Typography>
                                            <Checkbox
                                                checked={row.is_return || false}
                                                onChange={(e) => handleChange('IS_RETURN', e.target.checked, index)}
                                                color="primary"
                                            />
                                            <Typography>Return Product</Typography>
                                        </div>
                                    }
                                    sx={{ p: 1 }}
                                />
                                <Box gap={2} sx={{ p: 2 }} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}>
                                    <TextField label="Product" value={row.product_name || ''} margin="dense" fullWidth disabled />
                                    <TextField label="Quantity" value={row.quantity || ''} margin="dense" type="number" fullWidth disabled />
                                    <TextField label="Measurement" value={row.measurement_type || ''} margin="dense" fullWidth disabled />
                                    <TextField label="Variant" value={row.variants || ''} margin="dense" fullWidth disabled />
                                    <TextField label="Category" value={row.category || ''} margin="dense" fullWidth disabled />
                                    <TextField label="Brand" value={row.brand || ''} margin="dense" fullWidth disabled />
                                    <TextField label="Available Quantity" onChange={(e) => handleChange("QUANTITY", e.target.value, index)} value={row.available_quantity || ''} margin="dense" type="number" fullWidth />
                                    <TextField label="Price" value={row.total_price || ''} onChange={(e) => handleChange("PRICE", e.target.value, index)} margin="dense" type="number" fullWidth />
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
