import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_SHOW = gql`
mutation ($userId: ID!, $show: ShowInput!) {
  addShow(userId: $userId, show: $show) {
    _id
    username
    shows {
      _id
      themoviedb  
    }    
  }
}

`;

export const ADD_MOVIE = gql`
mutation ($userId: ID!, $movie: MovieInput!) {
  addMovie(userId: $userId, movie: $movie) {
    _id
    username
    movies {
      _id
      tmdbId
      imdbId  
    }    
  }
}
`;

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($thoughtId: ID!, $commentText: String!) {
    addComment(thoughtId: $thoughtId, commentText: $commentText) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;
export const REMOVE_SHOW = gql`
  mutation removeShow($showId: ID!) {
    removeShow(showId: $showId) {
      _id
      username
      email
      shows {
        _id
      themoviedb
      }
    }
  }
`;

export const REMOVE_MOVIE = gql`
  mutation removeMovie($movieId: ID!) {
    removeMovie(movieId: $movieId) {
      _id
      username
      email
      movies {
        _id
        tmdbId
        imdbId
      }
    }
  }
`;




