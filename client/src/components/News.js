import React, { useEffect, useState } from 'react'
import API from '../api/News';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInfo } from '@fortawesome/free-solid-svg-icons';


const News = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [news, setNews] = useState([]);

    const getNews = async () => {
        console.log('first');
        try {
            console.log('trying to run news block');
            const res = await API.news();
            setNews(res.data.articles);
            setIsLoading(false);
            console.log('returned');
        } catch (err) {
            // handle errors
        }
    };

    useEffect(() => {
        getNews();
    }, []);

    useEffect(() => {
        console.log('hi news', news);
    }, [news]);

    // const handleModalClose = () => setModalShow(false);

    // const handleModalShow = (newsItem) => {
    //   setModalContent(newsItem);
    //   setModalShow(true);
    // };
    return (
        <section className='news-block-container' id='news-block'>
            {isLoading ? (<div></div>) : (
                <><div className='news-slit'>
                    <div className='main-news'>
                        <img src={news[0].image} style={{ width: '100%' }}></img>
                        <div className="info-overlay">
                            <div className='info-text'>{news[0].title}</div>
                            <a href={news[0].url} target='blank'>
                                    <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ bottom: '5%', right: "2%", position: 'absolute' }} />

                                </a>
                        </div>
                    </div>

                    <div className='smaller-new'>
                        <div className='smaller-new'>
                            <div className='small-news-one'>
                                <img src={news[2].image} style={{ width: '100%', minHeight: '204px' }} />
                                <div className='overlay-text'>{news[2].title}</div>
                            </div>
                            <div className='small-news-one'>
                                <img src={news[3].image} style={{ width: '100%', minHeight: '204px' }} />
                                <div className='overlay-text'>{news[3].title}</div>
                            </div>
                        </div>
                    </div>

                </div>
                    <div className='news-slit'>

                        <div className='smaller-news-container'>
                            <div className='smaller-new'>
                                <div className='small-news-one'>
                                    <img src={news[4].image} style={{ width: '100%', minHeight: '204px' }} />
                                    <div className='overlay-text'>{news[4].title}</div>
                                </div>
                                <div className='small-news-one'>
                                    <img src={news[5].image} style={{ width: '100%', minHeight: '204px' }} />
                                    <div className='overlay-text'>{news[5].title}</div>
                                </div>
                            </div>
                            {/* <div className='smaller-new'></div> */}
                        </div>
                        <div className='main-news'>
                            <img src={news[1].image} style={{ width: '100%' }}></img>
                            <div className="info-overlay">
                                <div className='info-text'>{news[1].title}</div>
                                <a href={news[1].url} target='blank'>
                                    <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ bottom: '5%', right: "2%", position: 'absolute' }} />

                                </a>
                            </div>
                        </div>

                    </div>
                </>
            )}


        </section>
    )
}

export default News