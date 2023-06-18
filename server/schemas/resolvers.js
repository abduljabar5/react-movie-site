const { AuthenticationError } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { User, Thought, Show, Movie, Anime } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  JSON: GraphQLJSON, 
  Query: {
    users: async () => {
      return User.find().populate('thoughts').populate('shows');
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username }).populate('thoughts').populate('shows');
      return user;
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { thoughtId }) => {
      return Thought.findOne({ _id: thoughtId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('shows').populate('movies').populate('thoughts').populate('animes'); 
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addShow: async (parent, { show }, context) => {

      if (context.user) {
        const newShow = await Show.create(show);
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { shows: newShow } },
          { new: true }
        ).populate('shows');
    
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    
    addMovie: async (parent, { movie }, context) => {
    
      if (context.user) {
        let movieExists = await Movie.findOne(movie); 
    
        
        if (!movieExists) {
          movieExists = await Movie.create(movie);
        }
    
       
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { movies: movieExists._id } },
          { new: true }
        ).populate('movies');
      }
      
      throw new AuthenticationError('You need to be logged in!');
    },
    addThought: async (parent, { thoughtText }, context) => {
      if (context.user) {
        const thought = await Thought.create({
          thoughtText,
          thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (parent, { thoughtId, commentText }, context) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeThought: async (parent, { thoughtId }, context) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: thoughtId,
          thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeComment: async (parent, { thoughtId, commentId }, context) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    }, 
    removeShow: async (parent, { showId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { shows: showId }
          },
          { new: true }
        ).populate('shows'); 
      }
      throw new AuthenticationError('You need to be logged in!');
    }, 
    removeMovie: async (parent, { movieId }, context) => {
      if (context.user) {
       
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { movies: movieId } },
          { new: true }
        ).populate('movies');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addAnime: async (parent, { anime }, context) => {
    
      if (context.user) {
        let animeExists = await Anime.findOne({ animeId: anime.animeId }); 
    
        
        if (!animeExists) {
          animeExists = await Anime.create(anime);
        }
    
       
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { animes: animeExists._id } },
          { new: true }
        ).populate('animes');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeAnime: async (parent, { animeId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { animes: animeId }
          },
          { new: true }
        ).populate('animes');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
