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
import ActiveSellers from "./pages/admin/ActiveSellers";
import BlockedSellers from "./pages/admin/BlockedSellers";
import AdminAllCars from "./pages/admin/AdminAllCars";
import AdminUpcomingCars from "./pages/admin/upcomingCars/AdminUpcomingCars";
import NotFound from "./NotFound";
import FAQ from "./pages/FAQ";
import Comparisons from "./pages/Comparisons";


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
                <Route path="cars" element={<AdminAllCars />} />
                <Route path="cars/upcoming" element={<AdminUpcomingCars />} />
                <Route path="cars/pending" element={<PendingCars />} />
                <Route path="users" element={<Users />} />
                <Route path="users/blocked" element={<BlockedUsers />} />
                <Route path="sellers" element={<ActiveSellers />} />
                <Route path="sellers/pending" element={<PendingSellers />} />
                <Route path="sellers/blocked" element={<BlockedSellers />} />

              </Route>
              <Route path="/comparisons" element={<Comparisons />} />
              <Route path="/FAQs" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            
          </Layout>

          <Toaster />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
