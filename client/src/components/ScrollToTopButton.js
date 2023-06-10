import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import '../styles/NotFound.css';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
          setVisible(true)
        } 
        else if (scrolled <= 300){
          setVisible(false)
        }
    };

    const scrollToTop = () =>{
       window.scrollTo({
         top: 0, 
         behavior: 'smooth'
        });
    };
   
    window.addEventListener('scroll', toggleVisible);

    return (
        <button className="scrollToTopButton" onClick={scrollToTop} style={{display: visible ? 'inline' : 'none'}}>
            <FontAwesomeIcon icon={faArrowCircleUp} size="2x" />
        </button>
    );
}

export default ScrollToTopButton;
