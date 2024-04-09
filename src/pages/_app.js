import '@/styles/globals.css';
import '@/styles/login.css';
import '@/styles/main.css';
import Head from 'next/head';
import '@/styles/newitem.css';
import '@/styles/datatable.css';
import '@/styles/loader.css';
import '@/styles/customerList.module.css'
import '@/styles/test.css';
import '@/styles/card1.css';
import '@/styles/update.css';
import '@/styles/notification.css';
import '@/styles/muiUpdate.css';



export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />

    </>
  )

}
