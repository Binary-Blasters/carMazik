import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import CarDetails from "./pages/CarDetails";
import { Toaster } from "./components/ui/Toaster";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./Layout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/car/:id" element={<CarDetails />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </Layout>
       
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;