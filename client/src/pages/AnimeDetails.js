import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';

import API from '../api/AnimeDetails';

const AnimeDetails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [anime, setAnime] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const getAnime = async () => {
        try {
            console.log('trying to run news');
            const res = await API.AnimeDetails(name);
            const animeData = res.data.data[0];
            setAnime(animeData);
            setIsLoading(false);
            setPercentage(animeData.attributes.averageRating);

        } catch (err) {
            // handle errors
        }
    };

    useEffect(() => {
        getAnime();
    }, []);

    useEffect(() => {
        console.log('hi news', anime);
        //   setPercentage(anime.attributes.averageRating);
    }, [anime]);
    return (
        <div class="container " >
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div class="anime__details__content">
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="anime__details__pic set-bg">
                                <img src={anime.attributes.posterImage.original}></img>
                                {/* <div class="comment"><i class="fa fa-comments"></i> 11</div>
                    <div class="view"><i class="fa fa-eye"></i> 9141</div> */}
                            </div>
                        </div>
                        <div class="col-lg-9">
                            <div class="anime__details__text">
                                <div class="anime__details__title">
                                    <h3>{anime.attributes.titles.en}</h3>
                                    <span>{anime.attributes.titles.ja_jp}, {anime.attributes.titles.en_jp}</span>
                                </div>
                                <div class="anime__details__rating">
                                    <div class="rating">
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star"></i></a>
                                        <a><i class="fa fa-star-half-o"></i></a>
                                    </div>
                                    <span><CircularProgressbar value={percentage} maxValue={100} text={`${percentage}%`} /></span>
                                </div>
                                <p>{anime.attributes.description}</p>
                                <div class="anime__details__widget">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6">
                                            <ul>
                                                <li><span>Type:</span> {anime.attributes.showType}</li>
                                                <li><span>Date aired:</span> {anime.attributes.startDate}</li>
                                                <li><span>Status:</span> {anime.attributes.status}</li>
                                                <li><span>Genre:</span> Action, Adventure, Fantasy, Magic</li>
                                            </ul>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <ul>
                                                <li><span>Age Rating:</span>{anime.attributes.ageRatingGuide}</li>
                                                <li><span>PopularityRank</span> {anime.attributes.popularityRank}</li>
                                                <li><span>Duration:</span> {anime.attributes.episodeLength} min/ep</li>
                                                <li><span>Quality:</span> HD</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="anime__details__btn m-4">
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
                                    <h1 class="modal-title fs-5 mx-auto" id="exampleModalLabel">{anime.attributes.titles.ja_jp}</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body mx-auto">
                                    <iframe
                                        width="960"
                                        height="555"
                                        src={`https://www.youtube.com/embed/${anime.attributes.youtubeVideoId}`}
                                        title={anime.attributes.titles.en_jp}
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