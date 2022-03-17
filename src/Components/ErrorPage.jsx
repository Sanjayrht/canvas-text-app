import React from 'react';
import { BiError } from 'react-icons/bi'
const ErrorPage = ({ error }) => {
    return (

        <div className='col-md-12 error'>
            <div>
                <h1><BiError color='coral' />Oops!</h1>
                {error.status &&
                    <h3> {error.status} {error.statusText}</h3>
                }
                {error.message &&
                    <p><strong> MESSAGE:</strong> {error.message}</p>
                }
            </div>
        </div>
    );
}

export default ErrorPage;
