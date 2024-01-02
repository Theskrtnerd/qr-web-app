import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function CreateEvent() {
  const [eventInfo, setEventInfo] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    link: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission or API call here with the eventInfo
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventInfo),
    };
  
    fetch('/api/create-event/', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Redirect to the /event/ page with the event code
        window.location.href = `/event/${data.code}`;
      })
      .catch((error) => console.error('Error:', error.message));
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

  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen w-full bg-background overflow-hidden relative px-4 lg:px-24 py-8 text-text">
      <div className="pb-4">
          <h1 className="text-2xl lg:text-4xl font-heading font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Create Your Event</span>
          </h1>
          <div className="text-base font-body">
            Enter your event details to start the journey to a successful event!
          </div>
        </div> {/* App Title */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Event Name"
            name="name"
            value={eventInfo.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Description"
            name="description"
            value={eventInfo.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Date"
            name="date"
            type="datetime-local" // Use datetime-local input type for date and time
            value={eventInfo.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Event Location"
            name="location"
            value={eventInfo.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Link"
            name="link"
            value={eventInfo.link}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Create Event
          </Button>
        </form>
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

export default CreateEvent;
