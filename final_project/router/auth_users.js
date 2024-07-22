const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).send(JSON.stringify({message: 'Required username or password'}))
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'accessSecret', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).send(JSON.stringify({ message: "Login successful", accessToken }));
  } else {
    return res.status(401).send(JSON.stringify({ message: "Invalid username or password" }));
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).send(JSON.stringify({ message: "User not authenticated" }));
  }

  if (!review || typeof review !== 'string') {
    return res.status(400).send(JSON.stringify({ message: "Review is required" }));
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send(JSON.stringify({ message: "Review added successfully" }));
  } else {
    return res.status(404).send(JSON.stringify({ message: "Book not found" }));
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
