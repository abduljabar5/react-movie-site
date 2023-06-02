import React, { useState, useEffect,useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useParams } from 'react-router-dom';
import { ADD_ANIME } from '../utils/mutations';
import Notification from '../components/Notification/Alerts';
import {MyContext, MyProvider} from '../components/MyContext';

import 'react-circular-progressbar/dist/styles.css';
import API from '../api/AnimeDetails';
import axios from 'axios';
import { openDB } from 'idb';

// create and open the database
const setupDB = async () => {
    return openDB('MyDBAnime', 1, {
        upgrade(db) {
            db.createObjectStore('myAnimes');
        },
    });
};

const AnimeDetails = () => {
    const [anime, setAnime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedAnimes, setSavedAnimes] = useState({});
    const [heartFilled, setHeartFilled] = useState(null);
    const [notification, setNotification] = useState(null);  // initialize state variable
    const { incrementMyState } = useContext(MyContext);

    const [addAnime] = useMutation(ADD_ANIME);

    const { username: userParam } = useParams();
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
console.log('name:',name);

useEffect(() => {
    if (!loading) {
        const user = data?.me || data?.user || {};
        console.log('user:', user);
        const isAnimeSaved = user.animes ? user.animes.some(savedAnime => savedAnime.animeName === name) : false;
        console.log('anime:',isAnimeSaved);
        setHeartFilled(isAnimeSaved);
        setSavedAnimes({ ...savedAnimes, [name]: isAnimeSaved });
    }
}, [loading, data, name]);

    useEffect(() => {
        const fetchData = async () => {
            const db = await setupDB();
            const cache = await db.get('myAnimes', name);

            if (!cache || Date.now() - cache.timestamp > 86400000) {
                try {
                    const animeRes = await API.AnimeDetails(name);
                    const newAnime = {
                        name,
                        data: animeRes.data.data[0],
                        timestamp: Date.now(),
                    };
                    await db.put('myAnimes', newAnime, name);
                    setAnime(newAnime);
                } catch (error) {
                    console.error('Error fetching data', error);
                }
            } else {
                setAnime(cache);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [name]);

    const handleSaveAnime = async () => {
        if (heartFilled) {
            return;
        }
        try {
            if (Auth.loggedIn()) {
                let animeTitle =  anime.data.attributes.titles.en; // Use a default value
                if ( !anime.data.attributes.titles.en) {
                    animeTitle = anime.data.attributes.titles.en_us;
                }
                console.log("datatype:", animeTitle);
                const userId = Auth.getProfile().data._id;
                const animeData = {
                    animeId: anime.data.id, // Here we use the id from the anime.data object
                    animeName: animeTitle, // Here we use the English name from the anime.data object
                };
                const { data } = await addAnime({
                    variables: { userId, anime: animeData },
                });
            
                setHeartFilled(true); // If the anime is successfully saved, fill the heart.
               
const updatedSavedAnimes = { 
    ...savedAnimes, 
    [animeTitle]: true 
};

                setSavedAnimes(updatedSavedAnimes);
                incrementMyState();

            }
            
        } catch (err) {
            console.error(err);
        }
    };
    
    console.log(anime);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Here is where you render your anime details page


    return (
        <div class="container " >
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div class="anime__details__content">
                     <Notification className="ms-auto"
                                    key={notification ? notification.key : ''}
                                    message={notification ? notification.message : ''}
                                    variant={notification ? notification.variant : ''}
                                />
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="anime__details__pic set-bg">
                                <img src={anime.data.attributes.posterImage.original}></img>
                                {/* <div class="comment"><i class="fa fa-comments"></i> 11</div>
                    <div class="view"><i class="fa fa-eye"></i> 9141</div> */}
                            </div>
                        </div>
                        <div class="col-lg-9">
                            <div class="anime__details__text">
                                <div class="anime__details__title">
                                    <h3>{anime.data.attributes.titles.en}</h3>
                                    <span>{anime.data.attributes.titles.ja_jp}, {anime.data.attributes.titles.en_jp}</span>
                                </div>
                                <div class="anime__details__rating">
                                    <div class="rating">
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star-half-o"></i></a>
                                    </div>
                                    {/* <span><CircularProgressbar value={percentage} maxValue={100} text={`${percentage}%`} /></span> */}
                                </div>
                                <p>{anime.data.attributes.description}</p>
                                <div class="anime__details__widget">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6">
                                            <ul>
                                                <li><span>Type:</span> {anime.data.attributes.showType}</li>
                                                <li><span>Date aired:</span> {anime.data.attributes.startDate}</li>
                                                <li><span>Status:</span> {anime.data.attributes.status}</li>
                                                <li><span>Genre:</span> Action, Adventure, Fantasy, Magic</li>
                                            </ul>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <ul>
                                                <li><span>Age Rating:</span>{anime.data.attributes.ageRatingGuide}</li>
                                                <li><span>PopularityRank</span> {anime.data.attributes.popularityRank}</li>
                                                <li><span>Duration:</span> {anime.data.attributes.episodeLength} min/ep</li>
                                                <li><span>Quality:</span> HD</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="anime__details__btn m-4">
                                    <button
                                        className="follow-btn"
                                        onClick={() => {
                                            if (!heartFilled) {
                                                handleSaveAnime();
                                                setNotification({
                                                    message: "This anime is saved",
                                                    variant: "success",
                                                    key: Date.now()
                                                });
                                            } else {
                                                setNotification({
                                                    message: "This anime is already saved",
                                                    variant: "danger",
                                                    key: Date.now()
                                                });
                                            }
                                        }}
                                    >
                                        <i className={`fa ${heartFilled ? 'fa-heart' : 'fa-heart-o'}`}></i> Save
                                    </button>
                                    <button type="button" class="follow-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Watch Trailer
                                    </button>
                                    <a class="watch-btn"><span>Watch Now</span> <i class="fa fa-angle-right"></i></a>
                                </div>
                            

                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content modal-video">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5 mx-auto" id="exampleModalLabel">{anime.data.attributes.titles.ja_jp}</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body mx-auto">
                                    <iframe
                                        width="960"
                                        height="555"
                                        src={`https://www.youtube.com/embed/${anime.data.attributes.youtubeVideoId}`}
                                        title={anime.data.attributes.titles.en_jp}
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}

export default AnimeDetails;