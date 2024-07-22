const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send(JSON.stringify({ message: "Required Username and password." }));
  }

  if (isValid(username)) {
    return res.status(400).send(JSON.stringify({ message: "User exist." }));
  }

  users.push({username, password});
  return res.status(200).send(JSON.stringify({ message: "User has been created." }));
  
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book));
  } else {
    return res.status(404).send(JSON.stringify({ message: "Book notfound" }));
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor));
  } else {
    return res
      .status(404)
      .send(JSON.stringify({ message: "No books foud for this author" }));
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle));
  } else {
    return res
      .status(404)
      .send(JSON.stringify({ message: "No books foud for this title" }));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      return res.status(200).send(JSON.stringify(book.reviews));
    } else {
      return res
        .status(404)
        .send(JSON.stringify({ message: "No reviews found for this book" }));
    }
  } else {
    return res.status(404).send(JSON.stringify({ message: "Book not found" }));
  }
});

module.exports.general = public_users;
