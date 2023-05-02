import axios from 'axios';

const imdbRating = async (query) =>
  axios.get(`https://imdb-api.com/API/AdvancedSearch/${process.env.REACT_APP_IMDB_API_KEY}?title=${query}`);

export default { imdbRating };