const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Task 6: Register a new user
// ─────────────────────────────────────────────────────────────────────────────
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: `User ${username} successfully registered. Now you can login.` });
  } else {
    return res.status(404).json({ message: "User already exists! Please login with different username." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 1 & Task 10: Get the book list available in the shop
// Implemented using Promise and async/await (Task 10 requirement)
// ─────────────────────────────────────────────────────────────────────────────
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ status: 404, message: "Books not found" });
    }
  });

  getBooks
    .then((bookList) => res.status(200).json(bookList))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 2 & Task 11: Get book details based on ISBN
// Implemented using Promise and async/await (Task 11 requirement)
// ─────────────────────────────────────────────────────────────────────────────
public_users.get('/isbn/:isbn', function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 3 & Task 12: Get book details based on Author
// Implemented using Promise and async/await (Task 12 requirement)
// ─────────────────────────────────────────────────────────────────────────────
public_users.get('/author/:author', function (req, res) {
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = {};

    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor[isbn] = books[isbn];
      }
    }

    if (Object.keys(booksByAuthor).length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ status: 404, message: `No books found by author: ${author}` });
    }
  });

  getBooksByAuthor
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 4 & Task 13: Get all books based on Title
// Implemented using Promise and async/await (Task 13 requirement)
// ─────────────────────────────────────────────────────────────────────────────
public_users.get('/title/:title', function (req, res) {
  const getBooksByTitle = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksByTitle = {};

    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle[isbn] = books[isbn];
      }
    }

    if (Object.keys(booksByTitle).length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ status: 404, message: `No books found with title: ${title}` });
    }
  });

  getBooksByTitle
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 5: Get book review by ISBN
// ─────────────────────────────────────────────────────────────────────────────
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// =============================================================================
// Task 10, 11, 12, 13: Async/Await with Axios endpoints
// =============================================================================

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching all books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get all books based on Title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// =============================================================================
// Task 10, 11, 12, 13: Standalone Promise Callback Helper Functions
// =============================================================================

// Task 10: Get all books using Promise callback
const getAllBooksPromise = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/')
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Task 11: Get book details by ISBN using Promise callback
const getBookByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Task 12: Get books by Author using Promise callback
const getBookByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Task 13: Get books by Title using Promise callback
const getBookByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

module.exports.general = public_users;
module.exports.getAllBooksPromise = getAllBooksPromise;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBookByAuthorPromise = getBookByAuthorPromise;
module.exports.getBookByTitlePromise = getBookByTitlePromise;
