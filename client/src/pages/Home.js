import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Auth from '../utils/auth';
import helper from '../styles/images/helper.svg'
import IconDoubleRight from '../components/Icons/Right-arrow';
import News from '../components/News';
import API from '../api/Trending';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import TrendingAnime from '../components/TrendingAnime';
import MovieNews from '../components/Movie-tv-news';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import youtube from '../styles/images/youtubetv.png'
import axios from 'axios';
const Movies = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showchat, setShowChat] = useState(false);

    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    const user = data?.me || data?.user || {};

    useEffect(() => {

        if (Auth.loggedIn()) {
            setShowChat(true);
        } else {
            console.log('login');
        }

    }, []);

    const [shows, setShow] = useState([]);
    let [progress, setProgress] = useState(89);
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);

    const [nowplaying, seNowplaying] = useState([]);
    const [trendingToday, setTrendingToday] = useState([]);
    const genreColors = {
        Action: '#FF0000', // Red for Action
        Comedy: '#FFFF00', // Yellow for Comedy
        Drama: '#0000FF', // Blue for Drama
        // Add more genre-color mappings as needed...
        default: '#888' // Grey for other genres
    };
    useEffect(() => {
        const fetchData = async () => {
            const Today = await API.trendingToday();
            setTrendingToday(Today.data.results);
            const genresResponse = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
            setGenres(genresResponse.data.genres);
            const showResults = await API.search();
            setShow(showResults.data.results);

            const movieResults = await API.trendingMovies();
            setMovies(movieResults.data.results);

            const nowPlayingResults = await API.inTheaters();
            seNowplaying(nowPlayingResults.data.results);

            setIsLoading(false);
            console.log('today', Today.data.results);
            console.log(showResults.data.results);
            console.log(movieResults.data.results);
            console.log(nowPlayingResults.data.results);
        };

        fetchData();
    }, []);
    const Stars = ({ vote_average }) => {
        const starRating = Math.round(vote_average / 2); // assuming vote_average is 1 to 10
        let stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= starRating) {
                stars.push(<i key={i} className="fa fa-star text-danger"></i>);
            } else if (i === Math.ceil(vote_average / 2) && vote_average % 2 !== 0) {
                stars.push(<i key={i} className="fa fa-star-half-o text-danger"></i>);
            } else {
                stars.push(<i key={i} className="fa fa-star-o text-danger"></i>);
            }
        }

        return <span className="col_red me-3">{stars}</span>;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    setIsLoading(false);
                    clearInterval(timer);
                    return 98;
                }
                return oldProgress + 20;
            });
        }, 1);

        return () => {
            clearInterval(timer);
        };
    }, []);


    const style = {
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '35rem',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    };
    return (
        <main>
            {isLoading ? (
                <ProgressBar animated now={progress} />
            ) : (
                <div>
                    <div>
                        <div id="carouselExampleAutoplaying" className="carousel slide carousel-fade" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {trendingToday.map((today, index) => {
                                    return (
                                        <div className={`carousel-item${index === 0 ? " active" : ""}`}>
                                            <Card className="bg-dark text-white image-container">
                                                <Card.Img style={{
                                                    ...style,
                                                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${today.backdrop_path})`,
                                                }} />
                                                <Card.ImgOverlay className='today-trend-name homepage-subtext'>
                                                    <h1 className="font_60"> {today.original_title || today.original_name}</h1>
                                                    <h6 className="mt-3">
                                                        <Stars vote_average={today.vote_average} />({today.media_type}) Year : {today?.release_date?.split('-')[0] ?? ''}
                                                        <p className="my-2"><span className="col_red me-1 fw-bold">Genres:</span> {
                                                            today.genre_ids.map(id => {
                                                                const genre = genres.find(genre => genre.id === id);
                                                                const genreColor = genre ? genreColors[genre.name] || genreColors.default : genreColors.default;
                                                                return genre ?
                                                                    <span style={{ padding: '2px 8px', backgroundColor: genreColor, color: '#fff', borderRadius: '4px', marginRight: '5px' }}>
                                                                        {genre.name}
                                                                    </span>
                                                                    :
                                                                    <span>

                                                                    </span>;
                                                            })
                                                        }</p>
                                                    </h6>
                                                    <p className="mt-3">{today.overview}</p>
                                                    <Link to={today.media_type === 'tv' ? (`/details?id=${today.id}`) : (`/moviedetails?id=${today.id}`)}>
                                                        <h6 className="mt-4"><p className="button" ><i className="fa fa-play-circle align-middle me-1"></i> Watch Trailer</p></h6>
                                                    </Link>

                                                </Card.ImgOverlay>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExampleAutoplaying"
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExampleAutoplaying"
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    <section id='logos-slider'>
                        <div className="logo-slider">
                            <div className="slide-track">
                                <div className="slide">
                                    <img src='https://www.logo.wine/a/logo/20th_Century_Fox/20th_Century_Fox-Logo.wine.svg' height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Prime_Video/Prime_Video-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Disney%2B/Disney%2B-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Hulu/Hulu-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/HBO_Max/HBO_Max-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Apple_TV/Apple_TV-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Aniplex_of_America/Aniplex_of_America-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/IMDb/IMDb-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Tubi/Tubi-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Crunchyroll/Crunchyroll-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Funimation/Funimation-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/Bandai_Namco_Holdings/Bandai_Namco_Holdings-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                                <div className="slide">
                                    <img src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg" height="100" width="250" alt="" />
                                </div>
                            </div>
                        </div>

                    </section>

                    <div className='all-container'>
                        <div className='movie-tv-container'>
                            <div className="product spad">

                                <div className="">

                                    <div className="trending__product">
                                        <div className="row">

                                            <div className="row">
                                                <div className="btn__all" style={{ display: 'flex', justifyshow: 'space-between' }}>
                                                    <div className="div-title">
                                                        <h4 data-aos="fade-up"
                                                            data-aos-delay="500">Trending Series

                                                            <div className='header-underline'></div>
                                                        </h4>

                                                    </div>
                                                    <Link to='/TV-Shows' className="primary-btn ms-auto" style={{ textDecoration: 'none', color: '#1b9cff' }}>View All <span className="arrow_right" ><IconDoubleRight /></span></Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='boobo'>
                                            {shows.map((show) => {
                                                if (show.origin_country[0] === "US" || "JP") {
                                                    // console.log(JSON.stringify(show.name));
                                                    const id = show.id
                                                    return (

                                                        <div className="product__item mx-auto">
                                                            <Link to={`/details?id=${id}`}>
                                                                <Card className='contentcard product__item__pic set-bg'>
                                                                    <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/w400/${show.poster_path}`} alt="Card image" />
                                                                    <Card.ImgOverlay >
                                                                        <FontAwesomeIcon icon={faCirclePlay} size="3x" className="mx-2 playbtn" />
                                                                        <div className='imageoverlay'>
                                                                            <Card.Title>{show.original_name}</Card.Title>
                                                                            <Card.Text>{show.first_air_date}</Card.Text>
                                                                        </div>
                                                                        {/* <div className={show.rankUpDown.includes('+') ? ('comment bg-success') : ('comment bg-danger')}>{show.rankUpDown}</div> */}
                                                                        <div className="view" style={{ height: 'fit-content' }}>{show.vote_average}</div>
                                                                    </Card.ImgOverlay>
                                                                </Card></Link>
                                                            {/* <div className="product__item__text">
                                                <ul>
                                                    <li className='text-dark'><h4>{show.name}</h4></li>
                                                    <li className='text-danger'><cite>{show.first_air_date}</cite></li>
                                                </ul>
                                            </div> */}
                                                        </div>
                                                    )
                                                }
                                            })}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product spad" style={{ marginTop: '70px' }}>

                                <div className="">

                                    <div className="trending__product">
                                        <div className="row">
                                            <div className="row">
                                                <div className="btn__all" style={{ display: 'flex', justifyshow: 'space-between' }}>
                                                    <div className="div-title">
                                                        <h4 data-aos="fade-up"
                                                            data-aos-delay="700">Trending Movies
                                                            <div className='header-underline'></div>
                                                        </h4>

                                                    </div>
                                                    <Link to='/movies' className="primary-btn ms-auto" style={{ textDecoration: 'none', color: '#1b9cff' }}>View All <span className="arrow_right" ><IconDoubleRight /></span></Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='boobo'>
                                            {movies.map((show) => {
                                                // if (show.origin_country[0] === "US" ||"JP") {
                                                // console.log(JSON.stringify(show.name));
                                                const id = show.id
                                                return (

                                                    <div className="product__item mx-auto">
                                                        <Link to={`/moviedetails?id=${id}`}>
                                                            <Card className='contentcard product__item__pic set-bg'>
                                                                <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/w400/${show.poster_path}`} alt="Card image" />
                                                                <Card.ImgOverlay >
                                                                    <FontAwesomeIcon icon={faCirclePlay} size="3x" className="mx-2 playbtn" />
                                                                    <div className='imageoverlay'>
                                                                        <Card.Title>{show.original_title}</Card.Title>
                                                                        <Card.Text>{show.release_date}</Card.Text>
                                                                    </div>
                                                                    {/* <div className={show.rankUpDown.includes('+') ? ('comment bg-success') : ('comment bg-danger')}>{show.rankUpDown}</div> */}
                                                                    <div className="view" style={{ height: 'fit-content' }}>{show.vote_average}</div>
                                                                </Card.ImgOverlay>
                                                            </Card></Link>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>
                                </div>

                            </div>


                        </div>

                        <div style={{ width: '100%' }}>
                            <TrendingAnime />
                            <MovieNews />

                        </div>

                    </div>

                </div>
            )} <div className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row" style={{ width: '100%' }}>
                            <div className="row">
                                <div className="row">
                                    <div className="btn__all" style={{ display: 'flex', justifyshow: 'space-between' }}>
                                        <div className="div-title">
                                            <h4 data-aos="fade-right"
                                                data-aos-delay="900">Now Playing</h4>
                                            <div className='header-underline'></div>
                                        </div>
                                        <Link to='/movies' className="primary-btn ms-auto" style={{ textDecoration: 'none', color: '#1b9cff' }}>View All <span className="arrow_right" ><IconDoubleRight /></span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='boobo' style={{ width: '95%' }}>
                            {nowplaying.map((show) => {
                                // if (show.origin_country[0] === "US" ||"JP") {
                                // console.log(JSON.stringify(show.name));
                                const id = show.id
                                return (

                                    <div className="product__item mx-auto">
                                        <Link to={`/moviedetails?id=${id}`}>
                                            <Card className='contentcard product__item__pic set-bg'>
                                                <Card.Img className='cardimage' src={`https://image.tmdb.org/t/p/w400/${show.poster_path}`} alt="Card image" />
                                                <Card.ImgOverlay >
                                                    <FontAwesomeIcon icon={faCirclePlay} size="3x" className="mx-2 playbtn" />
                                                    <div className='imageoverlay'>
                                                        <Card.Title>{show.original_title}</Card.Title>
                                                        <Card.Text>{show.release_date}</Card.Text>
                                                    </div>
                                                    {/* <div className={show.rankUpDown.includes('+') ? ('comment bg-success') : ('comment bg-danger')}>{show.rankUpDown}</div> */}
                                                    <div className="view" style={{ height: 'fit-content' }}>{show.vote_average}</div>
                                                </Card.ImgOverlay>
                                            </Card></Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
            <News />
        </main>
    );
};

export default Movies;

