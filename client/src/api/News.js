import axios from 'axios';

const news = async () => {
  return axios.get(`https://gnews.io/api/v4/search?q=movies&shows&token=507a059a3a6f889a40b66583d4023bf7&lang=en`)
    
};

export default { news };
