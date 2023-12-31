# Event Management Web App

Welcome to the Event Management Web App, a comprehensive solution for efficient event planning and organization.

## Project Overview

This web application is built using Django, React, Webpack, Babel, and TailwindCSS to provide a seamless experience for event management. The following features highlight the capabilities of the system:

- **Efficient Event Management:** The backend is developed using Django and Django REST framework, ensuring a robust and scalable solution for managing various aspects of events.

- **QR Code Scanning and Automated Ticket Generation:** The system includes QR code scanning functionality for streamlined event check-ins. Automated ticket generation ensures a hassle-free entry process for attendees.

- **Frontend with React and TailwindCSS:** The frontend is crafted using React, offering a dynamic and responsive user interface. TailwindCSS is employed for efficient styling, providing a clean and modern look.

- **Webpack and Babel for Production:** Webpack and Babel are utilized to compile the frontend code for production, optimizing performance and ensuring compatibility across different browsers.

## Getting Started

Follow these steps to set up and run the Event Management Web App locally:

1. Clone the repository: `git clone https://github.com/Theskrtnerd/qr-web-app.git`
2. Install dependencies: `npm install` and `pip install -r requirements.txt`
3. Run the development server: `npm run dev` for the frontend and `python manage.py runserver` for the backend.

## How to Use The Web App

Follow these steps to utilize the features of the Event Management Web App:

### 1. Create or Join an Event

- **Create New Event:**
  1. Log in to the web app.
  2. Navigate to the "Create Event" section.
  3. Fill in the required details such as event name, date, and location.
  4. Save the event to generate a unique event ID.

- **Join Existing Event:**
  1. Log in to the web app.
  2. Navigate to the "Join Event" section.
  3. Enter the event ID provided by the event organizer.
  4. Join the event to access event details.

### 2. Send Autogenerated Tickets

- **Autogenerated Tickets:**
  1. After creating or joining an event, go to the "Guest List" section.
  2. Add guests by entering their details.
  3. Save the guest list to automatically generate tickets for each guest.

### 3. Event Check-In

- **QR Code Scanning:**
  1. On the event day, log in to the web app.
  2. Navigate to the "QR Scan" section.
  3. Use the QR code scanning functionality to check in guests.
  4. Guests can present their autogenerated tickets for quick and efficient check-in.

## Contributing & Feedback

If you'd like to give a feedback or contribute to the project, just send me an email and I will happily answer.

## License

This project is licensed under the [MIT License](LICENSE).
