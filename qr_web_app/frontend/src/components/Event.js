import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab'; // Import Fab component
import QrCodeIcon from '@mui/icons-material/QrCode';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Papa from 'papaparse';
import Button from '@mui/material/Button';

const Event = () => {

  const { eventCode } = useParams();
  const [eventDetails, setEventDetails] = useState(null);

  const [guestList, setGuestList] = useState([]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const response = await fetch(`/api/get-event/?code=${eventCode}`);
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
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

  // Fetch guest list after getting event details
  useEffect(() => {
    if (eventDetails) {
      const fetchGuestList = async () => {
        try {
          const response = await fetch(`/api/get-guest-list/?eventCode=${eventCode}`);
          if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
          } else {
            const data = await response.json();
            const transformedData = data.map((guest) => ({
              id: guest.id+1,
              col1: guest.name,
              col2: guest.email,
              col3: guest.ticketChecked,
            }));
      
            console.log('Guest List:', transformedData);
            setGuestList(transformedData);
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      };

      // Call the fetchGuestList function when needed
      fetchGuestList();
    }
  }, [eventCode, eventDetails]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      try {
        const content = await readFileContents(file);
        const csvData = await parseCSV(content);
        updateGuestList(csvData);
      } catch (error) {
        console.error('Error reading or parsing CSV file:', error.message);
      }
    }
  };

  const readFileContents = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
  
      // Read the file as text
      reader.readAsText(file);
    });
  };

  const parseCSV = (csvContent) => {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error('Error parsing CSV file'));
          } else {
            const parsedData = result.data.map((row, index) => ({
              id: index + 1,
              col1: row.name || '',
              col2: row.email || '',
              col3: row.ticketChecked === 'true' || false,
            }));
            resolve(parsedData);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const updateGuestList = async (csvData) => {
    console.log('CSV Data:', csvData);
  
    // Iterate through each row in the CSV data
    for (const row of csvData) {
      const { col1, col2, col3 } = row;
  
      // Call the addGuest function for each row
      await addGuest(col1, col2, col3, eventCode);
    }
  
    // Update the guest list state or perform any necessary operations
    setGuestList(csvData);
  
    // Display feedback (you can use a toast notification or other UI element)
    alert('CSV file imported successfully!');
  };

  // Define columns
  const columns = [
    { field: 'col1', headerName: 'Name', flex: 1 },
    { field: 'col2', headerName: 'Email', flex: 1 },
    { field: 'col3', headerName: 'Ticket Checked', width: 150, type: 'boolean', editable: true },
  ];

  // Custom theme
  const theme = createTheme({
    typography: {
      fontFamily: 'Corben, sans-serif',
    },
    palette: {
      primary: {
        main: '#5cba95',
        contrastText: '#fff',
      },
    },
  });

  const addGuest = async (name, email, ticketChecked, eventCode) => {
    try {
      const response = await fetch('/api/create-guest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          ticketChecked: ticketChecked,
          eventCode: eventCode,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        // Handle error as needed
      } else {
        const data = await response.json();
        // Handle success, you can use the data returned from the server
        console.log('Guest added successfully:', data);
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle other errors as needed
    }
  };

  const handleCellEditStop = (params, event) => {
  
    // You can save changes here if needed
    const { id, field, value } = params;
  
    // If the field is of type 'boolean', ensure the value is a boolean
    const updatedValue = field === 'col3' ? value === 'true' : value;
  
    const updatedGuestList = guestList.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: updatedValue };
      }
      return row;
    });
  
    setGuestList(updatedGuestList);
  };
  

  const handleSaveChanges = () => {
    // Implement the logic to save changes to the server/database
    console.log('Saving changes:', guestList);
    // You can make a fetch request or any other method to update the backend with the changes
  };

  if (!eventDetails) {
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
          </div>
          <div className='pointer-events-none'>
            {/* Animation blobs */}
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
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">{eventDetails.name}</span>
          </h1>
          <div className="text-base font-body">
            {eventDetails.description}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">Event's Information</h2>
          <div className="text-sm md:text-base font-body">
            <div>Event Date & Location: {eventDetails.date} & {eventDetails.location}</div>
            <div>Event Link: {eventDetails.link}</div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">Guest's List</h2>
          <div className="mb-4">
          <TextField
            label="Upload CSV File"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            InputProps={{
              startAdornment: (
                <IconButton component="label">
                  <AttachFileIcon />
                  <input type="file" hidden onChange={handleFileUpload} />
                </IconButton>
              ),
            }}
          />
        </div>
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid editMode="row" rows={guestList} columns={columns} pageSize={10} onRowEditStop={handleCellEditStop}/>
          </div>
          <div className="mt-4">
            {/* Add a Save button to trigger handleSaveChanges */}
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
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
        </div>
        <div className='pointer-events-none'>
          {/* Animation blobs */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Event;
