
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import './App.css'
import Layout from './Layout'
import Home from './pages/Home'
import Featured from './pages/Featured'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='' element={<Layout/>}>
      <Route path='/' element={<Home/>}/>
      <Route path="/featured" element={<Featured />} />
       <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="register" element={<Register />} />

      </Route>
    )
  )
  

  return (
  <RouterProvider router={router}/>
  )
}

export default App
