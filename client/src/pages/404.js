import React from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';


import '../styles/NotFound.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faH, faHome } from '@fortawesome/free-solid-svg-icons';
function NotFound() {
    const location = useLocation();
  const navigate = useNavigate();

    return (
        <div className="notfound-copy">
        <img src='https://mindbodygreen-res.cloudinary.com/image/upload/c_crop,x_0,y_58,w_1120,h_629/c_fill,g_auto,w_900,h_500,q_auto,f_auto,fl_lossy/dpr_2.0/org/iso0xkrp5lau3slid.jpg' alt='Background'></img>
        <div style={{zIndex:'4'}}>
            <h1>Page Not Found</h1>
             {location.pathname !== '/' && (
            <button className='btn btn-outline-light' onClick={() => navigate(-1)}><FontAwesomeIcon icon={faBackward} className="mx-2 my-auto" /> BACK</button>
            )}<Link to='/'> 
            <button className='btn btn-outline-light'> <FontAwesomeIcon icon={faHome} className="mx-2 my-auto" /> HOME</button>
</Link>
           
         

        </div>
    </div>
    
    );
}

export default NotFound;
