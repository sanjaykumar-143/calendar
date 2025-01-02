import { useState } from 'react';
import axios from 'axios';
import { uploadFile } from '../api/index.js';
// Define the uploadFile function
import './file.css'
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({
    message: '',
    uploadedData: null,
    isLoading: false,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
      setStatus({ ...status, message: '' });
    } else {
      setStatus({ ...status, message: 'Please upload a valid .xlsx file.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ ...status, message: 'Please select a file before uploading.' });
      return;
    }

    setStatus({ ...status, isLoading: true, message: '' });

    try {
      const response = await uploadFile(file);
      setStatus({
        message: 'File uploaded and processed successfully!',
        uploadedData: response.jsonData || [],
        isLoading: false,
      });
    } catch (err) {
      console.error('Error uploading file:', err.message);
      setStatus({
        message: 'Failed to upload file. Please try again.',
        uploadedData: null,
        isLoading: false,
      });
    }
  };

  return (
    <div className="file-upload">
      <h3>Upload Company Details (Excel)</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx" />
        <button type="submit" disabled={status.isLoading}>
          {status.isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {status.message && <p>{status.message}</p>}

      {/* {status.uploadedData && status.uploadedData.length > 0 && (
        <div>
          <h4>Uploaded Data:</h4>
          <pre>{JSON.stringify(status.uploadedData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default FileUpload;



