import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

 
  const showLogin = location.pathname === "/login";
  const showSignup = location.pathname === "/signup";

 
  const handleClose = () => navigate("/");


  const isBlurred = showLogin || showSignup;

  return (
    <>
      
      <div className={isBlurred ? "blur-sm pointer-events-none" : ""}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>

    
      {showLogin && <Login onClose={handleClose} />}
      {showSignup && <Signup onClose={handleClose} />}
    </>
  );
}
