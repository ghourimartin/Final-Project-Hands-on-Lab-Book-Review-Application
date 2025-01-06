const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();






// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}






public_users.post("/register", (req,res) => {

  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if(book){
    res.send(book.author);
  } else {
    return res.status(300).json({message: `No book of isbn ${isbn} found`})
  }
  //return res.status(300).json({message: "Yet to be implemented"});
  });



// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author

  // Filter books by author
  const booksByAuthor = Object.values(books).filter(book => book.author === author)
 // Check if any books were found
  if (booksByAuthor.length > 0) {
  res.send(booksByAuthor); // Send the list of books as the response
  } 
  else {
  return res.status(300).json({ message: `No book by author ${author} found` });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  //Write your code here
  const title = req.params.title

  // Filter books by author
  const booksByTitle = Object.values(books).filter(book => book.title === title)
 // Check if any books were found
  if (booksByTitle.length > 0) {
    res.send(booksByTitle); // Send the list of books as the response
  } 
  else {
    return res.status(300).json({ message: `No book by Title ${title} found` });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if(book){
    res.send(book.reviews);
  } else {
    return res.status(300).json({message: `No book of isbn ${isbn} found`})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
