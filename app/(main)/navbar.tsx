'use client'
import Link from 'next/link'
import React from 'react'
import {
    FaUser,
    FaQuestionCircle,
    FaPhone,
    FaInfoCircle,
    FaImages 
  } from "react-icons/fa";
  
function NavBar({loggedIn}:{loggedIn:boolean}) {
  return (
    <div className="flex flex-row justify-between items-center bg-gray-800 text-white  lg:left-[calc(50%-270px)] text-lg w-full bg-opacity-30 lg:w-auto rounded-lg absolute z-50 top-0">
    <div className="flex flex-row flex-wrap w-full justify-center lg:w-auto p-6 rounded-lg sm:flex-row gap-4  content-start">
      <a href={loggedIn?"/dashboard":"/sign-in"} className="flex items-center hover:text-gray-400">
        <FaUser className="mr-2" /> {loggedIn?"Portal":"Login"}
      </a>
      <a href="#" className="flex items-center hover:text-gray-400">
        <FaQuestionCircle className="mr-2" /> Enquiries
      </a>
      <a href="#" className="flex items-center hover:text-gray-400">
          <FaImages className="mr-2" /> Gallery
        </a>
      <a href="#" className="flex items-center hover:text-gray-400">
        <FaPhone className="mr-2" /> Contact Us
      </a>
      <a href="#about" className="flex items-center hover:text-gray-400">
        <FaInfoCircle className="mr-2" /> About Us
      </a>
    </div>
  </div>
  )
}

export default NavBar
