import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import AddPrice from './AddPrice';  // Assuming AddPrice is in the same directory

const AddPriceDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}
         fullWidth maxWidth="lg"
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
                Add Product Price
            </DialogTitle>
            <DialogContent>
                <AddPrice />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPriceDialog;
