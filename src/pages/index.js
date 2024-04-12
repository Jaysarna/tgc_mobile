import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import logo from '../images/logo.jpg'
import axios from 'axios';
import { useRouter } from 'next/router';
import Loader, { LoadingPage } from '../helpers/Loader';
// import Cookies from 'js-cookie';
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

const loginurl = 'https://tgc67.online/api/method/tgc_custom.server_script.login_api.login';

const headers = {
  "Content-Type": "multipart/form-data",
};




export default function Home() {

  const route = useRouter();
  const [isLoad, setLoad] = useState(false)
  useEffect(() => {


    let api_key1 = sessionStorage.getItem('api_key');
    let api_secret1 = sessionStorage.getItem('api_secret');
    if (api_key1 && api_secret1) {
      route.push('/main')
      setLoad(false)
    }
    else {
      setLoad(true)
    }
  }, [])
  // console.log(logo)
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}

      </Head>
      {isLoad && <Login />}
    </>
  )
}


const Login = () => {

  const [username, setUsername] = useState('administrator');
  const [password, setPassword] = useState('admin');

  const [isLoad, setLoad] = useState(false)
  const route = useRouter()

  async function handleLogin(e) {
    setLoad(true);
    e.preventDefault();
    // let formdata = {
    //   "usr": username,
    //   "pwd": password
    // }
    const formdata = new FormData()

    formdata.append('usr', username)
    formdata.append('pwd', password)

    try {
      const loginRes = await axios.post(loginurl, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      if (loginRes.status === 200) {

        // localStorage.setItem('api_key', loginRes.data.message.api_key)
        // localStorage.setItem('api_secret', loginRes.data.message.api_secret)
        sessionStorage.setItem('api_key', loginRes.data.message.api_key);
        sessionStorage.setItem('api_secret', loginRes.data.message.api_secret);
        sessionStorage.setItem('userName', loginRes.data.message.username)

        setLoad(false);
        // console.log('fired')
        route.push('/main')
      }
    }
    catch (err) {
      console.log(err)
    }

    setLoad(false)
  }


  return (
    <>

      {isLoad &&
        <LoadingPage msg="Login" />}

      <div className="login-container mt-4">


        <div className="rown" style={{ overflow: 'hidden' }}>
          <div className="col-md-12 d-flex flex-column align-items-center justify-content-center" style={{ padding: '10px !important' }}>


            <div className="card mb-3">

              <div className="card-body">

                <div className=" d-flex justify-content-center">

                  {/* <Image src={logo} alt="Logo" width={150} height={150} /> */}
                  <Image src={'/logo.jpg'} alt="Logo" width={150} height={150} />


                </div>
                <div className="pt-4 pb-2">
                  <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                  <p className="text-center" >Enter your username & password to login</p>
                </div>

                <form onSubmit={handleLogin} className="row g-3 needs-validation" method="POST" enctype="multipart/form-data">

                  <div className="col-12">
                    <label htmlFor="yourUsername" className="form-label">Username</label>
                    <div className=" has-validation">
                      {/* <span className="input-group-text" id="inputGroupPrepend"><i className="bi bi-person"></i></span> */}
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        id="yourUsername"
                        required
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                      />
                      <div className="invalid-feedback">Please enter your username.</div>
                    </div>
                  </div>

                  <div className="col-12 mb-4 ">
                    <label htmlFor="yourPassword" className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="yourPassword"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <div className="invalid-feedback">Please enter your password!</div>
                  </div>
                  <br />

                  <div className="w-100">
                    <button className="btn btn-primary login-btn" type="submit">Login</button>
                  </div>
                  {/* <div className="col-12">
                        <p className="small mb-0">Don't have account? <Link to="/signup">Create an account</Link></p>
                      </div> */}
                </form>

              </div>
            </div>

            {/* <div className="credits">
                    Designed by <Link to="#"> DMJ Admin </Link>
                  </div> */}

          </div>
        </div>
      </div>

    </>
  )
}