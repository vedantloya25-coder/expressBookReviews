const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Task 6 (Tasks 1-6): Standard synchronous routes (for cURL testing)
// ─────────────────────────────────────────────────────────────────────────────

// Register a new user
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

// Get the full book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor[isbn] = books[isbn];
    }
  }

  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: `No books found by author: ${author}` });
  }
});

// Get all books based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle[isbn] = books[isbn];
    }
  }

  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: `No books found with title: ${title}` });
  }
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 11: Async/Await with Axios – additional endpoints using promises
// ─────────────────────────────────────────────────────────────────────────────

// Get all books using async/await with Axios (Task 11 - getAllBooks)
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching all books", error: error.message });
  }
});

// Get book by ISBN using async/await with Axios (Task 11 - getBookByISBN)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Get books by author using async/await with Axios (Task 11 - getBookByAuthor)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get books by title using async/await with Axios (Task 11 - getBookByTitle)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 11 (Promise callbacks alternative) – standalone functions for grading
// ─────────────────────────────────────────────────────────────────────────────

// Get all books using Promise callback
const getAllBooksPromise = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/')
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Get book by ISBN using Promise callback
const getBookByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Get books by Author using Promise callback
const getBookByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
};

// Get books by Title using Promise callback
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
