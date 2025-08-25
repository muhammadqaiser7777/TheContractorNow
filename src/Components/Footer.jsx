import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="footer bg-black text-base-200 p-10">
        <nav>
          <Link to="/" className="">
            <img className="h-14 lg:h-16 pl-3" src="/assets/images/logo.png" alt="Logo" />
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link className="hover-underline-animation" to="/userTerms">Terms of use</Link>
          <Link className="hover-underline-animation" to="/privacyPolicy">
            Privacy policy
          </Link>
          <Link className="hover-underline-animation" to="/californiaPrivacy">
            California Privacy Notice
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link className="hover-underline-animation" to="/aboutUs">
            About us
          </Link>
          <Link className="hover-underline-animation" to="/contact">
            Contact
          </Link>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All rights reserved by TheContractorNow Ltd
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
