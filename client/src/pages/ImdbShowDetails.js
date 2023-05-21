import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import imdblogo from '../styles/images/imdblogo.svg'
import moviebox from '../styles/images/moviebox.webp'
import flixhq from '../styles/images/flixhq.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Button } from 'react-bootstrap';
const MoreDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [shows, setShows] = useState([]);
    const [additionalData, setAdditionalData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchShows = async () => {
        const res = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=810b2ac0`);
        console.log('hihihihi', res.data);
        return res.data;
    };

    const fetchAdditionalData = async (imdbid) => {
        const res = await axios.get(`https://imdb-api.com/en/API/Title/k_mmsg1u7d/${imdbid}/Trailer,WikipediaFullActor,FullCast`);
        return res.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const storageKey = `show-${id}`;
            const savedDataJson = localStorage.getItem(storageKey);
            const savedData = savedDataJson ? JSON.parse(savedDataJson) : null;

            const currentTime = new Date().getTime();
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

            // if there's saved data and it's less than a day old
            if (savedData && currentTime - savedData.time < oneDayInMilliseconds) {
                setShows(savedData.shows);
                setAdditionalData(savedData.additionalData);
            } else {
                // fetch data from the API
                const fetchedShows = await fetchShows();
                const fetchedAdditionalData = await fetchAdditionalData(fetchedShows.imdbID);
                console.log(fetchedShows.imdbID);

                // save data in local storage with the current time
                const newData = {
                    time: currentTime,
                    shows: fetchedShows,
                    additionalData: fetchedAdditionalData,
                };
                localStorage.setItem(storageKey, JSON.stringify(newData));

                setShows(fetchedShows);
                setAdditionalData(fetchedAdditionalData);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [id]);
    useEffect(() => {
        console.log(additionalData);

    }, [additionalData])
    // const percentage = shows.vote_average;
    // Define the style
    const style = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '35rem',
        padding: '15rem 0',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover'
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <header className="masthead" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(${additionalData.image})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='showdetail-sec-imgcontainer'>
                                        <img className=' smallimage mx-auto' src={`${shows.Poster}`} alt="Backdrop Image" />
                                        <div className='mx-auto'>
                                            <h1 className="text-white mx-auto mt-5 mb-5">{additionalData.title}</h1>
                                            <div className='w-25 ratingcontainer'>
                                                <img src={imdblogo}></img>
                                                <p>{additionalData.imDbRating}</p>
                                                <div>
                                                    {/* <CircularProgressbar value={percentage} maxValue={10} text={`${percentage}%`} /> */}
                                                </div>
                                            </div>


                                            <h4 className='text-light'>overview:</h4>
                                            <p className='mx-auto'>{additionalData.wikipedia.plotShort.plainText}</p>
                                            <div class="anime__details__widget text-light">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 mx-auto">
                                                        <ul>
                                                            <li><span>Type:</span>TV Series</li>
                                                            {/* <li><span>Studios:</span>{shows.networks[0].name}</li> */}
                                                            <li><span>Date aired:</span>{shows.Released}</li>
                                                            {/* <li><span>Status:</span>{shows.status}</li> */}
                                                            <li><span>Genre:</span>{shows.Genre}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 col-md-6">
                                                        <ul>
                                                            <li><span>Age Rating:</span>{additionalData.contentRating}</li>
                                                            <li><span>Duration:</span>{shows.Runtime} min/ep</li>
                                                            <li><span>Seasons:</span>{shows.totalSeasons} Seasons</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="anime__details__btn m-4">
                                                <button type="button" class="follow-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                    Watch Trailer
                                                </button>
                                                <OverlayTrigger
                                                    trigger="click"
                                                    placement="right"
                                                    overlay={
                                                        <Popover id={`popover-positioned-right}`}>
                                                            <Popover.Body className='bg-dark'>
                                                                <div>
                                                                    <a href={'https://www.movieboxpro.app/index/search?word=' + additionalData.title} target="_blank">
                                                                        <img className='watch-icons' src={moviebox}></img>
                                                                    </a>
                                                                   
                                                                    <a href={'https://flixhq.to/search/' + additionalData.title} target="_blank">
                                                                        <img className='watch-icons' src={flixhq}></img>
                                                                    </a> <a href={'https://flixtor.si/show/search/'+ additionalData.title+'/from/1995/to/2099/rating/0/votes/0/language/all/type/tvshows/genre/all/relevance/page/1' } target="_blank">
                                                                        <img className='watch-icons' src={flixhq}></img>
                                                                    </a> <a href={'https://flixhq.to/search/' + additionalData.title} target="_blank">
                                                                        <img className='watch-icons' src={flixhq}></img>
                                                                    </a>
                                                                </div>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <Button variant="danger" className='watch-btn'>Watch Now</Button>
                                                </OverlayTrigger>
                                            </div>


                                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-xl bg-none">
                                                    <div class="modal-content modal-video transparent">
                                                        <div class="modal-header">
                                                            <h2 class="modal-title fs-1 mx-auto" id="exampleModalLabel">{additionalData.trailer.title}</h2>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body mx-auto">
                                                            <iframe
                                                                width="960"
                                                                height="555"
                                                                src={`${additionalData.trailer.linkEmbed}?format=1080p`}
                                                                title={additionalData.trailer.title}
                                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <section className='cast-container'>
                        {additionalData.actorList.slice(0, 10).map((actor) => (
                            <div className="cast-card-container">
                                <div className="card mb-3 cast-card bg-dark">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img src={actor.image} className="img-fluid rounded-start" alt="..."></img>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{actor.name}</h5>
                                                <p className="card-text">{actor.asCharacter}</p>
                                                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>


                    <section class="about-section text-center" id="about">
                        <div>
                            <div class="row gx-4 gx-lg-5 m-0 justify-content-center">
                                <div class="col-lg-8">

                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            )}
        </div>
    );
};

export default MoreDetails;
