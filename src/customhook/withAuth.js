import Layout from '@/components/Layout';
import Loader from '@/helpers/Loader';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// This is the HOC
const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // const api_key = localStorage.getItem('api_key');
      // const api_secret = localStorage.getItem('api_secret');
      let api_key1 = sessionStorage.getItem('api_key');
      let api_secret1 = sessionStorage.getItem('api_secret');
      // Check if the user's <credentials></credentials> are present
      if (api_key1 && api_secret1) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.clear()
        Router.push('/');
      }
    }, [Router]);


    if (isAuthenticated) {
      return (<Layout>
        <WrappedComponent {...props} />
      </Layout>)
    }


    return <div><Loader /></div>;
  };
};

export default withAuth;
