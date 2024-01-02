import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Fab from '@mui/material/Fab'; // Import Fab component
import QrCodeIcon from '@mui/icons-material/QrCode';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const Event = () => {
  const { eventCode } = useParams();
  const [eventDetails, setEventDetails] = useState(null);

  const rows = [
    { id: 1, col1: 'Hello', col2: 'World', col3: true },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome', col3: false },
    { id: 3, col1: 'MUI', col2: 'is Amazing', col3: true },
  ];
  
  const columns = [
    { field: 'col1', headerName: 'Name', width: 150 },
    { field: 'col2', headerName: 'Email', width: 150 },
    { field: 'col3', headerName: 'Ticket Checked', width: 150, type: 'boolean' },
  ];

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const response = await fetch(`/api/get-event/?code=${eventCode}`);
        if (!response.ok) {
          // If the response is not ok (404), handle accordingly
          console.error(`HTTP error! Status: ${response.status}`);
          // You may redirect to a custom 404 page or handle it as per your requirements
        } else {
          const data = await response.json();
          setEventDetails(data);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    getEventDetails();
  }, [eventCode]);

  // Custom theme
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

  if (!eventDetails) {
    // You may show a loading indicator or handle it as per your requirements
    return (
      <ThemeProvider theme={theme}>
        <div className="h-screen w-full bg-background overflow-hidden relative px-4 lg:px-24 py-8 text-text">
          <div className="pb-8">
            <h1 className="text-2xl lg:text-4xl font-heading font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">404 Not Found</span>
            </h1>
            <div className="text-base font-body">
              Sorry, the event you are looking for does not exist. Please try again.
            </div>
          </div> {/* App Title */}
          <div className='pointer-events-none'>
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
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="min-h-screen w-full bg-background overflow-x-hidden relative px-4 lg:px-24 py-8 text-text no-scrollbar">
      <div className="pb-8">
        <h1 className="text-2xl lg:text-4xl font-heading font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Your Event</span>
        </h1>
        <div className="text-base font-body">
          Full Details of Your Event
        </div>
      </div> {/* App Title */}
      <div>
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">Event's Information</h2>
          <div className="text-sm md:text-base font-body">
            <div>Event Name: {eventDetails.name}</div>
            <div>Event Description: {eventDetails.description}</div>
            <div>Event Date & Location: {eventDetails.date} & {eventDetails.location}</div>
            <div>Event Link: {eventDetails.link}</div>
          </div>
        </div> {/* How To Use */}

      <div>
        <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">Guest's List</h2>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
      </div> {/* How To Use */}
      <div className="absolute top-8 right-8">
        <div className='md:hidden'>
          <Fab color="primary" aria-label="qr">
            <QrCodeIcon/>
          </Fab>
        </div>
        <div className="hidden md:block">
          <Fab variant="extended" color="primary" aria-label="qr">
            <QrCodeIcon sx={{ mr: 1 }} />
            Scan QR Code
          </Fab>
        </div>
      </div> {/* QR Code Button */}
      <div className='pointer-events-none'>
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

export default Event;