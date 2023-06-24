import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function CarouselCards({ additionalData }) {
  const [tmdbIds, setTmdbIds] = useState({});

  useEffect(() => {
    const fetchTmdbIds = async () => {
      const promises = additionalData.similars.map((item) => 
        axios.get(`https://api.themoviedb.org/3/find/${item.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&external_source=imdb_id`)
      );

      const responses = await Promise.all(promises);
      const ids = responses.reduce((acc, res, i) => {
        if (res.data.movie_results[0]) {
          acc[additionalData.similars[i].id] = res.data.movie_results[0].id;
        }

        return acc;
      }, {});

      setTmdbIds(ids);
    };

    fetchTmdbIds();
  }, [additionalData]);

  return (
    <div className="container similar">
      <h2 className='title text-center'>Similar</h2>
      <ul className="cards">
        {additionalData.similars.map((item, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-3"  key={index}>
            <Card className='contentcard'>
              <Link to={additionalData.type==='TVSeries'? (`/show?id=${item.id}`):(`/moviedetails?id=${tmdbIds[item.id]}`)}>
                <Card.Img className='cardimage' style={{minHeight:'500px', maxHeight:'500px'}}  src={item.image} alt="Card image" />
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

