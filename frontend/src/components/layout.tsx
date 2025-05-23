import React from 'react';
import Header from './header';


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <Header />
        <main className="mt-16">{children}</main> 
      </div>
    );
  };
  

export default Layout;