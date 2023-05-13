import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/News';

// Import Bootstrap CSS and JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const MovieNews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState([]);

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
              {news.slice(0, 10).map((network, index) => {
                return (
                  <div className="container">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={'#' + network.author}
                    >
                      Launch demo modal
                    </button>
                    <div className="filter__gallery" key={network}>
                      <div
                        className="product__sidebar__view__item set-bg"
                        style={{
                          backgroundImage: `url(${network.urlToImage})`,
                        }}
                      >
                        <div className="ep"></div>
                        <div className="view">
                          <i className="fa fa-eye"></i> {network.id}
                        </div>
                        <h5>
                          <a
                            data-bs-toggle="modal"
                            data-bs-target={'#' + network.author}
                            style={{ color: 'white' }}
                          >
                            {network.title}
                          </a>
                        </h5>
                      </div>
                    </div>

                    <div
                      className="modal fade"
                      id={network.author}
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                              Modal title
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">{network.title}</div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
