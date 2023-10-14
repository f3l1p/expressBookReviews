const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

class Review {
  constructor(username, review) {
    this.username = username;
    this.review = review;
  }
}

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let reqIsbn = req.params.isbn;
  let reqReview = req.query.review;
  let username = req.session.authorization["username"];

  let selectedBook = books[reqIsbn];
  let bookReviews = selectedBook.reviews;

  if (bookReviews.length > 0 && bookReviews[username]) {
    bookReviews.reviews[username] = reqReview;
    return res
      .status(300)
      .send("the review for" + username + " " + "was update to: " + reqReview);
  }

  if (username && reqReview != "" && reqReview) {
    bookReviews[username] = reqReview;
    return res
      .status(300)
      .send(
        "a new review was created for the user" +
          username +
          " " +
          "with this review: " +
          reqReview
      );
  }

  return res.status(404).json({ message: "unable to create a review" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
