import { useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Layout({ children }) {
  const location = useLocation();

  
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}