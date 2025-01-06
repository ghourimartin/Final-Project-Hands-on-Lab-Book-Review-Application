const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axioss = express.Router();
const axios = require('axios');






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


// <------------------------------------------------------------------------->
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list using Promise callbacks
public_users.get('/books-promise', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((booksList) => {
      res.status(200).json(booksList);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching books', error: err });
    });
});

// Get the book list using async/await with Axios
public_users.get('/books-async', async (req, res) => {
  try {
    // Simulate an API call
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err });
  }
});


// <------------------------------------------------------------------------->
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


// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', (req, res) => {

  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject(`No book of ISBN ${isbn} found`);
    })
    .then((booksList) => {
      res.status(200).json(booksList);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching books', error: err });
    });
});

})


// Get book details based on ISBN using async/await with Axios
public_users.get('/isbn-async/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try 
  {
    // Simulate an external API call to fetch book details based on ISBN
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Replace with actual API endpoint if needed
    res.status(200).json(response.data); // Send the book details
  } 
  catch (err) 
  {
    res.status(404).json({ message: `No book of ISBN ${isbn} found`, error: err.message });
  }
});




// <------------------------------------------------------------------------->
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


// Get book details based on author using Promise callbacks
public_users.get('/author-promise/:author', (req, res) => {

    const author = req.params.author;
    new Promise((resolve, reject) => {
      // Filter books by author
      const booksByAuthor = Object.values(books).filter(book => book.author === author)
      if (booksByAuthor) resolve(booksByAuthor);
      else reject(`No book of author ${author} found`);
    })
    .then((booksList) => {
      res.status(200).json(booksList);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching books', error: err });
    });
})

// Get book details based on author using async/await with Axios
public_users.get('/author-async/:author', async (req, res) => {
  const author = req.params.author;
  try 
  {
    // Simulate an external API call to fetch book details based on ISBN
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Replace with actual API endpoint if needed
    res.status(200).json(response.data); // Send the book details
  } 
  catch (err) 
  {
    res.status(404).json({ message: `No book of author ${author} found`, error: err.message });
  }
});



// <------------------------------------------------------------------------->
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


// Get book details based on title using Promise callbacks
public_users.get('/title-promise/:title', (req, res) => {

  const title = req.params.title;
  new Promise((resolve, reject) => {
    // Filter books by author
    const booksBytitle = Object.values(books).filter(book => book.title === title)
    if (booksBytitle) resolve(booksBytitle);
    else reject(`No book of author ${title} found`);
  })
  .then((booksList) => {
    res.status(200).json(booksList);
  })
  .catch((err) => {
    res.status(500).json({ message: 'Error fetching books', error: err });
  });
})

// Get book details based on author using async/await with Axios
public_users.get('/title-async/:title', async (req, res) => {
const title = req.params.title;
try 
{
  // Simulate an external API call to fetch book details based on ISBN
  const response = await axios.get(`http://localhost:5000/title/${title}`); // Replace with actual API endpoint if needed
  res.status(200).json(response.data); // Send the book details
} 
catch (err) 
{
  res.status(404).json({ message: `No book of title ${title} found`, error: err.message });
}
});



// <------------------------------------------------------------------------->
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
