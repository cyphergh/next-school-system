import React from 'react'

function WebFooter() {
  return (
    <footer className="bg-gray-800 text-white py-8 dark:bg-gray-900 dark:text-gray-200 snap-start h-screen">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Golden Heart Academy</h2>
          <p className="text-gray-400 mt-2 dark:text-gray-400">Amanfrom-Kumasi, Ghana</p>
          <p className="text-gray-400 dark:text-gray-400">Contact: +233244626639</p>
          <p className="text-gray-400 dark:text-gray-400">
            Email: <a href="mailto:info@goldenheartacademy.online" className="text-white  dark:text-gray-300 no-underline">info@goldenheartacademy.online</a>
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg italic">#STAY OPEN</p>
        </div>
      </div>
      
      <div className="mt-6 w-full sm:w-auto">
        <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
        <p className="text-gray-400 dark:text-gray-400">Stay updated with the latest news and events.</p>
        <form className="flex mt-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-l-md bg-gray-700 text-white dark:bg-gray-800"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Subscribe
          </button>
        </form>
      </div>
      <div className='text-center p-2'>Powered by FlourishTechSociety +233206821921</div>
      <div className="mt-6 border-t border-gray-700 pt-4 dark:border-gray-600">
        <p className="text-center text-gray-400 text-sm dark:text-gray-400">© {new Date().getFullYear()} Golden Heart Academy. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default WebFooter