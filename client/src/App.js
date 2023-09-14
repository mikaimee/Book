import './App.css';
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from './pages/Home/HomePage'
import Register from './pages/auth/Register';
import Login from './pages/auth/Login'
import Profile from './pages/users/Profile';
import EditUser from './pages/users/EditUser';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<HomePage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/user/profile" element={<Profile/>}/>
        <Route path="/user/edit" element={<EditUser/>}/>
      </Routes>
      <Toaster/>
    </div>
  );
}

export default App;
