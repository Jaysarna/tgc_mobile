import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Layout = ({ children }) => {
    return (
        <div>

            <Toaster />
            {children}
        </div>
    );
};

export default Layout;
