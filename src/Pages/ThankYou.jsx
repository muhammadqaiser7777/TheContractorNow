import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center">
      <h1 className="text-4xl font-bold text-[#ffb000] mb-4">Thank You!</h1>
      <img
        src="/assets/images/thank-you.gif"
        alt=""
        className="w-20 h-20 object-contain"
      />
      <p className="text-xl text-[#1f2020] mb-6 font-bold">
        Your form has been successfully submitted. You will get call soon.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-[#ffb000] text-[#1f2020] rounded-lg shadow-md hover:bg-secondary hover:text-white"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default ThankYou;
