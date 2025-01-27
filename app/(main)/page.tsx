"use server";
import React from "react";
import bg from "@/public/bg.jpg";
import logo_t from "@/public/logo.png";
import Image from "next/image";

function page() {
  return (
    <div>
      <div className=" bg-[url(./../public/bg2.jpg)] md:bg-[url(./../public/bg.jpg)]  bg-cover  bg-no-repeat w-full min-h-[400px] flex flex-col justify-center items-center p-4 font-bold md:h-dvh">
        <Image alt="" src={logo_t} className="w-[200px] animate-bounce"></Image>
        <div className="text-3xl text-white lg:text-5xl md:ml-12 text-center">Welcome to {process.env.NEXT_PUBLIC_SCHOOL}</div>
      </div>
     
    <section className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-12 px-6 w-full">
      <div className="w-full">
        <h2 className="text-4xl font-bold text-center mb-6">About Us</h2>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <strong>Modern Little Stars School</strong>, a beacon of
          academic excellence and holistic education located in the heart of
          Abrepo Tikese, Yaw Atia Street, Kumasi. Since our establishment in
          2013, we have been committed to nurturing young minds and empowering
          them to reach their fullest potential. Guided by our motto, 
          <em>Reaching High to the Stars</em> we aim to inspire students to
          excel academically, socially, and morally.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          At Modern Little Stars School, we believe in creating an inclusive and
          nurturing environment where every child feels valued and supported.
          Our dedicated team of educators employs modern teaching techniques and
          resources to deliver a well-rounded curriculum that fosters critical
          thinking, creativity, and problem-solving skills. We prioritise both
          academic success and character development, preparing our students for
          a bright future in an ever-changing world.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Our state-of-the-art facilities and innovative programmes are designed
          to provide students with the best possible learning experiences. From
          vibrant classrooms to engaging extracurricular activities, we strive
          to cultivate a culture of curiosity and continuous growth. Parents and
          guardians are our partners in this journey, and we value their
          involvement in shaping the success of our students.
        </p>
        <p className="text-lg leading-relaxed">
          Join us at Modern Little Stars School and become part of a community
          that believes in aiming high, achieving excellence, and transforming
          dreams into reality. Together, we are shaping tomorrow’s leaders and
          ensuring that every child has the opportunity to shine among the
          stars.
        </p>
      </div>
    </section>
    <footer className="bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Email Subscription */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Stay Updated!</h2>
            <p className="text-sm mt-2">
              Subscribe to our newsletter to receive the latest updates and
              news from Modern Little Stars School.
            </p>
          </div>
          <form
            className="flex items-center w-full md:w-auto gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-64 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Section: Links and Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Links */}
            <nav className="flex gap-4">
              <a
                href="#about"
                className="text-sm hover:text-blue-500 dark:hover:text-blue-400"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="text-sm hover:text-blue-500 dark:hover:text-blue-400"
              >
                Contact
              </a>
              <a
                href="./privacy"
                className="text-sm hover:text-blue-500 dark:hover:text-blue-400"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-sm hover:text-blue-500 dark:hover:text-blue-400"
              >
                Terms of Service
              </a>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} Modern Little Stars School. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default page;
