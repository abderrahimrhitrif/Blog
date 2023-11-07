import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Route, Routes} from "react-router-dom"


import './App.css';
import First from './First';
import Section from './Section';
import Layout from './Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Edit from './pages/Edit';
import Contact from './pages/Contact';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserContextProvider>
    <Routes>
        <Route path='/' element = {<Layout />}>
        <Route
          index
          element={
              <><First /><Section /></>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
              
          }
        />
        <Route
          path="/create-post"
          element={
            <>
              <CreatePost />
            </>
              
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
            </>
              
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Register />
            </>
              
          }
          
        />
        <Route
          path="/post/:id"
          element={
            <>
              <Post />
            </>
              
          }
        />
        <Route
          path="/edit/:id"
          element={
            <>
              <Edit />
            </>
              
          }
        />
        </Route>
        
        
        
      </Routes>
      </UserContextProvider> 
    </>
  )
}

export default App
