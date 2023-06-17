import axios from 'axios';


const AnimeDetails = async (query) =>
  axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${query}`);
export default { AnimeDetails};