import axios from 'axios';


const news = async (query,prompt) =>
  axios.get(`https://newsapi.org/v2/everything?q="movie release" OR "show cancellation"&apiKey=bc19f01963a642a981baf7137e3b7dfb`);
 console.log("running news");
export default { news};