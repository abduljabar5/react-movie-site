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

const Series = () => {
    const [contents, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    const getContent = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://api.jikan.moe/v4/top/anime?type=tv&page=1&filter=bypopularity`
            );
console.log(response);
            setContent(prevContent => [...prevContent, ...response.data.data]);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getContent();
    }, [page]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

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
                    <Row xs={1} md={4} className="g-5 m-4">
                        {contents.map((content) => (
                            <Col key={content.mal_id}>
                                <Link to={`/details?id=${content.mal_id}`}>
                                    <Card className='contentcard'>
                                        <Card.Img className='cardimage' src={content.images.jpg.large_image_url} alt="Card image" />
                                        <Card.ImgOverlay>
                                            <img className='playbtn' src={play}></img>
                                            <div className='imageoverlay'>
                                                <Card.Title>{content.title}</Card.Title>
                                                <Card.Text>{`Rank: ${content.rank}`}</Card.Text>
                                            </div>
                                        </Card.ImgOverlay>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    <Button onClick={handleLoadMore}>Load more</Button>
                </>
            )}
        </div>
    );
};

export default Series;
