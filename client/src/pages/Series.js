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
    const [contents2, setContent2] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchUs, setSearchUS] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('popular');
    const [displayLimit, setDisplayLimit] = useState(20);

    const getContent = async () => {
        try {
            let res;
            const storageKeyIMDb = `content-IMDb`;
            const storageKeyTMDB = `content-TMDB-${filter}-${page}`;
            const savedDataJsonIMDb = localStorage.getItem(storageKeyIMDb);
            const savedDataIMDb = savedDataJsonIMDb ? JSON.parse(savedDataJsonIMDb) : null;
            const savedDataJsonTMDB = localStorage.getItem(storageKeyTMDB);
            const savedDataTMDB = savedDataJsonTMDB ? JSON.parse(savedDataJsonTMDB) : null;

            const currentTime = new Date().getTime();
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

            if (searchUs) {
                if (savedDataIMDb && currentTime - savedDataIMDb.time < oneDayInMilliseconds) {
                    setContent2(prevContents => [...prevContents, ...savedDataIMDb.contents]);
                } else {
                    res = await axios.get(`https://imdb-api.com/en/API/MostPopularTVs/k_mmsg1u7d`);
                    const newData = {
                        time: currentTime,
                        contents: res.data.items,
                    };
                    localStorage.setItem(storageKeyIMDb, JSON.stringify(newData));
                    setContent2(prevContents => [...prevContents, ...newData.contents]);
                }
            } else {
                if (savedDataTMDB && currentTime - savedDataTMDB.time < oneDayInMilliseconds) {
                    setContent(prevContents => [...prevContents, ...savedDataTMDB.contents]);
                } else {
                    res = await axios.get(
                        `https://api.themoviedb.org/3/tv/${filter}?language=en-US&page=${page}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`
                    );
                    const newData = {
                        time: currentTime,
                        contents: res.data.results,
                    };
                    localStorage.setItem(storageKeyTMDB, JSON.stringify(newData));
                    setContent(prevContents => [...prevContents, ...newData.contents]);
                }
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        if (page === 1) {
            setContent([]);
            setDisplayLimit(20);
        }
        getContent();
    }, [page, filter, searchUs]);

    const handleLoadMore = () => {
        setIsLoading(true)
        if (searchUs) {
            setDisplayLimit((prevDisplayLimit) => prevDisplayLimit + 20);
            setIsLoading(false)

        } else {
            setPage((prevPage) => prevPage + 1);
            setIsLoading(false)

        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setPage(1);
    }

    return (
        <div>
        <div className='sort-container'>
            {!searchUs ? (
                <>
                    <p>
                        <img className='' src={filterlist} alt="Filter List" />
                    </p>
                    <Form.Control className='sort mt-5' as="select" value={filter} onChange={handleFilterChange}>
                        <option value="popular">popular</option>
                        <option value="top_rated">Top Rated</option>
                        <option value="airing_today">Airing Today</option>
                        <option value="on_the_air">On The Air</option>
                    </Form.Control>
                </>
            ) : null}
            <label className="switch mx-5 mt-5"> Search All
                <input type="checkbox" className="checkbox" onClick={() => setSearchUS(!searchUs)} />
                <div className="slider"></div>
            </label>
        </div>
        <h1 className='text-center'>TV-Shows</h1>
        {isLoading ? (
            <div className="container mt-5">
                <div className="row">
                    {Array(4).fill(null).map((_, idx) => (
                        <div key={idx} className="col-md-3 mb-4">
                            <div className="card border-0 bg-dark">
                                <img src="https://www.oncorp.com/oncorphome/Images/loading.gif" alt="Placeholder" className="card-img-top mx-auto" style={{width: "300px", height:"440px", objectFit:"cover"}}/>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <Row xs={1} md={4} className="g-5 m-4">
                {searchUs
                    ? contents2.slice(0, displayLimit).map((content) => (
                        <Col key={content.id}>
    <Link to={`/show?id=${content.id}`}>
        <Card className='contentcard'>
            <Card.Img className='cardimage' src={content.image} alt="Card image" />
            <Card.ImgOverlay>
                <img className='playbtn' src={play} alt="Play Button" />
                <div className='imageoverlay'>
                    <Card.Title>{content.fullTitle}</Card.Title>
                    <Card.Text>{content.year}</Card.Text>
                </div>
                <div className={content.rankUpDown.includes('+') ? ('comment bg-success') : ('comment bg-danger')}>
                    {content.rankUpDown}
                </div>
                <div className="view">{content.imDbRating}</div>
            </Card.ImgOverlay>
        </Card>
    </Link>
</Col>

                    ))
                    : contents.map((content) => (
                        <Col key={content.id}>
                        <Link to={`/details?id=${content.id}`}>
                            <Card className='contentcard'>
                                <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/w500${content.poster_path}`} alt="Card image" />
                                <Card.ImgOverlay>
                                    <img className='playbtn' src={play} alt="Play Button" />
                                    <div className='imageoverlay'>
                                        <Card.Title>{content.original_name}</Card.Title>
                                        <Card.Text>{content.first_air_date}</Card.Text>
                                    </div>
                                </Card.ImgOverlay>
                            </Card>
                        </Link>
                    </Col>
                    
                    ))}
            </Row>
        )}
        <Button className='p-2 w-50 mx-5 bg-secondary border-0' onClick={handleLoadMore}>Load more</Button>
    </div>
    
    )
};

export default Series;
