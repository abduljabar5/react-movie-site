import axios from 'axios';
import openai from 'openai';
const searchTv = async (query) =>
  axios.get(`https://api.themoviedb.org/3/tv/${query}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  const tvVideos = async (query) =>
  axios.get(`https://api.themoviedb.org/3/tv/${query}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  const searchMovies = async (query) =>
  axios.get(`https://api.themoviedb.org/3/movie/${query}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  const movieVideos = async (query) =>
  axios.get(`https://api.themoviedb.org/3/movie/${query}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  const generateText = async (prompt) => {
    const openaiClient = new openai.OpenAI(`${process.env.REACT_APP_AI_API_KEY}`);
    const response = await openaiClient.completions.create({
      engine: 'davinci-codex',
      prompt: prompt,
      maxTokens: 128,
    });
    return response.choices[0].text;
  };
console.log('ran');
export default { searchTv, tvVideos, searchMovies, movieVideos, generateText };
