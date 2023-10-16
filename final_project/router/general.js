const express = require("express")
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/books", (req, res) => {
  const jsonFilePath = "./booksdb.json";
  res.sendFile(jsonFilePath, { root: __dirname });
});

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    const jsonData = response.data;
    res.status(200).json(jsonData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the JSON file." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbNum = req.params.isbn;

  return res.status(300).json(books[isbNum]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;

  const filteredBooks = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });

  return res.status(300).json(filteredBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;

  const filteredBooks = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });

  return res.status(300).json(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbNum = req.params.isbn;

  let reviews = books[isbNum].reviews;

  return res.status(300).json(reviews);
});

module.exports.general = public_users;
