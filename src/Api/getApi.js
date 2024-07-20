import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '@/helpers/Header';

const useServerSideRendering = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      const authHeader = getAuthHeader()
      try {
        const response = await axios.get(url, authHeader);
        setData(response.data);
      } catch (error) {
        if (error.response?.status === 479) {
          sessionStorage.clear()
        }
        else {
          console.error('API Error:', error);
          const jsonArray = JSON.parse(error.response.data._server_messages);


          if (Array.isArray(jsonArray) && jsonArray.length > 0) {
            const firstObject = JSON.parse(jsonArray[0]);
            const message = firstObject.message;
            const title = firstObject.title;
            const indicator = firstObject.indicator;
            const raiseException = firstObject.raise_exception;

            // console.log('Message:', message);
            alert(message)
          } else {
            console.error('Invalid JSON structure');
          }
        }
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useServerSideRendering;
