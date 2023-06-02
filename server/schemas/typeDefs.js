const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');

const typeDefs = gql`
scalar JSON
  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
    shows: [Show]
    movies: [Movie]
    animes: [Anime]    
  }

  type Show {
    _id: ID
    themoviedb: JSON
  }

  type Movie {
    _id: ID
    tmdbId: String
    imdbId: String
  }

  
  type Anime {
    _id: ID
    animeId: String
    animeName: String
  }

  input ShowInput {
    _id: ID
    themoviedb: JSON
  }

  input MovieInput {
    _id: ID
    tmdbId: String
    imdbId: String
  }

  input AnimeInput {
    _id: ID
    animeId: String
    animeName: String
  }

  type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    me: User
    movies: [Movie]
    movie(tmdbId: String!): Movie
    animes: [Anime]      
    anime(animeId: String!): Anime   
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addShow(userId: ID!, show: ShowInput!): User
    addMovie(userId: ID!, movie: MovieInput!): User
    addAnime(userId: ID!, anime: AnimeInput!): User  
    addThought(thoughtText: String!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
    removeShow(showId: ID!): User
    removeMovie(movieId: ID!): User
    removeAnime(animeId: ID!): User   
  }
`;

module.exports = typeDefs;
