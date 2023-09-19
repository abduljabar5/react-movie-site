import React, { useEffect, useState } from 'react'
import API from '../api/News';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { openDB } from 'idb';

import { faInfo } from '@fortawesome/free-solid-svg-icons';


const News = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [news, setNews] = useState([]);
    
    const openAndUpgradeDB = async () => {
        const db = await openDB('NewsDB', 1, { // Downgrade to version 1
            upgrade(db, oldVersion, newVersion, transaction) {
                if (!db.objectStoreNames.contains('news')) {
                    db.createObjectStore('news');
                }
            },
        });

        return db;
    };

    const saveNewsToDB = async (news) => {
        const db = await openAndUpgradeDB();
        await db.put('news', news, 'latest');
    };

    const getNewsFromDB = async () => {
        console.log("getNewsFromDB");
        try {
            const db = await openAndUpgradeDB();
            return await db.get('news', 'latest');
        } catch (err) {
            console.error("Error reading 'news' from IndexedDB:", err);
            return null;
        }
    };
    const getNews = async () => {
        try {
            let newsData = await getNewsFromDB();
            console.log("🚀 ~ file: News.js:35 ~ getNews ~ newsData:", newsData)

            if (!newsData || new Date() - new Date(newsData.fetchTime) > 3600000) {
                const res = await API.news();
                newsData = {
                    fetchTime: new Date(),
                    articles: res.data.articles,
                };
                saveNewsToDB(newsData);
            }
    
            setNews(newsData.articles);
            setIsLoading(false);
        } catch (err) {
           console.log(err);
        }
    };
    

    useEffect(() => {
        getNews();
    }, []);

    // useEffect(() => {
    //     console.log('hi news', news);
    // }, [news]);

    // const handleModalClose = () => setModalShow(false);

    // const handleModalShow = (newsItem) => {
    //   setModalContent(newsItem);
    //   setModalShow(true);
    // };
    return (
        <section className='news-block-container m-4 rounded-4' id='news-block'>
             <h1  data-aos="fade-up"
  data-aos-delay="700" style={{margin:'5px 25px'}}>Trending
  <div className='header-underline'></div>
  </h1>
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

                    <div className='smaller-news-container'>
                        <div className='smaller-new'>
                            <div className='small-news-one'>
                                <img src={news[2].image} style={{ width: '100%', minHeight: '204px' }} />
                                <a href={news[2].url} style={{textDecoration:'none'}}  target='blank'>
                                <div className='overlay-text'>{news[2].title}
                                </div>
                                    {/* <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ }} /> */}
                                </a>
                            </div>
                            <div className='small-news-one'>
                                <img src={news[3].image} style={{ width: '100%', minHeight: '204px' }} />
                                <a href={news[3].url} style={{textDecoration:'none'}}  target='blank'>
                                <div className='overlay-text'>{news[3].title}
                                </div>
                                    {/* <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ }} /> */}
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
                    <div className='news-slit'>

                        <div className='smaller-news-container'>
                            <div className='smaller-new'>
                                <div className='small-news-one'>
                                    <img src={news[4].image} style={{ width: '100%', minHeight: '204px' }} />
                                    <a href={news[4].url} style={{textDecoration:'none'}}  target='blank'>
                                <div className='overlay-text'>{news[4].title}
                                </div>
                                    {/* <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ }} /> */}
                                </a>
                                </div>
                                <div className='small-news-one'>
                                    <img src={news[5].image} style={{ width: '100%', minHeight: '204px' }} />
                                    <a href={news[5].url} style={{textDecoration:'none'}}  target='blank'>
                                <div className='overlay-text'>{news[5].title}
                                </div>
                                    {/* <FontAwesomeIcon icon={faInfo} className="mx-2" style={{ }} /> */}
                                </a>
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