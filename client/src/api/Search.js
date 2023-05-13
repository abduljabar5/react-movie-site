import axios from 'axios';


const search = async (query,prompt) =>
  axios.get(`https://api.themoviedb.org/3/search/${prompt}?api_key=b508e614477c137da7c8dc95579b02ac&language=en-US&query=${query}&page=1&include_adult=false`);
 console.log("running");
export default { search};
