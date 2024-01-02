import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-background w-full h-screen overflow-hidden relative px-8 lg:px-24 sm:py-8 py-16 text-text">
      <div className="flex flex-col h-full w-full justify-between gap-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">EventFlow!</span>
          </h1>
          <div className="text-sm md:text-base font-body">
          EventFlow is your all-in-one solution for seamless event management for <span className="font-bold">completely FREE</span>. Whether you're organizing conferences, weddings, or social gatherings, EventFlow simplifies the entire process, ensuring every detail is flawlessly executed.
          </div>
        </div>  {/* App Title */}
        <div>
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">How To Use</h2>
          <div className="text-sm md:text-base font-body">
            <div>1. Get started by creating a new event or joining an existing one.</div>
            <div>2. Fill in the event details and import your guest list effortlessly.</div>
            <div>3. Send out invitations using automatically generated QR code tickets while efficiently tracking RSVPs.</div>
            <div>4. Simplify event check-in by using the QR code scanner at the entrance.</div>
          </div>
        </div> {/* How To Use */}
        <div className="flex gap-8 w-full justify-center">
          <Link to={"/create"} style={{ textDecoration: 'none' }} className="hover:scale-105 ease-in-out delay-100 duration-300 hover:-translate-y-2">
            <button className="px-8 py-3 md:py-4 text-sm md:text-base bg-primary font-body rounded-lg drop-shadow-lg">Create Event</button>
          </Link>
          <Link to={"/join"} style={{ textDecoration: 'none' }} className="hover:scale-105 ease-in-out delay-100 duration-300 hover:-translate-y-2">
            <button className="px-8 py-3 md:py-4 text-sm md:text-base bg-secondary font-body rounded-lg drop-shadow-lg">Join Event</button>
          </Link>
        </div> {/* Create/Join Button */}
        <div>
          
          <h2 className="text-xl font-body font-bold decoration-4 decoration-accent underline">Contribution & Feedback</h2>
          <div className="text-sm md:text-base font-body">
            <div>This is only a solo personal project, so I truly appreciate any feedback you have.</div>
            <div>If you have feature requests or suggestions, please feel free to reach out to me through GitHub or LinkedIn.</div>
            <div>Contact me on <a href="https://github.com/Theskrtnerd" className="text-blue-500" target="_blank" rel="noopener noreferrer">GitHub</a> or <a href="https://www.linkedin.com/in/xineohperif/" className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</div>
          </div>
        </div> {/* Contribution */}
      </div>
      <div className='pointer-events-none'>
        <div className="absolute top-0 -left-4 w-[30vw] h-[30vw] bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ">
        </div>
        <div className="absolute top-0 -right-4 w-[30vw] h-[30vw] bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000">
        </div>
        <div className="absolute -bottom-8 left-20 w-[30vw] h-[30vw] bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000">
        </div>
      </div>
    </div>
  );
};

export default HomePage;
