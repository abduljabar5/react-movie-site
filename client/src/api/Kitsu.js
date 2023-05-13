import axios from 'axios';


const TrendingAnime = async (query) =>
  axios.get(`https://kitsu.io/api/edge/trending/anime`);
 console.log("running");
export default { TrendingAnime};