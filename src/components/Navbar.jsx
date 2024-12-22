import React from 'react'
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <nav className="bg-purple-300 p-4 rounded-b-3xl">
    <div className="container mx-auto flex justify-between items-center">
      <a href="/" className="text-emerald-600 md:text-xl lg:text-2xl font-bold">Resume Analyzer</a>
      <ul className="flex space-x-4">
          <li className='space-x-4 text-xl  font-serif'>
            <Link className="rounded-lg border-sky-800 border-2 p-1 hover:bg-teal-400 hover:text-white lg:ring-2 lg:ring-offset-4" to="/">Home</Link>
            <Link className="rounded-lg border-sky-800 border-2 p-1 hover:bg-teal-400 hover:text-white lg:ring-2 lg:ring-offset-4" to="/result">Result</Link>
          </li>
      </ul>
    </div>
  </nav>
  )
}

export default Navbar