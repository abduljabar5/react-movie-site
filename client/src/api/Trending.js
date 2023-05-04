import axios from 'axios';

const search = async (query) =>
  axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=b508e614477c137da7c8dc95579b02ac`);
  const trendingMovies = async (query) =>
  axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=b508e614477c137da7c8dc95579b02ac`);
  const inTheaters = async (query) =>
  axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1&region=us`);

export default { search, trendingMovies, inTheaters };
