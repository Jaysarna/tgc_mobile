import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Layout = ({ children }) => {
    return (
        <div>

            <Toaster
                position="top-right"
                autoClose={3000}
                closeOnClick

            />
            {children}
        </div>
    );
};

export default Layout;
