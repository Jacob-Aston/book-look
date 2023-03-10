import { gql } from "@apollo/client";

export const GET_ME = gql`
query Query($id: ID) {
    me(_id: $id) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`