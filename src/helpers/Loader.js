// import Image from 'next/image';
import React from 'react';
// import loader from '../images/loader.gif'
// import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({ msg }) => {
    return (
        <div className='loader-outer'>

            <LoadingPage msg={msg || "Loading"} />

        </div>
    );
}

export default Loader;



export class LoadingPage extends React.Component {
    render() {
        const { msg } = this.props;
        return (
            <>
                <div className="loader-background">
                    <div className="loader">{msg}...</div>
                </div>
            </>
        );
    }
}