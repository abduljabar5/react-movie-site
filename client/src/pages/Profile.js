import React, { useEffect, useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { openDB } from 'idb';
import axios from 'axios';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { REMOVE_SHOW } from '../utils/mutations';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlay, faRankingStar, faArrowRight, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { username: userParam } = useParams();
  const [isLoading, setIsLoading] = useState(true)
  const { loading, data, error } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  const user = data?.me || data?.user || {};
  const [db, setDb] = useState(null);
  const [cachedShows, setCachedShows] = useState([]);
  const [removeShow, { errr }] = useMutation(REMOVE_SHOW);

  // When the delete button is clicked:
  const handleDeleteShow = async (showId, id) => {
    try {
      await removeShow({ variables: { showId } });
      const savedShowsData = JSON.parse(localStorage.getItem('savedShows'));
      if (savedShowsData) {
          // If the show is saved, remove it from local storage
          if (savedShowsData.hasOwnProperty(id)) {
              delete savedShowsData[id];

              // Save the updated data back to local storage
              localStorage.setItem('savedShows', JSON.stringify(savedShowsData));
          }
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log('just user', user);
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
    const fetchShows = async () => {
      console.log("just edit", user.shows);
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
      console.log("hi besty", showsCache);
    };

    fetchShows();
  }, [user.shows, db]);
  useEffect(() => {

    console.log('jojojoj', cachedShows);
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
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  // The rest of your component...
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
    // More card data...
  ]

  console.log('jojojoj', cachedShows);

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {isLoading ? (
          <div> loaded</div>
        ) : (
          <div>
            {cachedShows.map(card => (
              <section className="dark text-dark">
                <div className="container py-4">
                  <article className={`postcard ${cards.theme} green`}>
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
                      <div className="postcard__preview-txt">{card.show ? (card.show && card.show.overview) : (card.reviewsAndEpisodeGroups.episodeGroups.overview)}</div>
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
                          {card.show ? (card.show.networks[0].name) : (card.reviewsAndEpisodeGroups.episodeGroups.networks[0].name)}
                       <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                        </li>
                       
                      </ul>
                    </div>
                  </article>

                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div> // <--- added closing tag here
  );
}

export default Profile;

