import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import AboutUs from "./Pages/AboutUs";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";
import Footer from "./Components/Footer";
import ServiceDetails from "./Components/ServiceDetails";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import CaliforniaPrivacyNotice from "./Pages/CaliforniaPrivacyNotice";
import UserTerms from "./Pages/UserTerms";
import AutoScroll from "./Components/AutoScroll";
import ScrollUpButton from "./Components/scrollUpButton";
import ThankYou from "./Pages/ThankYou";
import ServiceProviders from "./Pages/ServiceProviders";

// Page Not Found Component
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
      <h1 className="text-4xl font-bold text-[#1f2020] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-800 mb-6">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="px-6 py-2 text-[#1f2020] bg-[] rounded-md">
        Go Back to Home
      </a>
    </div>
  );
}

function App() {
  // Dynamically determine the basename
  // const basePath = window.location.pathname
  //   .split("/")
  //   .slice(0, window.location.pathname.split("/").indexOf("thecontractornow") + 1)
  //   .join("/");

  return (
    <Router>
      <Navbar data={{ Services }} />
      <AutoScroll />
      <ScrollUpButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:title" element={<ServiceDetails />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/marketingPartners" element={<ServiceProviders />} />
        <Route
          path="/californiaPrivacy"
          element={<CaliforniaPrivacyNotice />}
        />
        <Route path="/userTerms" element={<UserTerms />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/thankYou" element={<ThankYou />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
