# react-movie-site

## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Credits](#Credits)
- [License](#License)

## Discription
PopcornPeek is a dynamic web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that caters to the entertainment needs of users by allowing them to explore trending movies, TV shows, and anime. PopcornPeek is more than just a listing of entertainment content. It offers a deeper dive into each show, movie, or anime. Users can view trailers, read comprehensive descriptions, explore similar content, and access useful information such as age ratings, IMDb ratings, status, and more.

One of the major challenges i faced during the development of this project was handling API usage limitations. As movie information changes frequently, it was essential to provide users with the most recent data while dealing with the API's constraints. One solution was to leverage the power of IndexedDB, a low-level API for client-side storage of significant amounts of structured data. I've implemented a system to save the received data from the API to IndexedDB. This data is refreshed once a day, ensuring the website provides users with current information without exceeding the API's call limit. This strategy not only maintains data freshness but also improves the application's performance, as i can serve a lot of the data directly from the local IndexedDB storage, resulting in quicker load times and a smoother user experience.

## Installation

https://obscure-anchorage-29420.herokuapp.com/

## Usage
PopcornPeek is designed to be user-friendly and engaging. Here are quick steps on how to interact with the application:

1. Registration: To register an account, provide a unique username, email, and password on the sign-up page.

2. Saving Content: When you find a movie, show, or anime that piques your interest, click on it for detailed information. You'll find a 'Save' button on this page, which you can use to save the content to your profile for future reference.

3. Personalized Recommendations: Once you're logged in, personalized recommendations will appear on your homepage, curated based on the content you've saved.

4. Search: You can use the search bar located in the navbar at the top of the page to search for your desired content by title.

5. Chatbot Assistance: When logged in, you'll find a chatbot button at the bottom right of the page. Click on it and ask away! Be specific in your questions, as the chatbot doesn't remember previous conversations.

6. Additional Information: Detailed information about each movie, show, or anime including age ratings, IMDb ratings, etc., can be accessed by clicking on the content that you're interested in.

<img width="1440" alt="Screenshot 2023-06-12 at 12 13 42 PM" src="https://github.com/abduljabar5/react-movie-site/assets/115905200/64c1a87f-eeb0-474f-852e-03dadfb57aa5">
<img width="1440" alt="Screenshot 2023-06-12 at 12 35 58 PM" src="https://github.com/abduljabar5/react-movie-site/assets/115905200/6ed53165-0599-4f15-aeaa-fe09b444dbd8">
<img width="1440" alt="Screenshot 2023-06-12 at 12 38 27 PM" src="https://github.com/abduljabar5/react-movie-site/assets/115905200/59ee3ad3-e68e-40a1-8c4f-e311b7d10d53">



## Credits
google, stackoverflow, bing, https://www.freepik.com/free-photo/3d-cartoon-lumberjack-character_38990025.htm#query=spying%203d&position=20&from_view=search&track=ais , https://webartdevelopers.com/blog/

## License

![Alt text](https://img.shields.io/github/license/abduljabar5/react-movie-site)

Copyright (c) 2022 abduljabar5

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Footer
© 2022 GitHub, Inc.
Footer navigation

Github: https://github.com/abduljabar5

Email: abduljabar.jobs@gmail.com
