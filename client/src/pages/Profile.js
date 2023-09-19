import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { openDB } from 'idb';
import axios from 'axios';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { REMOVE_SHOW, REMOVE_MOVIE,REMOVE_ANIME } from '../utils/mutations';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlay, faRankingStar, faArrowRight, faTrashCanArrowUp, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { MyContext } from '../components/MyContext';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';

const Profile = () => {
  const { username: userParam } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { myState, setMyState } = useContext(MyContext);
  const { loading, data, error } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  const user = data?.me || data?.user || {};
  const [view, setView] = useState('shows');
  const [db, setDb] = useState(null);
  const [cachedShows, setCachedShows] = useState([]);
  const [cachedMovies, setCachedMovies] = useState([]);
  const [cachedAnime, setCachedAnime] = useState([]);
  const [removeShow, { errr }] = useMutation(REMOVE_SHOW);
  const [removeMovie, { er }] = useMutation(REMOVE_MOVIE);
  const [removeAnime, { errorAnime }] = useMutation(REMOVE_ANIME);

  // When the delete button is clicked:
  const handleDeleteShow = async (showId, id) => {
    try {
      await removeShow({ variables: { showId } });
      const savedShowsData = JSON.parse(localStorage.getItem('savedShows'));
      if (savedShowsData) {
          // If the show is saved, remove it from local storage
          if (savedShowsData.hasOwnProperty(id)) {
              delete savedShowsData[id];
              localStorage.setItem('savedShows', JSON.stringify(savedShowsData));
          }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteMovie = async (movieId, id) => {
    try {
      await removeMovie({ variables: { movieId } });
      const savedMoviesData = JSON.parse(localStorage.getItem('savedMovies'));
      if (savedMoviesData) {
        // If the movie is saved, remove it from local storage
        if (savedMoviesData.hasOwnProperty(id)) {
          delete savedMoviesData[id];
          localStorage.setItem('savedMovies', JSON.stringify(savedMoviesData));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteAnime = async (animeId, id) => {
    try {
      // remove anime from database
      await removeAnime({ variables: { animeId } });
      
      const savedAnimeData = JSON.parse(localStorage.getItem('savedAnime'));
      if (savedAnimeData && savedAnimeData.hasOwnProperty(id)) {
        // Remove anime from saved list
        delete savedAnimeData[id];
        localStorage.setItem('savedAnime', JSON.stringify(savedAnimeData));
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const isAnimeSaved = (id) => {
    try {
      const savedAnimeData = JSON.parse(localStorage.getItem('savedAnime'));
      return savedAnimeData && savedAnimeData.hasOwnProperty(id);
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  
  useEffect(() => {
    const setupDB = async () => {
      try {
        const db = await openDB('MyDB', 1, {
          upgrade(db) {
            db.createObjectStore('tmdbshows');
          },
        });
        setDb(db);

      } catch (err) {
        console.log('Error setting up DB:', err);
      }
    };

    setupDB();
  }, []);

  useEffect(() => {
    setMyState(0);
    const fetchShows = async () => {
      if (!user.shows || !db) {
        return;
      }

      const showsCache = [];
      for (let show of user.shows) {
        const cache = await db.get('tmdbshows', show.themoviedb.id.toString());

        if (!cache) {
          // If the show is not in the first storage, check the second storage
          const db2 = await openDB('ShowDB', 1, {
            upgrade(db2) {
              db2.createObjectStore('shows');
            },
          });

          const storageKey = `show-${show.themoviedb.imdb_id}`;
          const cache2 = await db2.get('shows', storageKey);

          if (cache2) {
            showsCache.push({ ...cache2, showId: show._id });
          }
        } else {
          showsCache.push({ ...cache, showId: show._id });
        }
      }

      setCachedShows(showsCache);
    };

    fetchShows();
  }, [user.shows, db]);
  useEffect(() => {
    const fetchMovies = async () => {
      if (!user.movies) {
        return;
      }
      const dbmovie = await openDB('MyDBMovies', 1, {
        upgrade(dbmovie) {
          dbmovie.createObjectStore('tmdbmovies');
        },
      });
      const moviesCache = [];
      for (let movie of user.movies) {
        const cache = await dbmovie.get('tmdbmovies', movie.tmdbId.toString());
  
        if (cache) {
          moviesCache.push({ ...cache, movieId: movie._id });
        }
      }
  
      setCachedMovies(moviesCache);
    };
  
    fetchMovies();
  }, [user.movies]);
  
  useEffect(() => {
    const fetchAnime = async () => {
      if (!user.animes) {
        return console.log("failed");
      }
      const dbanime = await openDB('MyDBAnime', 1, {
        upgrade(dbanime) {
          dbanime.createObjectStore('myAnimes');
        },
      });
      const animeCache = [];
      for (let anime of user.animes) {
        const cache = await dbanime.get('myAnimes', anime.animeName.toString());

        if (cache) {
          animeCache.push({ ...cache, animeId: anime._id });
          
        }
      }

      setCachedAnime(animeCache);
    };

    fetchAnime();
  }, [user.animes]);


  useEffect(() => {

    console.log('all:', cachedShows, cachedMovies, "annime:",cachedAnime);
    setIsLoading(false);

  }, [cachedShows])

  if (error) {
    console.error("There was an error!", error);
  }

  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading || isLoading) {
    return <div><div id="load">
  <div>G</div>
  <div>N</div>
  <div>I</div>
  <div>D</div>
  <div>A</div>
  <div>O</div>
  <div>L</div>
</div></div>;
  }

  if (!user?.username) {
    return (
      <h4 className='text-center m-5'>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }
  const renderView = () => {
    switch (view) {
      case 'movies':
        return cachedMovies.map(card => (
          <section className="dark text-dark">
            <div className="container py-4">
            <article className={`postcard ${cards.theme} ${getRatingColor(card.imdb ? card.imdb.imDbRating : card.additionalData.imDbRating)}`}>
                <a className="postcard__img_link" >
                  <img className="postcard__img" src={card.imdb && card.imdb.image} alt={card.imdb && card.imdb.fullTitle} />
                </a>
                <div className="postcard__text">
                  <h1 className={`postcard__title ${card.color}`}>
                    <a href="#">{card.imdb && card.imdb.fullTitle}</a>
                  </h1>
                  <div className="postcard__subtitle small">
                    <time datetime={card.imdb && card.imdb.releaseDate}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="mx-2" />
                      {card.imdb ? (card.imdb.releaseDate) : ('')}
                    </time>
                  </div>
                  <div className="postcard__bar"></div>
                  <div className="postcard__preview-txt">{card.imdb.wikipedia.plotFull.plainText}</div>
                  <ul className="postcard__tagbox">
                    <li className="tag__item hover-delete">
                      <FontAwesomeIcon icon={faTrashCanArrowUp} className="mx-2" />
                      <button className='' style={{ borderStyle: 'none', backgroundColor: 'transparent', color: 'white' }} onClick={() => handleDeleteMovie(card.movieId, card?.movieId)}>Delete</button>
                    </li>
                    <li className="tag__item">
                      <FontAwesomeIcon icon={faRankingStar} className="mx-2" />
                     {card.imdb ? (card.imdb.imDbRating) : ('')}
                    </li>
                    <li className={`tag__item play ${card.color}`}>
                      <Link to={`/moviedetails?id=${card.movie.id}`}>
                        <FontAwesomeIcon icon={faPlay} className="mx-2" />
                        Play Episode
                      </Link>

                    </li>
                    {/* <li className="tag__item">
                      {card.movie.networks[0].name}
                   <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                    </li> */}
                   
                  </ul>
                </div>
              </article>

            </div>
          </section>
        ));
        case 'shows':
          return cachedShows.map(card => (
            <section className="dark text-dark">
            <div className="container py-4">
            <article className={`postcard ${cards.theme} ${getRatingColor(card.imdb ? card.imdb.imDbRating : card.additionalData.imDbRating)}`}>
                <a className="postcard__img_link" href="#">
                  <img className="postcard__img" src={(card.imdb && card.imdb.image) || (card.additionalData && card.additionalData.image)} alt={card.imdb && card.imdb.fullTitle} />
                </a>
                <div className="postcard__text">
                  <h1 className={`postcard__title ${card.color}`}>
                    <a href="#">{(card.imdb && card.imdb.fullTitle) || (card.additionalData.fullTitle)}</a>
                  </h1>
                  <div className="postcard__subtitle small">
                    <time datetime={card.imdb && card.imdb.releaseDate}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="mx-2" />
                      {card.imdb ? (card.imdb.releaseDate) : (card.additionalData.releaseDate)}
                    </time>
                  </div>
                  <div className="postcard__bar"></div>
                  <div className="postcard__preview-txt">{card.show ? (card.imdb && card.imdb.wikipedia.plotFull.plainText) : (card.additionalData.wikipedia.plotFull.plainText)}</div>
                  <ul className="postcard__tagbox">
                    <li className="tag__item hover-delete">
                      <FontAwesomeIcon icon={faTrashCanArrowUp} className="mx-2" />
                      <button className='' style={{ borderStyle: 'none', backgroundColor: 'transparent', color: 'white' }} onClick={() => handleDeleteShow(card.showId, card?.showId, card?.show?.id || card?.reviewsAndEpisodeGroups?.episodeGroups?.id)}>Delete</button>
                    </li>
                    <li className="tag__item">
                      <FontAwesomeIcon icon={faRankingStar} className="mx-2" />
                     {card.imdb ? (card.imdb.imDbRating) : (card.additionalData.imDbRating)}
                    </li>
                    <li className={`tag__item play ${card.color}`}>
                      <Link to={card?.show?.id ? `/details?id=${card.show.id}` : `/details?id=${card?.reviewsAndEpisodeGroups?.episodeGroups?.id || ''}`}>
                        <FontAwesomeIcon icon={faPlay} className="mx-2" />
                        Play Episode
                      </Link>

                    </li>
                    <li className="tag__item">
                      <a href={card.show ? (card.show.homepage) : (card.reviewsAndEpisodeGroups.episodeGroups.homepage)} target='_blank'>
                         {card.show ? (card.show.networks[0].name) : (card.reviewsAndEpisodeGroups.episodeGroups.networks[0].name)}
                   <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                      </a>
                     
                    </li>
                   
                  </ul>
                </div>
              </article>

            </div>
          </section>
          ));
      case 'anime':
        return cachedAnime.map(card => (
          <section className="dark text-dark">
          <div className="container py-4">
          <article className={`postcard ${cards.theme}` }styles={{backgroundColor:"yellow"}}>
              <a className="postcard__img_link" href="#">
                <img className="postcard__img" src={card.data.attributes.posterImage.original} />
              </a>
              <div className="postcard__text">
                <h1 className={`postcard__title ${cards.color}`}>
                  <a href="#">{card.data.attributes.titles.en}/{card.data.attributes.titles.ja_jp}</a>
                </h1>
                <div className="postcard__subtitle small">
                  <time datetime={card.data.attributes.startDate}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="mx-2" />
                    {card.data.attributes.startDate}
                  </time>
                </div>
                <div className="postcard__bar"></div>
                <div className="postcard__preview-txt">{card.data.attributes.description}</div>
                <ul className="postcard__tagbox">
                  <li className="tag__item hover-delete">
                    <FontAwesomeIcon icon={faTrashCanArrowUp} className="mx-2" />
                    <button className='' style={{ borderStyle: 'none', backgroundColor: 'transparent', color: 'white' }} onClick={() => handleDeleteAnime(card.animeId)}>Delete</button>
                  </li>
                  <li className="tag__item">
                    <FontAwesomeIcon icon={faRankingStar} className="mx-2" />
                   {card.data.attributes.ageRating}
                  </li>
                  <li className={`tag__item play ${card.color}`}>
                    <Link to={`/anime?name=${card.data.attributes.titles.en}`}>
                      <FontAwesomeIcon icon={faPlay} className="mx-2" />
                      Play Episode
                    </Link>

                  </li>
                  {/* <li className="tag__item">
                    {card.show ? (card.show.networks[0].name) : (card.reviewsAndEpisodeGroups.episodeGroups.networks[0].name)}
                 <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                  </li>
                  */}
                </ul>
              </div>
            </article>

          </div>
        </section>
        ));
      default:
        return null;
    }
  };
  const getRatingColor = (rating) => {
    if (rating >= 8) {
      return "green";
    } else if (rating >= 6) {
      return "yellow";
    } else {
      return "red";
    }
  };
  
  let cards = [
    {
      theme: "dark",
      color: "blue",
      imgLink: "https://picsum.photos/1000/1000",
      title: "Podcast Title",
      time: "2020-05-25 12:00:00",
      preview: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
      tags: ["Podcast", "55 mins.", "Play Episode"]
    },
  ]

  return (
    <Container>
    <Row className="justify-content-md-center mb-3 pill">
      <Col xs={12} md={10} className="bg-dark text-light p-3 mb-5 rounded-4">
        <h2 className='text-center'>
          Viewing your profile
        </h2>
      </Col>

      {isLoading ? (
        <Col><div id="load">
  <div>G</div>
  <div>N</div>
  <div>I</div>
  <div>D</div>
  <div>A</div>
  <div>O</div>
  <div>L</div>
</div></Col>
      ) : (
        <Col>
          <Dropdown onSelect={(value) => setView(value)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {view}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="shows">Shows</Dropdown.Item>
              <Dropdown.Item eventKey="movies">Movies</Dropdown.Item>
              <Dropdown.Item eventKey="anime">Anime</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {renderView()}
        </Col>
      )}
    </Row>
  </Container>
  );
}

export default Profile;

