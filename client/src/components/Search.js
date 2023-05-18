import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import API from '../api/Search';
import API2 from '../api/AnimeDetails';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


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
                    <Button variant="outline-success">Search</Button>
                </Form>
                <Modal show={show} dialogClassName="modal-xl" onHide={handleClose}>
                    <Modal.Header className="" closeButton>
                        <Modal.Title className="ms-auto">
                            <div class="form">
                            <input className='form-input input ms-auto' placeholder="Search" autoComplete="off" id='search' onChange={(e) => setSearching(e.target.value)}></input>
                             <span class="input-border"></span>
                            </div>
                        </Modal.Title>
                        <Button variant="outline-dark" onClick={() => setIsMovie(isMovie === 'movie' ? 'tv' : 'movie')}>Toggle Movie/TV</Button>
                        <label class="switch">
                            <input type="checkbox" class="checkbox" onClick={() => setIsAnime(isAnime === false ? true : false)}></input>
                            <div class="slider"></div>
                        </label>
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
                        <Modal.Body className="serach-container">
                            {isAnime && !isLoading ? (
                                animeviews.map((view) => {
                                    const id = view.id;
                                    const name = view.attributes.canonicalTitle;
                                    return (
                                        <div class="card search-cards" key={id}>
                                            <img src={view.attributes.posterImage.original} class="card-img-top" alt="..."></img>
                                            <div class="card-body">
                                                <h5 class="card-title">{view.original_title}</h5>
                                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

                                                <Link to={`/anime?name=${name}`} onClick={handleClose}>Go somewhere</Link>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                views.map((view) => {
                                    const id = view.id;
                                    return (
                                        <div class="card search-cards" key={id}>
                                            <img src={`https://image.tmdb.org/t/p/original/${view.poster_path}`} class="card-img-top" alt="..."></img>
                                            <div class="card-body">
                                                <h5 class="card-title">{view.original_title}</h5>
                                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                {isMovie === 'movie' ? (
                                                    <Link to={`/moviedetails?id=${id}`} onClick={handleClose} class="btn btn-primary" >Go somewhere</Link>
                                                ) : isMovie === 'tv' ? (
                                                    <Link to={`/details?id=${id}`} onClick={handleClose} class="btn btn-primary" >Go somewhere</Link>
                                                ) : null}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </Modal.Body>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default Search;