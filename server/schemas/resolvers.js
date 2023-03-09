const { Book, User } = require("../models");

const { signToken } = require("../utils/auth.js")

const resolvers = {
  Query: {
    me: async (parent, {_id}) => {
      console.log("id", _id);
      const user = User.find({_id: _id});
      return user;
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
    saveBook: async (parent, { userId, input }) => {
      console.log ("saveBook resolver data: ", userId, input);
      // const book = await Book.create(...input);

      const user = await User.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { savedBooks: input }},
        { new: true }
      );

      return user;
    },
    removeBook: async (parent, { userId, bookId }) => {
      return User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
