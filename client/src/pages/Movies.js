import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import play from '../styles/images/play.svg'
import filterlist from '../styles/images/filter.svg'
const Movies = () => {
  const [contents, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('popular');

  const getContent = async () => {
    try {
      console.log('trying to run news');
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${filter}?language=en-US&page=${page}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      setContent((prevContents) => [...prevContents, ...res.data.results]);
      setIsLoading(false);
    } catch (err) {
      console.log("🚀 ~ file: Movies.js:27 ~ getContent ~ err:", err)

    }
  };

  useEffect(() => {
    getContent();
  }, [page, filter]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
    setContent([]);
  }
  return (
    <div>
      {isLoading ? (
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} /> <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="primary" xs={6} />
        </Card.Body>
      ) : (
        <>
          <div className='sort-container'>
            <p>
              <img className='' src={filterlist}></img>
            </p>
            <Form.Control className='sort mt-5' as="select" value={filter} onChange={handleFilterChange}>
              <option value="popular">popular</option>
              <option value="top_rated">Top Rated</option>
              <option value="now_playing">Now Playing</option>
              <option value="upcoming">Up Coming</option>
            </Form.Control>
          </div>
          <h1 className='text-center'>Movies</h1>
          <Row xs={1} md={4} className="g-5 m-4">
            {contents.map((content) => (
              <Col key={content.id}>
                <Link to={`/moviedetails?id=${content.id}`}>
                  <Card className='contentcard'>
                    <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/w500${content.poster_path}`} alt="Card image" />

                    <Card.ImgOverlay >

                      <img className='playbtn' src={play}></img>
                      <div className='imageoverlay'> <Card.Title>{content.title}</Card.Title>
                        <Card.Text>{content.release_date}</Card.Text></div>

                    </Card.ImgOverlay>
                  </Card></Link>
              </Col>
            ))}
          </Row>
          <Button onClick={handleLoadMore}>Load more</Button>
        </>
      )}
    </div>
  );
};

export default Movies;
