const { AuthenticationError } = require("apollo-server-express");
const { Book, User } = require("../models");
const { signToken } = require("../utils/auth.js")

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if(!context.user) {
        throw new AuthenticationError("You need to be logged in!")
      }
      console.log("user", context.user)
      return User.findOne({ _id: context.user._id });
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, return an Authentication error stating so
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);

      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({username, email, password});
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      // console.log ("--> saveBook resolver data: ", userId, input);
      
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!")
      }

      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: input }},
        { new: true }
      );
      
      console.log("user", user)

      return user;
    },
    removeBook: async (parent, { bookId }, context) => {
      if(!context.user) {
        throw new AuthenticationError("You need to be logged in!")
      }

      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
