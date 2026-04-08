import React, { useCallback } from 'react';;
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  
  return (
    <React.Fragment>
      <div className='fixed inset-0 blur-xl h-[580px]' style={{ background: "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(121, 249, 153, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)", zIndex: -1, }} ></div>
        <Navbar />
      <main
        sx={{
          variant: 'layout.main',
        }}
      >
        {children}
      </main>
      <Footer />
    </React.Fragment>
  );
}
