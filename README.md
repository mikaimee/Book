# 📚 My Books Application

Welcome to "My Books" application!  This MERN (MongoDB, Express.js, React, Node.js) application is designed to help readers keep track of the books they have read.


## Features
- 🔒 **User Authentication**: Create accounts, log in, and secure their personal reading lists.
  
- 📖 **Book Tracking**: Add, edit, and remove books from your reading list. Track details like book title, author, genre, and rating.

- 📚 **Book Status**: Organize your library by categorizing books as "Yet to Start," "Complete," or "In Progress."

- 📈 **Reading Insights**: Gain insights into your reading habits with graphical representations:
  - 📅 **Monthly Reading Graph**: Visualize the number of books you've read each month.
  - 📊 **Genre Preference Pie Chart**: See your preference for different book genres

- **Home Page Sections**:
  - 📚 **Latest Books**: Discover the most recent additions to the library.
  - 🔥 **Popular Books**: Explore books that are trending among other users.
  - 📖 **Genre Filters**: Quickly access books based on specific genres.

- 🌟 **Rating and Review**: Read and leave reviews and ratings for the books you've read. See what other readers have to say about each book.


## Currently Working On

- 📦 **Search and Discovery Feature**: I am currently working on enhancing the search bar and discovery feature to make it even easier for you to find new books to read.
  

## Charting Library

I used [Recharts](https://recharts.org/en-US/) for creating interactive charts and graphs within our application. Recharts is a powerful library for visualizing data in React applications.


## Technologies Used

- 💾 **MongoDB**: MongoDB was chosen for its flexibility and document-oriented structure that efficiently manages complex many-to-many relationships.  This ensures seamless data handling for this dynamic and versatile book-tracking platform.

- 🛠️ **Express.js**: Express.js is used to create the back-end server and API endpoints that manage the CRUD operations for books, user accounts, reviews, and ratings.  It allows users to add. edit, and remove books from their personalized libraries and interact with other users' reviews and ratings.

- ⚛️ **React**: React.js was employed to provide a dynamic and responsive user interface that ensures a smooth user experience.  They can easily add books to their library, track their reading progress, read and leave reviews, and see what other readers say about the book.

- 📡 **Node.js**: Node.js powers the server side of the book tracking application and handles data processing and communication between the front end and the back end.  It is responsible for managing user authentication, data validation, and real-time interactions.

- 🔐 **User Authentication**: User authentication and authorization are implemented using JWT (JSON Web Tokens) to secure user data.  This is crucial for protecting personal reading lists, reviews, and ratings.  It also ensures that only authorized users can access and modify their reading data, enhancing user privacy and data security.

- 📊 **Data Visualization**: Recharts was chosen for its superior flexibility, robust features, and compatibility with React, enabling visualizations that provide users with insights into their reading habits.


## Getting Started

To get started with this application, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/my-books-app.git
   
2. Navigate to the project directory:
   
   cd books
   
4. Install the dependencies for both the server and the client:
   
   cd server && npm install
   cd ../client && npm install
   
5. set up your MongoDB database.  Update the database configuration in `server/config/config.jd`.
   
6. Start the server:
   
   cd ../server && nodemon server.js
   
7. Start the client:
    
    cd ../server && nodemon server.js
  
8. Open your web browser and go to `http://localhost:3000`
