import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function CarouselCards({ additionalData }) {

    return (
        <div className="container similar">
            <h2>Similar</h2>
            <ul className="cards">
                {additionalData.similars.map((item, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-3" style={{width:'24%'}} key={index}>
                    <Card className='contentcard'>
                    <Link to={`/show?id=${item.id}`}>
                        <Card.Img className='cardimage' style={{minHeight:'433px', maxHeight:'433px'}}  src={item.image} alt="Card image" />
                       
                        <Card.ImgOverlay className='imageoverlay' style={{display:'flex', justifyContent:'space-between'}}>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.imDbRating}</Card.Text>
                        </Card.ImgOverlay>
                  </Link>
                    </Card>
                </div>
                ))}
            </ul>
        </div>
    );
}

export default CarouselCards;
