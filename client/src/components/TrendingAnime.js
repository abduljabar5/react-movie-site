import React from 'react'
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import API from '../api/Kitsu'
import IconDoubleRight from '../components/Icons/Right-arrow';

const Trendinganime = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [animes, setAnime] = useState([]);

    const trending = async () => {
        try {
            const res = await API.TrendingAnime();
            setAnime(res.data.data);
            setIsLoading(false)
        } catch (err) {
        console.log("🚀 ~ file: TrendingAnime.js:20 ~ trending ~ err:", err)
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
            <div class="product__sidebar" style={{margin:'70px 20px'}}>
                <div class="product__sidebar__view">
                    <div class="section-title">
                        <h5>Top Anime</h5>
                    </div>
                    <ul class="filter__controls">
                    <Link to='/animepage' className="primary-btn ms-auto" style={{ textDecoration: 'none', color: '#1b9cff' }}>View All <span className="arrow_right" ><IconDoubleRight /></span></Link>

                    </ul>
                    {isLoading ? (
                       <Card.Body>
                       <Placeholder as={Card.Title} animation="glow">
                         <Placeholder xs={6} />
                       </Placeholder>
                       <Placeholder as={Card.Text} animation="glow">
                         <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                         <Placeholder xs={6} /> <Placeholder xs={8} />
                       </Placeholder>
                       <Placeholder.Button variant="primary"  xs={6} />
                     </Card.Body>
                    ) : (

                        <div className='img-container'>
                            {animes.map((animee) => {
                                const name = animee.attributes.canonicalTitle;
                                const imageUrl = animee.attributes.coverImage && animee.attributes.coverImage.original
                                                ? animee.attributes.coverImage.original
                                                : 'https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg'
                                return (
                                    <Link to={`/anime?name=${name}`}key={animee.id}>
                                    <div class="filter__gallery" >
                                        <div class="product__sidebar__view__item set-bg"
                                            style={{ backgroundImage: `url(${imageUrl})` }}>
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

export default Trendinganime;
