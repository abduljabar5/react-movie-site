import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import CarouselCards from '../components/Similar';
import ButtonSlideOut from '../components/WatchNow';
import {MyContext, MyProvider} from '../components/MyContext';

import { ADD_SHOW } from '../utils/mutations';
import 'react-circular-progressbar/dist/styles.css';
import { Button, Card, Carousel } from 'react-bootstrap';

import Tvapi from '../api/ShowDetail';
// import { generateText } from'../api/ShowDetail';
import imdb from '../api/Imdb';
import Notification from '../components/Notification/Alerts';
import Comments from '../components/Comments';
import imdblogo from '../styles/images/imdblogo.svg'
import axios from 'axios';
import { openDB } from 'idb';


const setupDB = async () => {
    return openDB('MyDB', 1, {
        upgrade(db) {
            db.createObjectStore('tmdbshows');
        },
    });
};

const MoreDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [show, setShow] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [heartFilled, setHeartFilled] = useState(null);
    const [savedShows, setSavedShows] = useState({});
    const [notification, setNotification] = useState(null); 
    const { incrementMyState } = useContext(MyContext);

    const [addShow, { error }] = useMutation(ADD_SHOW); 
    const { username: userParam } = useParams();

    const { loading, data, err } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });
    useEffect(() => {
        if (!loading) {
            const user = data?.me || data?.user || {};
            console.log("pageid:", Number(id));
            const isShowSaved = user.shows ? user.shows.some(savedShow => savedShow.themoviedb.id === Number(id)) : false;
            setHeartFilled(isShowSaved)
            setSavedShows({ ...savedShows, [id]: isShowSaved });

        }
    }, [loading, data, id]);
    useEffect(() => {
        const fetchData = async () => {
            const db = await setupDB();

            const cache = await db.get('tmdbshows', id);

            if (!cache || Date.now() - cache.timestamp > 86400000) {
                try {
                    const themoviedbRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
                    const imdbRes = await axios.get(`https://imdb-api.com/en/API/Title/k_mmsg1u7d/${themoviedbRes.data.imdb_id}/Trailer,WikipediaFullActor,FullCast`);
                    const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`);

                    const showRes = await Tvapi.searchTv(id);
                    const videoRes = await Tvapi.tvVideos(id);

                    const newShow = {
                        id,
                        themoviedb: themoviedbRes.data,
                        imdb: imdbRes.data,
                        show: showRes.data,
                        videos: videoRes.data.results,
                        reviews: reviewsResponse.data.results,
                        timestamp: Date.now(),
                    };

                    await db.put('tmdbshows', newShow, id);

                    setShow(newShow);
                } catch (error) {
                    console.error('Error fetching data', error);
                }
            } else {
                setShow(cache);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [id]);
    useEffect(() => {
        console.log("show:", show);
    }, [show])
    const handleSaveShow = async () => {
        if (heartFilled) {
            setNotification({
                message: "This show is already saved",
                variant: "danger",
                key: Date.now()
            });
            return;
        }
        try {
            if (Auth.loggedIn()) {
                const userId = Auth.getProfile().data._id;
                const { themoviedb } = show;
                const showData = {
                    themoviedb
                };
                const { data } = await addShow({
                    variables: { userId, show: showData },
                });
                const newHeartFilledState = !heartFilled;
                setHeartFilled(newHeartFilledState);
                const updatedSavedShows = { ...savedShows, [id]: newHeartFilledState };
                setSavedShows(updatedSavedShows);
                incrementMyState();
                setNotification({
                    message: "Go to profile to view saved content",
                    variant: "success",
                    key: Date.now()
                });
            } else {
                setNotification({
                    message: "Login Or Sigh Up",
                    key: Date.now()
                });
            }
        } catch (err) {
            console.error(err);
        }

    };
    if (isLoading) {
        return <div><div id="load">
  <div>G</div>
  <div>N</div>
  <div>I</div>
  <div>D</div>
  <div>A</div>
  <div>O</div>
  <div>L</div>
</div></div>;
    }
    const percentage = show.show.vote_average;
    // Define the style
    const style = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '35rem',
        padding: '5rem 0',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover'
    };

    return (
        <div>
            {isLoading ? (
                <p><div id="load">
  <div>G</div>
  <div>N</div>
  <div>I</div>
  <div>D</div>
  <div>A</div>
  <div>O</div>
  <div>L</div>
</div></p>
            ) : (
                <div>
                    <div>
                        {notification && (
                            <Notification
                                message={notification.message}
                                variant={notification.variant}
                                key={notification.key}
                            />
                        )}
                    </div>
                    <header className="" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${show.show.backdrop_path})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='showdetail-sec-imgcontainer'>
                                        <div>
                                            <img className=' smallimage mx-auto' src={`https://image.tmdb.org/t/p/original/${show.show.poster_path}`} alt="Backdrop Image" />
                                            {show.show.networks.length > 0 ? (
                                                <div style={{ display: 'flex', marginTop: '20px' }}>
                                                    <img src={`https://image.tmdb.org/t/p/original/${show.show.networks[0].logo_path}`} style={{ width: '70px' }}></img>
                                                    <a
                                                        type='button'
                                                        href={show.show.homepage
                                                            ? show.show.homepage
                                                            : `https://www.${show.show.networks[0].name}.com`}
                                                        className='btn btn-outline-danger w-100 ms-4'
                                                        target='_blank'
                                                        rel='noreferrer'
                                                    >
                                                        Watch Now
                                                    </a>
                                                </div>
                                            ) : (<div></div>)}</div>
                                        <div className='mx-auto'>
                                            <h1 className="text-white mx-auto mt-5 mb-5">{show.show.name}</h1>
                                            <div className='w-25 ratingcontainer'>
                                                <img src={imdblogo}></img>
                                                <h5 style={{ alignSelf: 'center', margin: '10px', fontSize: '30px' }}>{show.imdb.imDbRating}</h5>
                                                <div style={{marginLeft:'20px'}}>
                                                    <CircularProgressbar value={percentage} maxValue={10} text={`${percentage}%`} />
                                                </div>
                                            </div>
                                            <h4 className='text-light'>overview:</h4>
                                            <p className='mx-auto'>{show.show.overview}</p>
                                            <div className="anime__details__widget text-light">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 mx-auto">
                                                        <ul>
                                                            <li><span>Type:</span>TV Series</li>
                                                            <li><span>Studios:</span>{show.show.networks[0].name}</li>
                                                            <li><span>Date aired:</span>{show.show.first_air_date}</li>
                                                            <li><span>Status:</span>{show.show.status}</li>
                                                            <li><span>Genre:</span>{show.show.genres.map((genre) => { return <span key={genre.id} className='tv-genre-headings'>{genre.name}, </span> })}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 col-md-6">
                                                        <ul>
                                                            <li><span>Age Rating:</span>{show.imdb.contentRating}</li>
                                                            <li><span>Last aired:</span>{show.show.last_air_date}</li>
                                                            <li><span>Rating:</span>{show.show.vote_average} / {show.show.vote_count} times</li>
                                                            <li><span>Duration:</span>{show.show.episode_run_time[0]} min/ep</li>
                                                            <li><span>Seasons:</span>{show.show.number_of_seasons} Seasons/ {show.show.number_of_episodes} Episode</li>
                                                            {/* <li><span>Last episode:</span>{show.show.last_episode_to_air.air_date||'hi'}</li> */}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="anime__details__btn" style={{display:'flex', justifyContent:'center'}}>
                                                <button
                                                    className="follow-btn"
                                                    onClick={() => {
                                                        if (!heartFilled) {
                                                            handleSaveShow();
                                                        } else {
                                                            setNotification({
                                                                message: "This show is already saved",
                                                                variant: "danger",
                                                                key: Date.now()
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <i className={`fa ${savedShows[id] ? 'fa-heart animate__animated animate__heartBeat' : 'fa-heart-o'}`}></i> Save
                                                </button>

                                                {/* <button href="#" className="watch-btn" style={{borderStyle:'none',backgroundColor:'transparent'}}><span>Watch Now</span> <i
                                                    className="fa fa-angle-right"></i></button> */}
                                                    <ButtonSlideOut prompt={show.imdb} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header><div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex' , width:'100vw' }}>
                                                    <h1 className='position-absolute title'>Cast:</h1>
                                                    <div className="cast-container">
                                                        {show.imdb.actorList.map((item) => (
                                                          
                                                                <div className="cast-item" key={item.id}>
                                                                     
                                                                <div className=" border-0" >
                                                                     <a href={`https://www.google.com/search?q=${item.name}`} target='blank'>
                                                                    <div className=''>
                                                                       
                                                                        <Card.Img
                                                                            className='cardimage'
                                                                            style={{ minHeight: '250px', maxHeight: '250px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '15px' }}
                                                                        />
                                                                        <Card.ImgOverlay className='imageoverlay'>
                                                                            <Card.Title>{item.name}</Card.Title>
                                                                            <Card.Text>{item.imDbRating}</Card.Text>
                                                                        </Card.ImgOverlay>
                                                                      
                                                                    </div> </a>
                                                                </div> 
                                                                
                                                            </div> 
                                                         
                                                           
                                                        ))}
                                                    </div></div>
                                                {/* <div className="d-flex flex-column mx-auto m-auto gap-4">
                                                    <Button variant="outline-primary" size="lg">
                                                        Save
                                                    </Button>
                                                    <Button variant="danger" size="lg">
                                                        Watch Trailer
                                                    </Button>
                                                    <Button variant="primary" size="lg">
                                                        Watch Now
                                                    </Button>

                                                </div> */}
                                            </div>
                    <section id='trailers'>
                        <h1 className='title' style={{marginBottom:'30px'}}>Trailers</h1>
                        <Carousel className='carousel-btn'>
                            {show.videos.map((video) =>
                                <Carousel.Item interval={16000}>
                                    <div key={video.id} className='video-center'>
                                        {video.key && (
                                            <iframe
                                                className='flex'
                                                width="960"
                                                height="555"
                                                src={`https://www.youtube.com/embed/${video.key}`}
                                                title={video.name}
                                                frameBorder="0"
                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                    </div>
                                    <Carousel.Caption>
                                        <h3>{video.name}</h3>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </section>
                    <CarouselCards additionalData={show.imdb} />

                    <Comments reviewsAndEpisodeGroups={show} />
                </div >

            )}
        </div >
    );
};

export default MoreDetails;
