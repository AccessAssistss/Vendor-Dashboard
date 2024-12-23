import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Button, Stepper, Step, StepLabel, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPurchaseDialog from './AddPurchaseDialog';

const SinglePurchase = () => {
  const { request_code } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false); // State for the Edit Dialog
  const [editedProduct, setEditedProduct] = useState(null); // State for storing the edited product
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem('access_token'); // Fetch token from localStorage

  const statusSteps = [
    { status: 'pending', label: 'Pending' },
    { status: 'vendor_responded', label: 'Vendor Responded' },
    { status: 'quotation_sent', label: 'Quotation Sent' },
    { status: 'quotation_approved', label: 'Quotation Approved' },
    { status: 'quotation_rejected', label: 'Quotation Rejected' },
    { status: 'payment_pending', label: 'Payment Pending' },
    { status: 'completed', label: 'Completed' },
    { status: 'cancelled', label: 'Cancelled' }
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          console.error('No token found');
          return;
        }

        // Fetching the single purchase data
        const purchaseResponse = await axios.get('https://apis.agrisarathi.com/vendor/GetUpdateRequirementsVendor', {
          params: { request_code },
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Check if the API response has product_request and product_details
        if (purchaseResponse.data.product_request?.product_details?.length > 0) {
          const productRequest = purchaseResponse.data.product_request; // Save the whole product_request data
          setPurchaseData(productRequest); // Set the entire product_request

          // Extract the status from product_request
          const currentStatus = productRequest.status;

          // Find the index of the current status from the statusSteps array
          const currentStepIndex = statusSteps.findIndex(step => step.status === currentStatus);
          setActiveStep(currentStepIndex >= 0 ? currentStepIndex : 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [request_code, token]);



  const handleEditClick = (product) => {
    setEditedProduct(product); // Set the product to be edited
    setOpenEditDialog(true); // Open the edit dialog
  };

  const handleDeleteClick = async (productId) => {
    try {
      setLoading(true);
      // Call your API to delete the product
      await axios.delete(`https://apis.agrisarathi.com/fposupplier/DeleteProduct/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Remove the deleted product from the state
      setPurchaseData((prevData) => ({
        ...prevData,
        product_details: prevData.product_details.filter((product) => product.id !== productId)
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      // Call your API to save the edited product
      await axios.put(`https://apis.agrisarathi.com/fposupplier/UpdateProduct/${editedProduct.id}`, editedProduct, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Update the state with the edited product
      setPurchaseData((prevData) => ({
        ...prevData,
        product_details: prevData.product_details.map((product) =>
          product.id === editedProduct.id ? editedProduct : product
        )
      }));
      setLoading(false);
      setOpenEditDialog(false); // Close the edit dialog
    } catch (error) {
      console.error('Error saving product:', error);
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false); // Close the dialog without saving changes
  };

  if (!purchaseData) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen">
        <div className='md:my:0 my-10'>
          <Stepper
            activeStep={activeStep}
            alternativeLabel

          >
            {statusSteps.map((step, index) => (
              <Step key={index} sx={{
                '& .MuiStepLabel-root .Mui-completed': {
                  color: 'green', // circle color (COMPLETED)
                },}}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-300">
          <Typography variant="h4" gutterBottom className="text-center font-bold text-[#00B251] mb-8">
            Purchase Profile
          </Typography>

          <Box display="flex" flexDirection="column" gap={6}>
            {/* Purchase Details Card */}
            <Card className="shadow-xl p-6">
              <CardContent className='bg-green-50'>
                <Typography variant="h6" className="text-center font-semibold text-[#00B251] mb-4">
                  Purchase Details
                </Typography>
                <Typography variant="body1" className="text-black mb-3">
                  <span className="font-bold">Request code:</span> <span className="text-black">{purchaseData?.request_code}</span>
                </Typography>
                <Typography variant="body1" className="text-black mb-3">
                  <span className="font-bold">Status:</span> <span className="text-black">{purchaseData?.status}</span>
                </Typography>
                <Typography variant="body1" className="text-black mb-3">
                  <span className="font-bold">Created At:</span> {new Date(purchaseData?.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body1" className="text-black">
                  <span className="font-bold">Updated At:</span> {new Date(purchaseData?.updated_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>

            <div className='text-center'>
              <Button
              
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}>
                Add Quotation
              </Button>
            </div>

            {/* Product Details Card */}
            <Card className="shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <CardContent>
                <Typography variant="h4" gutterBottom className="text-center font-bold text-[#00B251] mb-8">
                  Product Details
                </Typography>
                {purchaseData?.product_details?.map((product, index) => (
                  <div key={index} className="mb-4 bg-green-50 p-4 relative">
                    {/* Position the buttons at the top-right corner */}
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 1
                    }}>
                      <IconButton
                        onClick={() => handleEditClick(product)}
                        sx={{ color: '#00B251' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        // onClick={() => handleDeleteClick(product.id)} 
                        color="error" disabled={loading}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="body1" className="text-black mb-2">
                      <span className="font-bold">Product Name:</span> {product.product_name}
                    </Typography>
                    <Typography variant="body1" className="text-black mb-2">
                      <span className="font-bold">Brand:</span> {product.brand}
                    </Typography>
                    <Typography variant="body1" className="text-black mb-2">
                      <span className="font-bold">Quantity:</span> {product.quantity}
                    </Typography>
                    <Typography variant="body1" className="text-black mb-2">
                      <span className="font-bold">Category:</span> {product.category}
                    </Typography>
                    <Typography variant="body1" className="text-black mb-2">
                      <span className="font-bold">Variant:</span> {product.variants}
                    </Typography>
                  </div>
                ))}
              </CardContent>
            </Card>

          </Box>
        </div>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleDialogClose}>
          <DialogTitle className='bg-[#00B251] text-white'>Edit Product</DialogTitle>
          <DialogContent className='mt-4'>
            <TextField
              label="Product Name"
              fullWidth
              value={editedProduct?.product_name || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Brand"
              fullWidth
              value={editedProduct?.brand || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Quantity"
              fullWidth
              value={editedProduct?.quantity || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
              margin="dense"
              type="number"
            />
            <TextField
              label="Category"
              fullWidth
              value={editedProduct?.category || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Variant"
              fullWidth
              value={editedProduct?.variants || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, variants: e.target.value })}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button color="primary" disabled={loading}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {openDialog && <AddPurchaseDialog openDialog={openDialog} setOpenDialog={setOpenDialog} quotationData={purchaseData?.product_details}/>}
    </>
  );
};

export default SinglePurchase;
