import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_BOOK_QUERY } from "../graphql/queries";

function Home() {
  const [bookSearched, setBookSearched] = useState("");
  const [getBook, { data, error }] = useLazyQuery(GET_BOOK_QUERY, {
    variables: { id: bookSearched },
  });

  if (error) return <div> Error: {JSON.stringify(error)} </div>;

  if (data) {
    console.log('data:', data);
  }

  const elementForData = data && data.book && Object.keys(data.book).map(dataKey => {
    const value = data.book[dataKey];
    return <li key={dataKey}>{dataKey}: {value}</li>
  });

  return (
    <div className="home">
      <h1>Search For Book</h1>
      <input
        type="text"
        placeholder="Enter the id of a book..."
        onChange={(event) => {
          if (!event.target.value) setBookSearched("0");
          else setBookSearched(event.target.value);
        }}
      />
      <button onClick={() => getBook()}>Search</button>
      <div className="book">
        { data && data.book ?  (<div><hr/><ul>{elementForData}</ul></div>) : (<div><hr/> No Book found! Enter a valid Book ID to search. </div>) }
      </div>
    </div>
  );
}

export default Home;