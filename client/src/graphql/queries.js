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

export const UPDATE_BOOK_QUERY = gql`
  mutation ($id: String!, $data: UpdateBookInput!){
    updateBook(id: $id, data: $data) {
      id
      title
      author
      isPublished
    }
  }
`;

export const GET_BOOKS_QUERY = gql`
  query getAllBooks {
    books {
      id
      title
      author
      isPublished
    }
  }
`;