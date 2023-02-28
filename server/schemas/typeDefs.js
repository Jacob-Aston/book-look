const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User: {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    input bookInput: {
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type book: {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type auth: {
        token: String
        user: [User]
    }

    type Query {
        me: [User]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: bookInput): User ///
        removeBook(bookId: String!): User
    }
`;