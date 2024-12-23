import React, { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx';
import FarmersInformation from './FarmersInformation'
import { Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import Swal from 'sweetalert2';  
const MemberHome = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('access_token');

      const response = await axios.post(
        'https://apis.agrisarathi.com/fposupplier/AddFarmerCsv',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.errors_count > 0) {
          let errorMessages = [];
          if (Array.isArray(response.data.errors)) {
            errorMessages = response.data.errors;
          } else if (typeof response.data.errors === 'object') {
           
            errorMessages = [JSON.stringify(response.data.errors)];
          } else {
            errorMessages = ['An unknown error occurred.'];
          }

          Swal.fire({
            icon: 'error',
            title: 'File Upload Failed',
            html: errorMessages.map((error, index) => `<div key=${index} class="text-red-500">${error}</div>`).join(''),
            didOpen: () => {
              const swalElement = document.querySelector('.swal2-container');
              if (swalElement) {
                swalElement.style.zIndex = 1500;
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'File Uploaded Successfully',
            text: 'Your file has been uploaded successfully.',
            didOpen: () => {
              const swalElement = document.querySelector('.swal2-container');
              if (swalElement) {
                swalElement.style.zIndex = 1500;
              }
            }
          }).then(() => {
            setOpenModal(false);
          });
        }
      } else {
        setError('Something went wrong, please try again later.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Only excel file is supported, please upload excel file.');
    } finally {
      setLoading(false);
    }
  };

  // Download sample Excel file
  const downloadSampleExcel = () => {
    const sampleData = [
      ["mobile_number", "name", "village", "gender", "block"],
      ["0000000000", "XYZ", "XYZ", "Male", "A"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'sample_member.xlsx');
  }

  return (
    <>
      <div className="flex justify-center mt-5">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#00B251] w-1/2 text-white py-2 px-4 rounded-lg hover:bg-[#00B251] transition"
        >
          Upload Excel
        </button>
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogContent className="space-y-4">
          {/* Flex container in column direction for all screen sizes */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={downloadSampleExcel}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition w-full"
            >
              Download Sample Excel
            </button>

            <DialogTitle className="text-center text-xl font-semibold">
              Upload Excel File
            </DialogTitle>

            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="py-2 px-4 border border-gray-300 rounded-lg w-full"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </DialogContent>

        <DialogActions>
          <button
            onClick={handleUpload}
            style={{ zIndex: 10 }}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Excel'}
          </button>
        </DialogActions>
      </Dialog>

      <div className="mt-10">
        <FarmersInformation />
      </div>
    </>
  );
}

export default MemberHome;
