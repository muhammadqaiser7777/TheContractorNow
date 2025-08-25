import React from "react";
import { useNavigate } from "react-router-dom";
import { allServices } from "../Components/servicesData";

const Services = ({ visibleServices }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-12">
      <h1 className="font-bold text-4xl text-center pt-10 pb-10 hover:text-[rgb(255,176,0)] transition duration-300">
        Our Offered Services
      </h1>
      <div className="container mx-auto px-6 lg:px-20 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {allServices.slice(0, visibleServices).map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-md hover:shadow-[2px_4px_6px_rgba(31,32,32,1)] rounded-lg p-6 text-center"
              onClick={() => navigate(`/services/${service.title}`)}
            >
              <div className="mb-4 ">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 ">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button
                className="px-4 py-2 bg-[#1f2020] text-white rounded-lg hover:bg-[#ffb000] transition duration-300 hover:text-black"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
        {visibleServices < allServices.length && (
          <div className="text-center mt-8">
            <button
              className="btn bg-[#ffb000] animate-bounce"
              onClick={() => navigate("/services")}
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
