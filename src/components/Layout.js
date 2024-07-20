import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Layout = ({ children }) => {
    return (
        <div>

            <Toaster
                position="top-center"
                autoClose={5000}
                closeOnClick
            />
            {children}
        </div>
    );
};

export default Layout;
