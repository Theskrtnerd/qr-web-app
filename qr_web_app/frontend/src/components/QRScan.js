import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const QRScan = () => {
  const { eventCode } = useParams();
  const [delay] = useState(100);
  const [qrEnabled, setQrEnabled] = useState(true);

  const handleScan = (data) => {
    if (data !== null && qrEnabled) {
      // Disable the QR reader to prevent multiple scans
      setQrEnabled(false);

      // Send the data.text to 'api/check-guest/' endpoint
      fetch('/api/check-guest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: data.text }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          // Handle the response as needed
          alert(responseData.message);
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors
        })
        .finally(() => {
          // Enable the QR reader after processing the response
          setQrEnabled(true);
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 320,
    width: 320,
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Corben, sans-serif', // Replace with your custom font
    },
    palette: {
      primary: {
        main: '#5cba95', // Replace with your custom color
        contrastText: '#fff',
      },
    },
  });

  useEffect(() => {
    console.log('Event Code:', eventCode);
  }, [eventCode]);

  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen w-full bg-background overflow-hidden relative px-4 lg:px-24 py-8 text-text">
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="text-2xl lg:text-4xl font-heading font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">QR Code Scanner</span>
          </h1>
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            // Pass the qrEnabled state to the component to enable/disable it dynamically
            disabled={!qrEnabled}
          />
        </div>
        <div className='pointer-events-none'>
          {/* Animation blobs */}
          <div className="absolute top-0 -left-4 w-[30vw] h-[30vw] bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ">
          </div>
          <div className="absolute top-0 -right-4 w-[30vw] h-[30vw] bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000">
          </div>
          <div className="absolute -bottom-8 left-20 w-[30vw] h-[30vw] bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000">
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default QRScan;