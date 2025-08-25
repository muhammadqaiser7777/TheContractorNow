import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { allServices } from "./servicesData";

const NavBar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesSubmenuOpen, setServicesSubmenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Determine if the current page matches the link path
  const isActiveLink = (path) => location.pathname === path;

  // Toggle main menu visibility
  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => {
      if (!prev) setServicesSubmenuOpen(false); // Close submenu when opening the main menu
      return !prev;
    });
  };

  // Toggle services submenu visibility
  const toggleServicesSubmenu = () =>
    setServicesSubmenuOpen((prev) => !prev);

  const handleAnimationEnd = () => {
    if (!menuOpen) setServicesSubmenuOpen(false); // Ensure submenu is closed after main menu hides
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".btn-ghost")
      ) {
        setMenuOpen(false);
        setServicesSubmenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="navbar bg-[#1f2020] text-base-100 fixed top-0 left-0 w-full z-20 shadow-lg">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Menu (Hamburger Icon) */}
          <div className="md:hidden">
            <button className="btn btn-ghost" onClick={toggleMenu}>
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              className="h-14 lg:h-16 pl-3"
              src="/assets/images/logo.png"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-16 left-0 bg-[#1f2020] w-60 text-base-100 z-10 shadow-lg rounded-xl"
            onAnimationEnd={handleAnimationEnd}
          >
            <ul className="menu p-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`${
                    isActiveLink("/") ? "text-[#ffb000] font-bold" : "text-base-100"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleServicesSubmenu();
                    }}
                  >
                    Services
                  </button>
                  <button
                    onClick={toggleServicesSubmenu}
                    className={
                      isActiveLink("/services") ? "text-[#ffb000] font-bold" : ""
                    }
                  >
                    {servicesSubmenuOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 15l-6-6-6 6"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 9l6 6 6-6"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {servicesSubmenuOpen && (
                  <ul className="pl-4">
                    {allServices.map((service) => (
                      <li key={service.title}>
                        <Link
                          to={`/services/${service.title}`}
                          state={{ title: service.title }}
                          onClick={() => {
                            setMenuOpen(false);
                            setServicesSubmenuOpen(false);
                          }}
                          className={`${
                            location.pathname.includes(`/services/${service.title}`)
                              ? "text-[#ffb000] font-bold"
                              : "text-base-100"
                          }`}
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  to="/aboutUs"
                  onClick={() => setMenuOpen(false)}
                  className={`${
                    isActiveLink("/aboutUs")
                      ? "text-[#ffb000] font-bold"
                      : "text-base-100"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`${
                    isActiveLink("/contact")
                      ? "text-[#ffb000] font-bold"
                      : "text-base-100"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Navbar Center (Desktop) */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu-lg menu-horizontal px-1 text-[16px]">
            <li>
              <Link
                to="/"
                className={`hover:text-[#ffb000] hover-underline-animation ${
                  isActiveLink("/") ? "text-[#ffb000] font-bold active-underline" : "text-base-100"
                }`}
              >
                Home
              </Link>
            </li>
            <li className="relative group">
              <Link
                to="/services"
                className={`hover:text-[#ffb000] hover-underline-animation ${
                  isActiveLink("/services")
                    ? "text-[#ffb000] font-bold active-underline"
                    : "text-base-100"
                }`}
              >
                Services
              </Link>
              <ul className="absolute hidden group-hover:grid bg-[#1f2020] p-6 rounded-lg shadow-lg w-[400px] gap-4 z-20 top-full left-0 grid-cols-2">
                {allServices.map((service) => (
                  <li key={service.title}>
                    <Link
                      to={`/services/${service.title}`}
                      state={{ title: service.title }}
                      className={`hover:text-[#ffb000] ${
                        location.pathname.includes(`/services/${service.title}`)
                          ? "text-[#ffb000] font-bold"
                          : "text-base-100"
                      }`}
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                to="/contact"
                className={`hover:text-[#ffb000] hover-underline-animation ${
                  isActiveLink("/contact")
                    ? "text-[#ffb000] font-bold active-underline"
                    : "text-base-100"
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/aboutUs"
                className={`hover:text-[#ffb000] hover-underline-animation ${
                  isActiveLink("/aboutUs")
                    ? "text-[#ffb000] font-bold active-underline"
                    : "text-base-100"
                }`}
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end">
          <Link
            className="btn bg-[#ffb000] text-black transition duration-300"
            to="/services"
          >
            Get Quotes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
