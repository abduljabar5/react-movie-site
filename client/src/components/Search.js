import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import API from '../api/Search';
import API2 from '../api/AnimeDetails';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import IconMovieOpenPlayOutline from '../components/Icons/Movie';
import Shows from '../components/Icons/Shows'
import Naruto from '../styles/images/anime.svg'
import searchIcon from '../styles/images/search.svg'
import IconTvSharp from "../components/Icons/Shows";
import play from '../styles/images/play.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Row } from "react-bootstrap";
const Search = () => {
    const [searching, setSearching] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMovie, setIsMovie] = useState('movie');
    const [isAnime, setIsAnime] = useState(false);
    const [views, setView] = useState([]);
    const [animeviews, setAnimeView] = useState([]);
    const [show, setShow] = useState(false);

    const search = () => {
        setIsLoading(true);
        API.search(searching, isMovie)
            .then((res) => {
                setView(res.data.results);
                setIsLoading(false);
            })
            .catch((err) => {
                // handle errors
                setIsLoading(false);
            });
    };

    const getAnime = async () => {
        try {
            setIsLoading(true);
            console.log('trying to run news');
            const res = await API2.AnimeDetails(searching);
            setAnimeView(res.data.data);
            setIsLoading(false);
        } catch (err) {
            // handle errors
            setIsLoading(false);
        }
    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAnime) {
                setIsLoading(true);
                getAnime();
            } else {
                search();
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [isMovie, searching, isAnime, show]);  // Add show to the dependency array

    useEffect(() => {
        console.log(views);
        console.log(animeviews);
    }, [views, animeviews]);

    return (
        <div>
            {/* Add a loading indicator */}
            <div>
                {/* <Button variant="outline-info" >
                    Search
                </Button> */}
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onClick={handleShow} />
                    <Button variant="outline-dark" onClick={handleShow}><FontAwesomeIcon icon={faSearch} className="mx-2 my-auto" /></Button>
                </Form>
                <Modal show={show} dialogClassName="modal-xl bg-dark text-light" onHide={handleClose}>
                    <Modal.Header className="bg-dark border-0" closeButton>
                        <div className="w-100">
                            <label class="switch" style={{ float: 'right', display: 'flex' }}>
                                Search Anime Only:
                                <input type="checkbox" class="checkbox" onClick={() => setIsAnime(isAnime === false ? true : false)}></input>
                                <div class="slider ms-2"></div>
                            </label>


                            <div class="container d-flex justify-content-center">
                                <div class="input-group col-sm-7  input-group-lg">
                                    <div class="input-group-prepend">

                                        <span class="input-group-text google">
                                            <button onClick={() => setIsMovie(isMovie === 'movie' ? 'tv' : 'movie')} style={{ height: '33px', margin: '7px', borderStyle: 'none', backgroundColor: '#e9ecef' }}>
                                                {isAnime ?
                                                    <div>Anime</div> :
                                                    isMovie === 'movie' ?
                                                        <span><IconMovieOpenPlayOutline /> Movies</span> :
                                                        <span><IconTvSharp /> TV-Series</span>
                                                }
                                            </button>
                                        </span>
                                    </div>
                                    <input type="text" class="form-control" onChange={(e) => setSearching(e.target.value)}></input>
                                    <div class="input-group-append">
                                        <span class="input-group-text microphone">{!isAnime ? (<button type="submit" style={{ borderStyle: 'none', backgroundColor: '#e9ecef' }}><img style={{ width: '45px' }} src={searchIcon}></img></button>) : (<img style={{ width: '47px' }} src={Naruto}></img>)}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </Modal.Header>
                    {isLoading ? (
                        <Modal.Body className="bg-dark "><div class="wrapper mx-auto">
                            <div class="circle"></div>
                            <div class="circle"></div>
                            <div class="circle"></div>
                            <div class="shadow"></div>
                            <div class="shadow"></div>
                            <div class="shadow"></div>
                        </div>.</Modal.Body>
                    ) : (
                        <Modal.Body className="serach-container bg-dark">
                            <Row xs={1} md={4} className="g-5 m-4">
                                {isAnime && !isLoading ? (
                                    animeviews.map((view) => {
                                        const id = view.id;
                                        const name = view.attributes.canonicalTitle;
                                        return (

                                            <Col key={view.id}>
                                                <Link to={`/anime?name=${name}`} onClick={handleClose}>
                                                    <Card className='contentcard bg-dark'>
                                                        <Card.Img className='cardimage' src={view.attributes.posterImage.original} alt="Card image" />
                                                        <Card.ImgOverlay >
                                                            <img className='playbtn' style={{ width: '50px' }} src={play}></img>
                                                            <div className='imageoverlay'>
                                                                <Card.Title>{view.attributes.titles.en}<br></br>{view.attributes.titles.ja_jp}</Card.Title>

                                                            </div>
                                                            <div className='comment bg-danger'>{view.attributes.showType}</div>
                                                            <div className="view">{view.attributes.ageRating}</div>
                                                        </Card.ImgOverlay>
                                                    </Card>
                                                </Link>
                                            </Col>
                                        )
                                    })
                                ) : (
                                    views.map((view) => {
                                        const id = view.id;
                                        return (
                                      
<Col key={view.id}>
<Link to= {isMovie === 'movie' ? (`/moviedetails?id=${id}` ) : (`/details?id=${id}` )}onClick={handleClose} >
    <Card className='contentcard bg-dark'>
        <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/original/${view.poster_path}`}  alt="Card image" />
        <Card.ImgOverlay >
            <img className='playbtn' style={{width:'50px'}} src={play}></img>
            <div className='imageoverlay'>
                <Card.Title>{view.original_title||view.name}</Card.Title>
               
            </div>
            <div className='comment bg-danger'>{view.popularity}</div>
            <div className="view">{view.vote_average}</div>
        </Card.ImgOverlay>
    </Card>
</Link>
</Col>

                                        )
                                    })
                                )}
                            </Row>
                        </Modal.Body>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default Search;