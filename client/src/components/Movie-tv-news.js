import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/News';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { openDB } from 'idb';

const MovieNews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const getDataFromDB = async (storeName) => {
    const db = await openDB('NewsDB', 2, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    return await db.get(storeName, 'latest');
  };

  const getNews = async () => {
    try {
      console.log('trying to run news');
      const newsData = await getDataFromDB('news');
      if (newsData) {
        setNews(newsData.articles);
        setIsLoading(false);
      }
      else {
        console.log('No data in IndexedDB');
        getNews();
      }
    } catch (err) {
      // handle errors
    }
  };

  useEffect(() => {
    getNews();
  }, []);
 
  const handleModalClose = () => setModalShow(false);

  const handleModalShow = (newsItem) => {
    setModalContent(newsItem);
    setModalShow(true);
  };

  return (
    <aside className="anime-container">
      <div className="product__sidebar" style={{marginTop:'125px',marginLeft:'20px'}}>
        <div className="product__sidebar__view">
          <div className="section-title">
            <h5>News</h5>
          </div>
         
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="img-container2">
              {news.map((network, index) => {
                return (
                  <div className="container my-2" key={network.author}>
                    <a variant="primary" onClick={() => handleModalShow(network)}>
                       <div className="filter__gallery2">
                      <div
                        className="product__sidebar__view__item set-bg"
                        style={{
                          backgroundImage: `url(${network.image})`,
                        }}
                      >
                        <h5>
                          <a onClick={() => handleModalShow(network)} style={{ color: 'white' }}>
                            {network.title}
                          </a>
                        </h5>
                      </div>
                    </div>
  </a>
                    <Modal show={modalShow} onHide={handleModalClose}>
                      <Modal.Header  className="product__sidebar__view__item set-bg"
                        style={{
                          backgroundImage: `url(${modalContent.image})`,
                        }} closeButton>
                        <Modal.Title>{modalContent.title}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>{modalContent.content}</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                          Close
                        </Button>
                        
                        <Button variant="primary" href={modalContent.url} onClick={handleModalClose}>
                         Read More 
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default MovieNews;
