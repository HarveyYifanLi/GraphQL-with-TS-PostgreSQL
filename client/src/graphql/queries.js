import { gql } from "@apollo/client";

export const GET_BOOK_QUERY = gql`
  query ($id: String!) {
    book(id: $id) {
      id
      title
      author
      isPublished
    }
  }
`;