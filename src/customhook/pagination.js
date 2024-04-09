import { ArrowLeftIcon, ArrowRightIcon } from "@/icons/actions";


export const Pagination = () => {
    return (
        <div className="pgn-vw-box mt-3 p-2">
            <div className="pre-btnvw d-flex">
                <ArrowLeftIcon className='mt-1' />
                <p className="mt-2 mb-vw-page">Previous</p>
            </div>

            <div className="pagination">
                <p>1</p>
                <p className="ms-2">2</p>
                <p className="ms-2">3</p>
                <p className="ms-2">4</p>
                <p className="ms-2">5</p>
            </div>
            <div>
                <p className='mb-pagefnt-size'>Page 1 to 10</p>
            </div>

            <div className="pre-btnvw d-flex">
                <p className="mt-2 mb-vw-page">Next</p>
                <ArrowRightIcon className='mt-1' />
            </div>
        </div>
    );
};
