import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Layout = ({ children }) => {
    return (
        <div>

            <Toaster
                position="top-center"
                autoClose={4000}
                closeOnClick
            />
            {children}
        </div>
    );
};

export default Layout;
