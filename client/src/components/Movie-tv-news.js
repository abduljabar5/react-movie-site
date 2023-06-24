import React from 'react';
import { useState, useEffect } from 'react';
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

  const openAndUpgradeDB = async () => {
    const db = await openDB('NewsDB', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('news')) {
          db.createObjectStore('news');
        }
      },
    });

    return db;
  };

  const getNews = async () => {
    try {
      const db = await openAndUpgradeDB();
      const newsData = await db.get('news', 'latest');
      if (newsData) {
        setNews(newsData.articles);
        setIsLoading(false);
      }
      else {
        console.log('No data in IndexedDB');
        getNews();
      }
    } catch (err) {
      console.log("🚀 ~ file: Movie-tv-news.js:40 ~ getNews ~ err:", err)
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
      <div className="product__sidebar" style={{ marginTop: '125px', marginLeft: '20px' }}>
        <div className="product__sidebar__view">
          <div className="section-title">
            <h5>News</h5>
          </div>

          {isLoading ? (
            <p><div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
          </div>...</p>
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
                      <Modal.Header className="product__sidebar__view__item set-bg"
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
