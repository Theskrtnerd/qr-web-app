import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';

const JoinEvent = () => {
  const [eventCode, setEventCode] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEventCode(e.target.value.toUpperCase()); // Convert input to uppercase
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the event code (you may need additional validation logic)
    if (/^[A-Za-z0-9]{8}$/.test(eventCode)) {
      // Attempt to navigate to the /event/ page with the entered event code
      try {
        await navigate(`/event/${eventCode}`);
      } catch (error) {
        // If navigation fails (404), show an alert to the user
        alert(`Invalid event code. Please enter a valid 8-character code.`);
      }
    } else {
      alert('Invalid event code. Please enter a valid 8-character code.');
    }
  };

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

  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen w-full bg-background overflow-hidden relative px-4 lg:px-24 py-8 text-text">
        <div className="pb-8">
          <h1 className="text-2xl lg:text-4xl font-heading font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Join An Existing Event</span>
          </h1>
          <div className="text-base font-body">
            Enter an 8-character code given to you by the event organizer to join an existing event. Collaborate with them to make your event a success!
          </div>
        </div> {/* App Title */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Event Code"
            variant="outlined"
            value={eventCode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              maxLength: 8,
              minLength: 8,
              pattern: '^[A-Za-z0-9]{8}$',
              required: true,
            }}
          />
          <Button variant="contained" color="primary" type="submit">
            Join Event
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
};

export default JoinEvent;
