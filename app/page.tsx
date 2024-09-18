import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png"
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold hidden sm:block">{process.env.NEXT_PUBLIC_SCHOOL}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#courses" className="hover:underline">Courses</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow bg-blue-100 dark:bg-blue-900 py-16 text-center w-full">
        <div className="container mx-auto px-4">
           <Image src={Logo} alt="logo" className="w-[300px] mx-auto mb-8"></Image>
          <h2 className="text-4xl font-bold mb-4">Welcome to {process.env.NEXT_PUBLIC_SCHOOL}</h2>
          <p className="text-lg mb-8">Providing quality education and a nurturing environment for students to thrive.</p>
          <a href="#contact" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 transition">Get In Touch</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white dark:bg-gray-800 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
          <p className="text-lg text-center">Our school, {process.env.NEXT_PUBLIC_SCHOOL}, is dedicated to fostering a love of learning and providing a supportive community for students. We offer a wide range of programs and extracurricular activities designed to enrich students{"'"} educational experiences.</p>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-gray-100 dark:bg-gray-900 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Mathematics</h3>
              <p>Explore the fundamentals of mathematics with our comprehensive curriculum.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Science</h3>
              <p>Dive into the world of science with engaging experiments and hands-on learning.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">English</h3>
              <p>Enhance your language skills with our dynamic English courses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-800 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg mb-8">We{"'"}d love to hear from you! Reach out to us for more information or to schedule a visit.</p>
          <a href="mailto:info@myschool.com" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 transition">Email Us</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 dark:bg-blue-800 w-full">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {process.env.NEXT_PUBLIC_SCHOOL}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
