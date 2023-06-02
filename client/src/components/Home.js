import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_BOOK_QUERY, UPDATE_BOOK_QUERY, GET_BOOKS_QUERY } from "../graphql/queries";
import { TextField, Paper, InputBase, Divider, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

export default function Home() {
  const [bookSearched, setBookSearched] = useState("");
  const [foundBooks, setFoundBooks] = useState([]);
  const [updateFormData, setUpdateFormData] = useState({});
  // get all Books data via useQuery in a similar flow to componentDidMount
  const {data: getBooksData, error: getBooksError} = useQuery(GET_BOOKS_QUERY);

  const [getBook, { data: getBookData, error: getBookError }] = useLazyQuery(GET_BOOK_QUERY, {
    variables: { id: bookSearched || "0" },
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'network-only',
  });

  const [updateBook, { data: updateBookData, error: updateBookError }] = useMutation(UPDATE_BOOK_QUERY, {
    variables: { id: bookSearched, data: { ...updateFormData }},
  });

  if (getBooksData) {
    console.log('getBooksData: ', getBooksData);
  }
  if (getBookData) {
    console.log('getBook getBookData:', getBookData);
    console.log('foundBooks: ', foundBooks);
    console.log('updateFormData:', updateFormData);
  }
  if (updateBookData) {
    console.log('updateBookData:', updateBookData);
  }

  useEffect(() => {
    if(getBooksData && getBooksData.books) {
      setFoundBooks(getBooksData.books);
    } else {
      setFoundBooks([]);
    };
  }, [getBooksData]);

  useEffect(() => {
    if(getBookData && getBookData.book) {
      setFoundBooks([getBookData.book]);

      let validUpdateFormData = Object.assign({}, getBookData.book);
      // InputType UpdateBookInput does not support Field 'id' and '__typename'
      // Hence remove them to create valid format of the form data
      delete validUpdateFormData.id;
      delete validUpdateFormData.__typename;
      setUpdateFormData(validUpdateFormData);
    } else {
      setFoundBooks([]);
      setUpdateFormData({});
    };

  }, [getBookData]);

  const handleBookSearch = (event) => {
    event.preventDefault();

    if (bookSearched.trim()) {
      getBook(); // i.e. getBook() -> getBookData updated -> useEffect() called -> setFoundBooks and setUpdateFormData called
    }
  }

  const handleBookUpdate = (event) => {
    event.preventDefault();
    if (updateFormData.title.trim() && updateFormData.author.trim()) {
      updateBook();
    }
  }

  const handleInputChange = (event) => {
    setUpdateFormData((prevUpdateFormData) => {
        return {
            ...prevUpdateFormData,
            [event.target.name]: event.target.value,
        }
    });
  }

  if (getBooksError) return <div> Error loading books: {JSON.stringify(getBooksError)} </div>;
  if (getBookError) return <div> Error loading the book: {JSON.stringify(getBookError)} </div>;
  if (updateBookError) return <div> Error updating the book: {JSON.stringify(updateBookError)} </div>;

  return (
    <div className="home">
      <div className="searchBookForm">
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}

          onSubmit={handleBookSearch}
        >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Book by ID"
              inputProps={{ 'aria-label': 'search book by id' }}

              value={bookSearched}
              onChange={(event) => {
                setBookSearched(event.target.value);
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" type="submit">
                <SearchIcon />
            </IconButton>
        </Paper>
      </div>
      <div className="displayBookArea">
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell align="right">ID</TableCell>
                    <TableCell align="right">Author</TableCell>
                    <TableCell align="right">isPublished</TableCell>
                    <TableCell align="right">__typename</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {foundBooks.map((book) => (
                    <TableRow
                      key={book.id + book.title}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {book.title}
                    </TableCell>
                    <TableCell align="right">{book.id}</TableCell>
                    <TableCell align="right">{book.author}</TableCell>
                    <TableCell align="right">{book.isPublished.toString()}</TableCell>
                    <TableCell align="right">{book.__typename}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      </div>
      {getBookData && getBookData.book && 
        <div className="bookUpdateForm">
            <form onSubmit={handleBookUpdate}>
                <TextField 
                  id="standard-basic" 
                  label="Update Title"
                  variant="standard" 

                  name="title"
                  value={updateFormData.title}
                  onChange={handleInputChange}
                />
                <Divider />
                <TextField 
                  id="standard-basic" 
                  label="Update Author"
                  variant="standard" 

                  name="author"
                  value={updateFormData.author}
                  onChange={handleInputChange}
                />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" type="submit">
                    <CreateIcon />
                </IconButton>
            </form>
        </div>
      }
    </div>
  );
}