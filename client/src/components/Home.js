import React, { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_BOOK_QUERY, UPDATE_BOOK_QUERY } from "../graphql/queries";

function Home() {
  const [bookSearched, setBookSearched] = useState("");
  const [titleEntered, setTitleEntered] = useState("");

  const [getBook, { data, error }] = useLazyQuery(GET_BOOK_QUERY, {
    variables: { id: bookSearched },
    nextFetchPolicy: 'network-only',
  });

  const [updateBook, { data: updateBookData, error: updateBookError }] = useMutation(UPDATE_BOOK_QUERY, {
    variables: { id: bookSearched, data: { "title": titleEntered }},
  });

  if (error) return <div> Error: {JSON.stringify(error)} </div>;
  if (data) {
    console.log('data:', data);
  }
  if (updateBookData) {
    console.log('updateBookData:', updateBookData);
  }

  const elementForData = data && data.book && Object.keys(data.book).map(dataKey => {
    const value = data.book[dataKey];
    return <li key={dataKey}>{dataKey}: {value}</li>
  });

  const handleBookSearch = (event) => {
    event.preventDefault();
    getBook();
  }

  const handleBookUpdate = (event) => {
    event.preventDefault();
    updateBook();
    setTitleEntered("");
  }

  return (
    <div className="home">
      <div>
        <div className="SearchBookForm">
          <h1>Search For Book</h1>
          <form onSubmit={handleBookSearch}>
            <input
                type="text"
                placeholder="Enter a book by id ..."
                onChange={(event) => {
                  if (event.target.value.trim()) setBookSearched(event.target.value);
                }}
            />
            <button>Search</button>
          </form>
        </div>
        <div className="book">
            { data && data.book ?  
              (<div>
                 <hr/>
                 <ul>{elementForData}</ul>
                 <div>
                    <form onSubmit={handleBookUpdate}>
                        <input 
                          type="text"
                          value={titleEntered}
                          onChange = {(event) => {
                              setTitleEntered(event.target.value);
                          }}
                          placeholder="Enter updated Title"
                        />
                        <button>Update Book</button>
                    </form>
                 </div>
              </div>) : 
              (<div><hr/> No Book found! Enter a valid Book ID to search. </div>) }
        </div>
      </div>
    </div>
  );
}

export default Home;