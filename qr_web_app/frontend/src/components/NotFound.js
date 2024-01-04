import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';

const NotFound = () => {

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
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">404 Not Found</span>
            </h1>
            <div className="text-base font-body">
              Sorry, the page you are looking for does not exist. Please try again.
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
};

export default NotFound;
