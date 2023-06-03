import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/News';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieNews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const getNews = async () => {
    try {
      console.log('trying to run news');
      const res = await API.news();
      setNews(res.data.articles);
      setIsLoading(false);
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

  const handleModalClose = () => setModalShow(false);

  const handleModalShow = (newsItem) => {
    setModalContent(newsItem);
    setModalShow(true);
  };

  return (
    <aside className="anime-container">
      <div className="product__sidebar">
        <div className="product__sidebar__view">
          <div className="section-title">
            <h5>Top Views</h5>
          </div>
          <ul className="filter__controls">
            <li className="active" data-filter="*">
              Day
            </li>
            <li data-filter=".week">Week</li>
            <li data-filter=".month">Month</li>
            <li data-filter=".years">Years</li>
          </ul>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="img-container">
              {news.map((network, index) => {
                return (
                  <div className="container" key={network.author}>
                    <Button variant="primary" onClick={() => handleModalShow(network)}>
                      Launch demo modal
                    </Button>
                    <div className="filter__gallery">
                      <div
                        className="product__sidebar__view__item set-bg"
                        style={{
                          backgroundImage: `url(${network.image})`,
                        }}
                      >
                        <div className="ep"></div>
                        <div className="view">
                          <i className="fa fa-eye"></i> {network.id}
                        </div>
                        <h5>
                          <a onClick={() => handleModalShow(network)} style={{ color: 'white' }}>
                            {network.title}
                          </a>
                        </h5>
                      </div>
                    </div>

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
