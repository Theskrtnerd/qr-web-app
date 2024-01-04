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
  const [isSendingTickets, setIsSendingTickets] = useState(false);
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
      secondary: {
        main: '#8ce1c0',
        contrastText: '#121413',
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

  
    const updatedGuestList = guestList.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: field === 'col3' ? !row[field] : row[field] };
      }
      return row;
    });
  
    setGuestList(updatedGuestList);
  };
  

  const handleSaveChanges = () => {
  
    // Prepare the payload
    const payload = {
      eventCode: eventCode,
      guests: guestList.map(guest => ({
        name: guest.col1,
        email: guest.col2,
        ticketChecked: guest.col3,
      })),
    };
  
    // Make a fetch request to update the backend with the changes
    fetch('/api/update-guest-list/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        // Handle error as needed
      } else {
        return response.json();
      }
    })
    .then(data => {
      // Handle success, you can use the data returned from the server
      alert('Guests updated successfully!');
      console.log('Guests updated successfully:', data);
    })
    .catch(error => {
      console.error('Error:', error.message);
      // Handle other errors as needed
    });
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

  const handleSendTickets = () => {
    // Assuming eventCode is available in your component state or props
    setIsSendingTickets(true);
    // Make a POST request to the 'api/send-emails' endpoint
    fetch('/api/send-emails/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventCode: eventCode }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert('Emails Sent!');
        console.log('Response:', data);
        // Handle the response as needed
        setIsSendingTickets(false);
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
      });
  };

  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = eventDetails.date ? new Date(eventDetails.date).toLocaleDateString([], options) : '';
  const formattedTime = eventDetails.date ? new Date(eventDetails.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen w-full bg-background overflow-x-hidden relative px-4 lg:px-24 py-8 text-text no-scrollbar">
        <div className="pb-8">
          <h1 className="text-xl lg:text-3xl font-heading font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">{eventDetails.name}</span>
          </h1>
          <div className="text-base font-body">
            {eventDetails.description}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline pb-4">Event's Information</h2>
          <div className="text-sm md:text-base font-body p-4 bg-secondary bg-opacity-50 rounded-xl drop-shadow-xl">
            <div><span class="font-semibold">Date and time:</span> {formattedDate} , {formattedTime}</div>
            <div><span class="font-semibold">Location:</span> {eventDetails.location}</div>
            <div><span class="font-semibold">Event's link:</span> {eventDetails.link}</div>
            <div><span class="font-semibold">Number of guests:</span> {guestList.length}</div>
          </div>
        </div>
        <div class="pt-4">
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline pb-4">Guest's List</h2>
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
          <div className="mt-4 flex gap-4">
            {/* Add a Save button to trigger handleSaveChanges */}
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
             {/* Add the "Send Tickets through Email" button */}
            <Button variant="contained" color="secondary" onClick={handleSendTickets} disabled={isSendingTickets}>
              Send Tickets through Email
            </Button>
          </div>
        </div>
        <div className="fixed top-8 right-8">
          <div className='md:hidden'>
            <a href={`/scan/${eventCode}`}>
              <Fab color="primary" aria-label="qr">
                <QrCodeIcon/>
              </Fab>
            </a>
          </div>
          <div className="hidden md:block">
            <a href={`/scan/${eventCode}`}>
              <Fab variant="extended" color="primary" aria-label="qr">
                <QrCodeIcon sx={{ mr: 1 }} />
                Scan QR Code
              </Fab>
            </a>
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
