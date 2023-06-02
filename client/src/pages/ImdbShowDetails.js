import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { openDB } from 'idb';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {MyContext, MyProvider} from '../components/MyContext';

import { ADD_SHOW } from '../utils/mutations';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import imdblogo from '../styles/images/imdblogo.svg'
import moviebox from '../styles/images/moviebox.webp'
import flixhq from '../styles/images/flixhq.png'
import Notification from '../components/Notification/Alerts';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Carousel from 'react-bootstrap/Carousel';
import { Button, Card } from 'react-bootstrap';

import CarouselCards from '../components/Similar';
const MoreDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [shows, setShows] = useState([]);
    const [additionalData, setAdditionalData] = useState({});
    const [reviewsAndEpisodeGroups, setReviewsAndEpisodeGroups] = useState(null);
    const [heartFilled, setHeartFilled] = useState(null);
    const [savedShows, setSavedShows] = useState({});
    const [notification, setNotification] = useState(null);  
    const [isLoading, setIsLoading] = useState(true);
    const { incrementMyState } = useContext(MyContext);
    const [addShow, { error }] = useMutation(ADD_SHOW); // Use the mutation
    const { username: userParam } = useParams();
    const { loading, data, err } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
      });
      useEffect(() => {
        if (!loading && reviewsAndEpisodeGroups) {  // Check that reviewsAndEpisodeGroups is ready
            const user = data?.me || data?.user || {};
            // console.log("showid:", user.shows.some(savedShow => savedShow.themoviedb.id === reviewsAndEpisodeGroups.themoviedb.id))
            console.log("pageid:",reviewsAndEpisodeGroups.themoviedb.id);
            // Assuming that `user.shows` is an array of saved shows
            const isShowSaved = user.shows ? user.shows.some(savedShow => savedShow.themoviedb.id === reviewsAndEpisodeGroups.themoviedb.id) : false;
            setHeartFilled(isShowSaved)
            setSavedShows({ ...savedShows, [id]: isShowSaved });
        }
    }, [loading, data, id, reviewsAndEpisodeGroups]);
    
    const fetchShows = async () => {
        const res = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=810b2ac0`);
        console.log('hihihihi', res.data);
        return res.data;
    };

    const fetchAdditionalData = async (imdbid) => {
        const res = await axios.get(`https://imdb-api.com/en/API/Title/k_mmsg1u7d/${imdbid}/Trailer,WikipediaFullActor,FullCast`);
        return res.data;
    };
    const fetchTmdbShowId = async (showName) => {
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(showName)}`);
        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].id;
        } else {
            return null;
        }
    };

    const fetchReviewsAndEpisodeGroups = async (seriesId) => {
        const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`);
        const themoviedbRes = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
        const episodeGroupsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
        const trailers = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
        return {
            reviews: reviewsResponse.data.results,
            episodeGroups: episodeGroupsResponse.data,
            trailers: trailers.data.results,
            themoviedb: themoviedbRes.data
        };
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const storageKey = `show-${id}`;
            const db = await openDB('ShowDB', 1, {
                upgrade(db) {
                    db.createObjectStore('shows');
                },
            });

            const currentTime = new Date().getTime();
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const savedData = await db.get('shows', storageKey);

            // if there's saved data and it's less than a day old
            if (savedData && currentTime - savedData.time < oneDayInMilliseconds) {
                setShows(savedData.shows);
                setAdditionalData(savedData.additionalData);
                setReviewsAndEpisodeGroups(savedData.reviewsAndEpisodeGroups);

            } else {
                // fetch data from the API
                const fetchedShows = await fetchShows();
                const fetchedAdditionalData = await fetchAdditionalData(fetchedShows.imdbID);
                console.log(fetchedShows.imdbID);

                const tmdbShowId = await fetchTmdbShowId(fetchedShows.Title);

                const fetchreviewsAndEpisodeGroups = await fetchReviewsAndEpisodeGroups(tmdbShowId);

                // save data in IndexedDB with the current time
                const newData = {
                    time: currentTime,
                    shows: fetchedShows,
                    additionalData: fetchedAdditionalData,
                    reviewsAndEpisodeGroups: fetchreviewsAndEpisodeGroups,
                };

                try {
                    await db.put('shows', newData, storageKey);
                    console.log(`Data saved in IndexedDB with key ${storageKey}`);
                } catch (error) {
                    console.error('Error saving data in IndexedDB:', error);
                }

                setShows(fetchedShows);
                setAdditionalData(fetchedAdditionalData);
                setReviewsAndEpisodeGroups(fetchreviewsAndEpisodeGroups);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        console.log(additionalData);

    }, [additionalData])
    console.log(reviewsAndEpisodeGroups);
    const handleSaveShow = async () => {
        try {
            if (Auth.loggedIn()) {
                const userId = Auth.getProfile().data._id;
                const { themoviedb } = reviewsAndEpisodeGroups; 
                const showData = {
                    themoviedb
                };
      
                console.log(userId);
                console.log(showData);
                        
                const { data } = await addShow({
                  variables: { userId, show: showData },
                });
                const newHeartFilledState = !heartFilled;
                setHeartFilled(newHeartFilledState);

                const updatedSavedShows = { ...savedShows, [id]: newHeartFilledState };
                setSavedShows(updatedSavedShows);
                // You can handle the response here...
                setNotification({
                    message: "Go to profile to view saved content",
                    variant: "success",
                    key: Date.now()
                });
                incrementMyState();


            } else {
                console.log('User is not logged in');
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
        return <div>Loading...</div>;
    }
    // const percentage = shows.vote_average;
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
             <  div class="wrapper mx-auto">
               <div class="circle"></div>
               <div class="circle"></div>
               <div class="circle"></div>
               <div class="shadow"></div>
               <div class="shadow"></div>
               <div class="shadow"></div>
           </div>
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
                    <header className="masthead" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${reviewsAndEpisodeGroups.episodeGroups.backdrop_path})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='showdetail-sec-imgcontainer'>
                                        <div>
                                            <img className=' smallimage mx-auto' src={`${additionalData.image}`} alt="Backdrop Image" />
                                            {reviewsAndEpisodeGroups.episodeGroups.networks.length > 0 ? (
                                                <div style={{ display: 'flex', marginTop: '20px' }}>
                                                    <img src={`https://image.tmdb.org/t/p/original/${reviewsAndEpisodeGroups.episodeGroups.networks[0].logo_path}`} style={{ width: '70px' }}></img>
                                                    <a
                                                        type='button'
                                                        href={reviewsAndEpisodeGroups.episodeGroups.homepage
                                                            ? reviewsAndEpisodeGroups.episodeGroups.homepage
                                                            : `https://www.${reviewsAndEpisodeGroups.episodeGroups.networks[0].name}.com`}
                                                        className='btn btn-outline-danger w-100 ms-4'
                                                        target='_blank'
                                                        rel='noreferrer'  // It's a good practice to add rel='noreferrer' whenever target='_blank' is used
                                                    >
                                                        Watch Now
                                                    </a>
                                                </div>
                                            ) : (<div></div>)}

                                        </div>
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
                                            <div class="anime__details__btn">
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
<i className={`fa ${savedShows[id] ? 'fa-heart' : 'fa-heart-o'}`}></i> Save
                                                </button>
                                <a href="#" class="watch-btn"><span>Watch Now</span> <i
                                    class="fa fa-angle-right"></i></a>
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
                                                                    </a> <a href={'https://flixtor.si/show/search/' + additionalData.title + '/from/1995/to/2099/rating/0/votes/0/language/all/type/tvshows/genre/all/relevance/page/1'} target="_blank">
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


                                            <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    <section>
                     <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex' }}>
                                                    <h1 className='position-absolute'style={{margin:'20px 63px', color:'white'}}>Cast</h1>
                                                    <div class="cast-container mx-auto" style={{ width: "87vw" }}>
                                                        {additionalData.actorList.map((item, index) => (
                                                            <div class="cast-item">
                                                                <div className=" border-0" key={index}>
                                                                    <div className=''>
                                                                        {/* <Link to={`/show?id=${item.id}`}> */}
                                                                        <Card.Img
                                                                            className='cardimage'
                                                                            style={{ minHeight: '250px', maxHeight: '250px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover',borderColor: 'black', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '15px' }}
                                                                        />
                                                                        <Card.ImgOverlay className='imageoverlay'>
                                                                            <Card.Title>{item.title}</Card.Title>
                                                                            <Card.Text>{item.imDbRating}</Card.Text>
                                                                        </Card.ImgOverlay>
                                                                        {/* </Link> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </section>
                    <section id='trailers'>
                    <Carousel>                    
                        <h1 style={{margin:'20px 63px', color:'white'}}>Trailers</h1>

                       {reviewsAndEpisodeGroups.trailers.map((video) =>
                     
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
                    <div>
            <CarouselCards additionalData={additionalData} />
        </div>
                    <section class="about-section text-light" style={{ marginTop: '20px', backgroundColor: '#e9ebee;' }}>
                        <div class="be-comment-block">
                            <h1 class="comments-title text-light">Comments ({reviewsAndEpisodeGroups.reviews.length})</h1>
                            {
  reviewsAndEpisodeGroups.reviews.length > 0 ? 
    reviewsAndEpisodeGroups.reviews.map((review) => {
      return (
        <div class="be-comment">
          <div class="be-img-comment">
            <img src={`https://image.tmdb.org/t/p/original/${review.author_details.avatar_path}`} alt="" class="be-ava-comment"></img>
          </div>
          <div class="be-comment-content">
            <span class="be-comment-name">
              <h5>{review.author}</h5>
            </span>
            <span class="be-comment-time">
              <i class="fa fa-clock-o"></i>
              {review.created_at}
            </span>
            <p class="be-comment-text">
              {review.content}
            </p>
          </div>
        </div>
      )
    })
    :
    <div class="be-comment">
      <div class="be-comment-content">
        <p class="be-comment-text">
          Be the first to leave a review!
        </p>
      </div>
    </div>
}

                            <form class="form-block">
                                <div class="row">
                                    <div class="col-xs-12 col-sm-6">
                                        <div class="form-group fl_icon">
                                            
                                            <input class="form-input" type="text" placeholder="Your name"></input>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 fl_icon">
                                        <div class="form-group fl_icon">
                                            <input class="form-input" type="text" placeholder="Your email"></input>
                                        </div>
                                    </div>
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <textarea class="form-input" required="" placeholder="Your text"></textarea>
                                        </div>
                                    </div>
                                    <a class="btn btn-primary pull-right">submit</a>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default MoreDetails;
