import React from 'react';

const strok = '#7F56D9';

export const EditIcon = ({ onClick, className }) => {
    return (
        <div onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" >
                <path d="M16 2.00006C16.2626 1.73741 16.5744 1.52907 16.9176 1.38693C17.2608 1.24479 17.6286 1.17163 18 1.17163C18.3714 1.17163 18.7392 1.24479 19.0824 1.38693C19.4256 1.52907 19.7374 1.73741 20 2.00006C20.2626 2.2627 20.471 2.57451 20.6131 2.91767C20.7553 3.26083 20.8284 3.62862 20.8284 4.00006C20.8284 4.37149 20.7553 4.73929 20.6131 5.08245C20.471 5.42561 20.2626 5.73741 20 6.00006L6.5 19.5001L1 21.0001L2.5 15.5001L16 2.00006Z" stroke={strok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export const AddIcon = ({ className, onClick }) => {
    return (
        <div onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M12 8V16M8 12H16M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke={strok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}


export const ArrowLeftIcon = ({ onClick, className }) => {
    return (
        <div >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={strok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export const ArrowRightIcon = ({ onClick, className }) => {
    return (
        <div >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={strok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export const ViewIcon = ({ onClick, className }) => {
    return (
        <div className={className} onClick={() => onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    )
}