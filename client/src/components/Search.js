import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import API from '../api/Search'
import API2 from '../api/AnimeDetails'


const Search = () => {
    const [searching, setSearching] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMovie, setIsMovie] = useState('movie');
    const [isAnime, setIsAnime] = useState(false);
    const [views, setView] = useState([]);
    const [animeviews, setAnimeView] = useState([]);
    console.log(isAnime);
    const location = useLocation();
    const [showModal, setShowModal] = useState(true);

    const initialPage = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== initialPage.current) {
            setShowModal(false);
        }
    }, [location]);
    const search = () => {
        setIsLoading(true);
        API.search(searching, isMovie)
            .then((res) => {
                setView(res.data.results);
                setIsLoading(false);
            })
            .catch((err) => {
                // handle errors
                setIsLoading(false);
            });
    };

    const getAnime = async () => {
        try {
            setIsLoading(true);
            console.log('trying to run news');
            const res = await API2.AnimeDetails(searching);
            setAnimeView(res.data.data);
            setIsLoading(false);
        } catch (err) {
            // handle errors
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if(isAnime){
                setIsLoading(true);
                getAnime();
            }else{
                search();
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [isMovie, searching, isAnime]);

    useEffect(() => {
        console.log(views);
        console.log(animeviews);
    }, [views, animeviews]);


    return (
        <div>
          {/* Add a loading indicator */}
        
            <div>
  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    Launch static backdrop modal
  </button>

<div className='model fade' id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-xl modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="staticBackdropLabel">
            <input className='form-input mx-auto' id='search' onChange={(e) => setSearching(e.target.value)}></input>
          </h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        {isLoading ? (
            <div>Loading...</div>
          ) : (
        <div className="modal-body serach-container">
          {isAnime && !isLoading? (
             animeviews.map((view) => {
                const id = view.id;
                const name = view.attributes.canonicalTitle;
                return (
                  <div class="card search-cards" key={id}>
                    <img src={view.attributes.posterImage.original} class="card-img-top" alt="..."></img>
                    <div class="card-body">
                      <h5 class="card-title">{view.original_title}</h5>
                      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    
                      <Link to={`/anime?name=${name}`}  onClick={() => {
      setShowModal(false);
   }} >Go somewhere</Link>
                  
                      
                  
                    </div>
                  </div>
                )
              })
          ) : (
            views.map((view) => {
              const id = view.id;
              return (
                <div class="card search-cards" key={id}>
                  <img src={`https://image.tmdb.org/t/p/original/${view.poster_path}`} class="card-img-top" alt="..."></img>
                  <div class="card-body">
                    <h5 class="card-title">{view.original_title}</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    {isMovie === 'movie' ? (
                      <Link to={`/moviedetails?id=${id}`} class="btn btn-primary">Go somewhere</Link>
                    ) : isMovie === 'tv' ? (
                      <Link to={`/details?id=${id}`} class="btn btn-primary">Go somewhere</Link>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </div>)}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary" onClick={() => setIsMovie(isMovie === 'movie' ? 'tv' : 'movie')}>Toggle Movie/TV</button>
          <button type="button" className="btn btn-primary" onClick={() => setIsAnime(isAnime === false ? true : false)}>search Anime</button>
        </div>
      </div>
    </div>
    </div>
  </div> 
</div>

    )
}

export default Search