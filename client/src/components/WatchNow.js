import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import moviebox from '../styles/images/moviebox.webp'
import flixhq from '../styles/images/flixhq.png'

const ButtonSlideOut = ({prompt}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div >
      <SplitButton
      style={{height:'100%'}}
        id={`dropdown-button-drop-end`}
        drop={'end'}
        variant="secondary"
        title={ isActive ? "Close Now" : "Watch Now" }
        onClick={handleClick}
        className="watch-btn"
      >
        <Dropdown.Item eventKey="1" href={'https://www.movieboxpro.app/index/search?word=' + prompt.title} target="_blank" style={{display:'flex', width:'50%', backgroundColor:'black', margin:'auto', borderRadius:'5px'}}>
        <img className="mx-auto" src={moviebox} width="60" alt=""/>
         
        </Dropdown.Item>
        <Dropdown.Item eventKey="1" href={'https://flixhq.to/search/' + prompt.title} target="_blank" style={{display:'flex', width:'50%', backgroundColor:'black', margin:'auto', marginTop:'10px', borderRadius:'5px'}}>
        <img className="mx-auto" src={flixhq} width="60" alt=""/>
         
        </Dropdown.Item>
        <Dropdown.Item eventKey="1" href={'https://flixhq.to/search/' + prompt.title} target="_blank" style={{display:'flex', width:'50%', backgroundColor:'black', margin:'auto', marginTop:'10px', borderRadius:'5px'}}>
        <img className="mx-auto" src={flixhq} width="60" alt=""/>
         
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
      </SplitButton>
    </div>
  );
};

export default ButtonSlideOut;

