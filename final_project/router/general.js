const express = require("express");
const axios = require('axios');
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
async function getBooks(){
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  })
}

public_users.get("/", async function (req, res) {

  try {
    const booksData = await getBooks();
    res.status(200).send(JSON.stringify(booksData));
  } catch (error) {
    res.status(500).send({ message: "Error fetching book list", error: error.message });
  }
});

// Get book details based on ISBN

async function getBooksByISBN(isbn){
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books[isbn]);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  })
}

public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  

  try {
    const book = await getBooksByISBN(isbn);
    res.status(200).send(JSON.stringify(book));
  } catch (error) {
    return res.status(404).send(JSON.stringify({ message: "Book notfound" }));
  }
});

// Get book details based on author

async function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = [];
      for (const isbn in books) {
        if (books[isbn].author === author) {
          booksByAuthor.push(books[isbn]);
        }
      }
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found for this author"));
      }
    }, 1000);
  });
}

public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;

  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(booksByAuthor));
  } catch (error) {
    return res.status(404).send(JSON.stringify({ message: error.message }));
  }
});

// Get all books based on title

async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = [];
      for (const isbn in books) {
        if (books[isbn].title === title) {
          booksByTitle.push(books[isbn]);
        }
      }
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found for this title"));
      }
    }, 1000);
  });
}

public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try {
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).send(JSON.stringify(booksByTitle));
  } catch (error) {
    return res.status(404).send(JSON.stringify({ message: error.message }));
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
