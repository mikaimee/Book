# 📚 My Books Application

Welcome to "My Books" application!  This MERN (MongoDB, Express.js, React, Node.js) application is designed to help readers keep track of the books they have read.


## Features
- 🔒 **User Authentication**: Users can create accounts, log in, and secure their personal reading lists.
  
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

- 💾 **MongoDB**: Store and manage your book data in a NoSQL database.

- 🛠️ **Express.js**: Create the back-end server and API endpoints for your application.

- ⚛️ **React**: Build a dynamic and responsive front-end for a smooth user experience.

- 📡 **Node.js**: Power the server-side logic and handle requests from the front-end.

- 🔐 **User Authentication**: Implement user authentication and authorization using JWT (JSON Web Tokens).

- 📊 **Data Visualization**: Utilize Recharts and other libraries to create interactive graphs and charts.


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
