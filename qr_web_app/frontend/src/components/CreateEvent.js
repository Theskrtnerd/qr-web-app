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

  const maxNameLength = 500;
  const maxDescriptionLength = 500;
  const maxLocationLength = 500;
  const maxLinkLength = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate max length based on the field name
    if (name === 'name' && value.length > maxNameLength) {
      alert('Event name cannot exceed 500 characters')
      return; // Do not update state if exceeding max length
    }
    if (name === 'description' && value.length > maxDescriptionLength) {
      alert('Description name cannot exceed 500 characters')
      return;
    }
    if (name === 'location' && value.length > maxLocationLength) {
      alert('Location name cannot exceed 500 characters')
      return;
    }
    if (name === 'link' && value.length > maxLinkLength) {
      alert('Link name cannot exceed 500 characters')
      return;
    }

    setEventInfo((prevEventInfo) => ({
      ...prevEventInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission or API call here with the eventInfo
    if (!eventInfo.name || !eventInfo.description || !eventInfo.date || !eventInfo.location || !eventInfo.link) {
      alert('Please fill in all fields');
      return;
    }

    // If all fields are filled, you can proceed with submitting the form or any other desired action
    console.log('Form submitted:', eventInfo);

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
