import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useParams } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import { openDB } from 'idb';
import { Card } from 'react-bootstrap';
const Recommend = () => {
    const { username: userParam } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [db1, setDb1] = useState(null);
    const [db2, setDb2] = useState(null);
    const [user, setUser] = useState(null);
    const [content, setContent] = useState(null);
    const [needsSignIn, setNeedsSignIn] = useState(false);

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    useEffect(() => {
        if (!loading) {

            const user = data?.me || data?.user || {};
            setUser(user)
        }
    }, [loading, data]);

    useEffect(() => {
        const initDB1 = async () => {
            const db = await openDB('MyDB', 1, {
                upgrade(db) {
                    db.createObjectStore('tmdbshows');
                },

            });
            setDb1(db);
        };
        initDB1();

        const initDB2 = async () => {
            const db = await openDB('ShowDB', 1, {
                upgrade(db) {
                    db.createObjectStore('shows');
                },
            });
            setDb2(db);
        };
        initDB2();
    }, []);

    useEffect(() => {
        const fetchShows = async () => {
            console.log("🚀 ~ file: Recommend.js:49 ~ fetchShows ~ user:", user)

            if (!user || !user.shows || !db1 || !db2) {
            setIsLoading(false);
            setNeedsSignIn(true);

                return;
            }

            const showsCache = [];
            for (let show of user.shows) {
                const cache = await db1.get('tmdbshows', show.themoviedb.id.toString());

                if (!cache) {
                    const storageKey = `show-${show.themoviedb.imdb_id}`;
                    const cache2 = await db2.get('shows', storageKey);

                    if (cache2) {
                        showsCache.push({ ...cache2, showId: show._id });
                    }
                } else {
                    showsCache.push({ ...cache, showId: show._id });
                }
            }
            setContent(showsCache)
            console.log("Shows Cache", showsCache);
            setIsLoading(false);
            setNeedsSignIn(false)
        };

        fetchShows();
    }, [user, db1, db2]);
    useEffect(() => {
        console.log("bcdshcjusbckjsdbcjkds:", content);
    }, [content])
    return (
        <div className='trending__product' style={{ margin: '70px 0px 70px 40px' }}>
            <h4 data-aos="fade-up"
                data-aos-delay="700" style={{padding:'0px'}} >Recommendations
                <div className='header-underline'></div>
            </h4>
            {isLoading ? <div>Loading...</div> :
            needsSignIn ? <div className='text-center recommendation-box'>Please sign in</div> : 
            <div style={{ display: 'flex', overflowX: 'auto', padding: '1rem', scrollSnapType:'x mandatory' }}>
                {content && content.map((show, index) => (
                    <div className="product__item mx-auto" style={{scrollSnapAlign:'strat'}} >
                        <Card className='contentcard product__item__pic set-bg' key={index} style={{width:'285px'}} >
                        {show.additionalData ? (
                            <Card.Img className='cardimage' src={show.additionalData.similars[0].image} alt="Card image" style={{ height: '30rem', objectFit: 'cover' }}/>
                        ) : (
                            <Card.Img className='cardimage' src={show.imdb.similars[0].image} alt="No image available" style={{ height: '30rem', objectFit: 'cover' }}/>
                        )}
                            <Card.ImgOverlay>
                            <div className='imageoverlay'>
                                    <Card.Title>{show.additionalData?.similars?.[0]?.title || show.imdb?.similars?.[0]?.title}</Card.Title>
                                    <Card.Text>{show.additionalData?.similars?.[0]?.imDbRating || show.imdb?.similars?.[0]?.imDbRating}</Card.Text>
                                </div>
                            </Card.ImgOverlay>
                        </Card>
                    </div>
                ))}
            </div>}
        </div>
    )
    


}

export default Recommend;
