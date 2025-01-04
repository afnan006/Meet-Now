// src/components/FileInput.tsx
import React, { useState } from 'react';
import { storage } from 'src\lib\firebase.ts';  // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from './Button';

export function FileInput() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  // Error state for error handling
  const [fileURL, setFileURL] = useState<string | null>(null);  // File URL for successful uploads

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      console.log('File selected:', selectedFile);  // Debugging file selection
      setFile(selectedFile);
    } else {
      console.error('No file selected');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file to upload.');
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    
    try {
      setUploading(true);  // Start uploading
      setError(null);  // Clear any previous errors

      console.log('Uploading file...');  // Debugging upload process
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      console.log('File uploaded successfully! URL:', fileURL);
      setFileURL(fileURL);  // Save the uploaded file URL
      setUploading(false);  // End uploading
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');  // Set error message
      setUploading(false);  // End uploading
    }
  };

  return (
    <div className="flex items-center">
      {/* File input is hidden, using label to trigger it */}
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button variant="secondary" className="mr-2">
          Choose File
        </Button>
      </label>

      {/* Upload button */}
      <Button onClick={handleUpload} variant="primary" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>

      {/* Show file name if a file is selected */}
      {file && <p className="mt-2">Selected file: {file.name}</p>}

      {/* Show file URL if upload was successful */}
      {fileURL && <p className="mt-2 text-green-500">File uploaded successfully! URL: <a href={fileURL} target="_blank" rel="noopener noreferrer">View File</a></p>}

      {/* Show error message if any */}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
