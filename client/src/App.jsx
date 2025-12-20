import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import CarDetails from "./pages/CarDetails";
import { Toaster } from "./components/ui/Toaster";
import Layout from "./Layout";
import { Provider } from "react-redux";
import store from "./app/store";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";
import PendingCars from "./pages/admin/PendingCars";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingSellers from "./pages/admin/PendingSellers";
import Users from "./pages/admin/Users";
import BlockedUsers from "./pages/admin/BlockedUsers";
import Wishlist from "./pages/Wishlist";


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={
                <Listings />
                } />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />


              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="cars/pending" element={<PendingCars />} />
                <Route path="sellers/pending" element={<PendingSellers />} />
                <Route path="users" element={<Users />} />
                <Route path="users/blocked" element={<BlockedUsers />} />
              </Route>
            </Routes>
          </Layout>

          <Toaster />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
