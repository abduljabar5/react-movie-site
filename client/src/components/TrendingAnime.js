import React from 'react'
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import API from '../api/Kitsu'

const TrendingAnime = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [animes, setAnime] = useState([]);

    const trending = async () => {
        try {
            console.log('tring');
            const res = await API.TrendingAnime();
            setAnime(res.data.data);
            setIsLoading(false)
        } catch (err) {
            // handle errors
        }
    };

    useEffect(() => {
        trending();
    }, []);

    useEffect(() => {
        console.log('hi', animes);
    }, [animes]);

    return (
        <aside className='anime-container'>
            <div class="product__sidebar">
                <div class="product__sidebar__view">
                    <div class="section-title">
                        <h5>Top Views</h5>
                    </div>
                    <ul class="filter__controls">
                        <li class="active" data-filter="*">Day</li>
                        <li data-filter=".week">Week</li>
                        <li data-filter=".month">Month</li>
                        <li data-filter=".years">Years</li>
                    </ul>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (

                        <div className='img-container'>
                            {animes.map((animee) => {
                                const name = animee.attributes.canonicalTitle;
                                return (
                                    <Link to={`/anime?name=${name}`}>
                                    <div class="filter__gallery" key={animee.id}>
                                        <div class="product__sidebar__view__item set-bg"
                                            style={{ backgroundImage: `url(${animee.attributes.coverImage.original})` }}>
                                            <div class="ep">{animee.attributes.totalLength}</div>
                                            <div class="view"><i class="fa fa-eye"></i> {animee.id}</div>
                                            <h5><a href="#">{animee.attributes.titles.en === undefined ? animee.attributes.titles.en_jp : animee.attributes.titles.en}</a></h5>
                                        </div>
                                    </div>
                                    </Link>
                                )
                            })}
                        </div>)}</div>
            </div>
        </aside>
    )
}

export default TrendingAnime
