import React from 'react';
import { useNavigate } from "react-router-dom";
import Back_Button from "../assets/Backbutton2.png";

export const BackBTN = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="h-7 w-7 mt-2 ml-2 bg-white rounded-full hover:scale-105 transition-all duration-300 hover:shadow-lg"
      onClick={() => navigate(-1)}
    >
      <img src={Back_Button} alt="Back Button" className="h-full w-full rounded-full" />
      {/* <span className='h-5 w-5 mt-2 ml-1 '>Back</span> */}
    </button>
    
    
  )
}